-- Migration: create_deals_table
-- Creates the public.deals table with all columns, indexes, updated_at trigger, and RLS policies.
-- REQ-RLS-1 through REQ-RLS-4 / spec §5.1

-- -----------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deals (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text        NOT NULL,
  current_price       numeric(10, 2) NOT NULL,
  previous_price      numeric(10, 2),
  average_price       numeric(10, 2),
  discount_percent    numeric(5, 2),
  image_url           text,
  original_url        text        NOT NULL,
  affiliate_url       text,
  source              text        NOT NULL,
  status              text        NOT NULL DEFAULT 'pending'
                        CONSTRAINT deals_status_check CHECK (status IN ('pending', 'published', 'rejected')),
  found_at            timestamptz NOT NULL DEFAULT now(),
  published_at        timestamptz,
  telegram_message_id bigint,
  chollometro_id      text        UNIQUE,
  group_id            text,
  youtube_review_url  text,
  hashtags            text[]      DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS deals_status_published_at_idx
  ON public.deals (status, published_at DESC);

-- The UNIQUE constraint on chollometro_id already creates an implicit index.
-- No additional explicit index needed.

-- -----------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_deals()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_updated_at_deals ON public.deals;

CREATE TRIGGER update_updated_at_deals
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_deals();

-- -----------------------------------------------------------------------
-- Row-Level Security
-- -----------------------------------------------------------------------
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- NOTE: service_role bypasses RLS by default — no explicit policy needed for it.

-- SELECT for anon: only published deals (REQ-RLS-1)
DROP POLICY IF EXISTS deals_anon_select ON public.deals;
CREATE POLICY deals_anon_select
  ON public.deals
  FOR SELECT
  TO anon
  USING (status = 'published');

-- SELECT for authenticated non-admin: only published deals (REQ-RLS-2)
DROP POLICY IF EXISTS deals_authenticated_select ON public.deals;
CREATE POLICY deals_authenticated_select
  ON public.deals
  FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Full CRUD for admin (REQ-RLS-3)
-- Admin is identified by app_metadata.role = 'admin' on the JWT.
DROP POLICY IF EXISTS deals_admin_all ON public.deals;
CREATE POLICY deals_admin_all
  ON public.deals
  FOR ALL
  TO authenticated
  USING     ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
