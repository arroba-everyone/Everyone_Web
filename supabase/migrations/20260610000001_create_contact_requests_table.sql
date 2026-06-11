-- Migration: create_contact_requests_table
-- Stores contact-form submissions from the public website.
-- Inserts/reads happen exclusively through server fns using the service-role
-- client, so RLS is enabled with NO policies: anon/authenticated get nothing.

-- -----------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  email         text        NOT NULL,
  company       text,
  project_type  text        NOT NULL DEFAULT 'otro'
                  CONSTRAINT contact_requests_project_type_check
                  CHECK (project_type IN ('web', 'ecommerce', 'app', 'arvr', 'sistema', 'otro')),
  message       text        NOT NULL,
  status        text        NOT NULL DEFAULT 'new'
                  CONSTRAINT contact_requests_status_check
                  CHECK (status IN ('new', 'replied', 'archived')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS contact_requests_status_created_at_idx
  ON public.contact_requests (status, created_at DESC);

-- -----------------------------------------------------------------------
-- Row-Level Security
-- -----------------------------------------------------------------------
-- service_role bypasses RLS; with no policies defined, anon and authenticated
-- roles cannot read or write this table directly.
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
