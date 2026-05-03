-- Migration: posts_rls
-- Hardens RLS on the existing public.posts table.
-- REQ-RLS-5 (anon + authenticated SELECT published only) and REQ-RLS-6 (admin full access).
-- Uses DROP POLICY IF EXISTS guards for idempotency.

-- NOTE: service_role bypasses RLS by default — no explicit policy needed for it.

-- -----------------------------------------------------------------------
-- Enable RLS (safe to run even if already enabled)
-- -----------------------------------------------------------------------
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------
-- SELECT for anon: only published posts (REQ-RLS-5)
-- -----------------------------------------------------------------------
DROP POLICY IF EXISTS posts_anon_select ON public.posts;
CREATE POLICY posts_anon_select
  ON public.posts
  FOR SELECT
  TO anon
  USING (status = 'published');

-- -----------------------------------------------------------------------
-- SELECT for authenticated non-admin: only published posts (REQ-RLS-5)
-- -----------------------------------------------------------------------
DROP POLICY IF EXISTS posts_authenticated_select ON public.posts;
CREATE POLICY posts_authenticated_select
  ON public.posts
  FOR SELECT
  TO authenticated
  USING (status = 'published');

-- -----------------------------------------------------------------------
-- Full CRUD for admin (REQ-RLS-6)
-- Admin is identified by app_metadata.role = 'admin' on the JWT.
-- -----------------------------------------------------------------------
DROP POLICY IF EXISTS posts_admin_all ON public.posts;
CREATE POLICY posts_admin_all
  ON public.posts
  FOR ALL
  TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
