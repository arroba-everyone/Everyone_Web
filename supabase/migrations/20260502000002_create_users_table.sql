-- Migration: create_users_table
-- Creates the public.users table, the on_auth_user_created trigger, and RLS policies.
-- REQ-RLS-7 through REQ-RLS-9 / spec §5.2

-- NOTE: this is public.users (the application-level user record).
--       It is NOT auth.users (Supabase Auth's internal table). The two are
--       linked 1:1 via FK on id.

-- -----------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id           uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        text        NOT NULL,
  display_name text,
  avatar_url   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------
-- Row-Level Security
-- -----------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- NOTE: service_role bypasses RLS by default — no explicit policy needed for it.

-- SELECT own row for authenticated user (REQ-RLS-7)
DROP POLICY IF EXISTS users_self_select ON public.users;
CREATE POLICY users_self_select
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- UPDATE own row for authenticated user (REQ-RLS-7)
DROP POLICY IF EXISTS users_self_update ON public.users;
CREATE POLICY users_self_update
  ON public.users
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin SELECT all users (REQ-RLS-8)
DROP POLICY IF EXISTS users_admin_select ON public.users;
CREATE POLICY users_admin_select
  ON public.users
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Admin UPDATE all users (REQ-RLS-8)
DROP POLICY IF EXISTS users_admin_update ON public.users;
CREATE POLICY users_admin_update
  ON public.users
  FOR UPDATE
  TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Deny direct INSERT for anon and authenticated (REQ-RLS-9)
-- No INSERT policy is created → RLS blocks all direct inserts.
-- The only allowed insert path is the on_auth_user_created trigger (SECURITY DEFINER).

-- -----------------------------------------------------------------------
-- Trigger: auto-insert user row on new auth user
-- -----------------------------------------------------------------------

-- Function: runs as the table owner (SECURITY DEFINER = service-role equivalent)
-- so it can bypass RLS to insert the user row.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'avatar_url'  -- populated by Google OAuth; NULL for email sign-ups
  );
  RETURN NEW;
END;
$$;

-- Trigger fires after each new auth.users row
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
