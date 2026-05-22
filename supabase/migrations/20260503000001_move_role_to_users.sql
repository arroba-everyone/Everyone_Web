-- Migration: move_role_to_users
-- Moves the source of truth for the admin role from auth.users.app_metadata
-- to public.users.role. Adds the column, a helper is_admin() function, a
-- guard trigger to prevent self-elevation, and rewrites every RLS policy
-- that previously read app_metadata.

-- -----------------------------------------------------------------------
-- 1. Add `role` column to public.users
-- -----------------------------------------------------------------------
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
    CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));

-- -----------------------------------------------------------------------
-- 2. is_admin() — used by all RLS policies that gate admin-only actions
-- -----------------------------------------------------------------------
-- SECURITY DEFINER lets it read public.users without tripping over its own
-- RLS. STABLE lets the planner cache the result within a transaction.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------
-- 3. Guard trigger: prevent non-admins from changing their own role
-- -----------------------------------------------------------------------
-- The existing users_self_update RLS policy lets a user update their own
-- row. Without this trigger they could promote themselves to admin. The
-- trigger fires only when the role column actually changes; service_role
-- (auth.uid() IS NULL) bypasses the check so dashboard SQL still works.
CREATE OR REPLACE FUNCTION public.prevent_role_self_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'role can only be changed by an admin or service_role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_prevent_role_self_change ON public.users;

CREATE TRIGGER users_prevent_role_self_change
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_change();

-- -----------------------------------------------------------------------
-- 4. Rewrite RLS policies to use public.is_admin()
-- -----------------------------------------------------------------------

-- public.deals — admin full CRUD
DROP POLICY IF EXISTS deals_admin_all ON public.deals;
CREATE POLICY deals_admin_all
  ON public.deals
  FOR ALL
  TO authenticated
  USING     (public.is_admin())
  WITH CHECK (public.is_admin());

-- public.posts — admin full CRUD
DROP POLICY IF EXISTS posts_admin_all ON public.posts;
CREATE POLICY posts_admin_all
  ON public.posts
  FOR ALL
  TO authenticated
  USING     (public.is_admin())
  WITH CHECK (public.is_admin());

-- public.users — admin SELECT all
DROP POLICY IF EXISTS users_admin_select ON public.users;
CREATE POLICY users_admin_select
  ON public.users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- public.users — admin UPDATE all
DROP POLICY IF EXISTS users_admin_update ON public.users;
CREATE POLICY users_admin_update
  ON public.users
  FOR UPDATE
  TO authenticated
  USING     (public.is_admin())
  WITH CHECK (public.is_admin());
