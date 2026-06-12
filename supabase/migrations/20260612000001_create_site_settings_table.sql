-- Migration: create_site_settings_table
-- Single-row table with site-wide toggles editable from the admin panel.
-- First use: the hero availability badge ("Aceptamos nuevos proyectos" vs a
-- custom "closed" message in red).
-- Reads/writes happen exclusively through server fns using the service-role
-- client, so RLS is enabled with NO policies: anon/authenticated get nothing.

-- -----------------------------------------------------------------------
-- Table (single row enforced by CHECK on the fixed primary key)
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                  smallint    PRIMARY KEY DEFAULT 1
                        CONSTRAINT site_settings_single_row CHECK (id = 1),
  accepting_projects  boolean     NOT NULL DEFAULT true,
  closed_message      text        NOT NULL DEFAULT 'Ahora mismo no aceptamos nuevos proyectos',
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Seed the single row so reads never come back empty.
INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------
-- Row-Level Security
-- -----------------------------------------------------------------------
-- service_role bypasses RLS; with no policies defined, anon and authenticated
-- roles cannot read or write this table directly.
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
