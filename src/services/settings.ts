// settings.ts — server fns for site-wide settings (single row in
// site_settings, see the create_site_settings_table migration).
//
// Public read: getSiteSettingsFn (feeds the hero availability badge)
// Admin write: updateSiteSettingsFn
//
// All access goes through the service-role client: site_settings has RLS
// enabled with no policies, so anon/authenticated cannot touch it directly.

import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { getServiceClient } from '@everyone-web/libs/supabase-server';
import { requireAdmin } from '@everyone-web/server/auth';
import type { SiteSettingsRow } from '@everyone-web/types/supabase';

export const DEFAULT_CLOSED_MESSAGE = 'Ahora mismo no aceptamos nuevos proyectos';

const FALLBACK_SETTINGS: SiteSettingsRow = {
  id: 1,
  accepting_projects: true,
  closed_message: DEFAULT_CLOSED_MESSAGE,
  updated_at: new Date(0).toISOString(),
};

/**
 * Returns the site settings row. Public — the availability badge on the
 * landing needs it. Falls back to "open" defaults if the row is missing or
 * the database is unreachable, so the landing never breaks because of this.
 */
export const getSiteSettingsFn = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const svc = getServiceClient();
    const { data, error } = await svc.from('site_settings').select('*').eq('id', 1).single();
    if (error || !data) return FALLBACK_SETTINGS;
    return data as SiteSettingsRow;
  } catch {
    return FALLBACK_SETTINGS;
  }
});

const updateSettingsSchema = z.object({
  accepting_projects: z.boolean(),
  closed_message: z.string().trim().min(1).max(80),
});

/**
 * Updates the availability toggle and the closed message. Admin-gated.
 */
export const updateSiteSettingsFn = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => updateSettingsSchema.parse(input))
  .handler(async ({ data }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    const { data: row, error } = await svc
      .from('site_settings')
      .upsert({ id: 1, ...data, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return row as SiteSettingsRow;
  });
