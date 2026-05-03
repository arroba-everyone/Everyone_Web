// deals.ts — server fns and helpers for the deals feature.
//
// Public read: getPublicDealsFn (SSR, cookie-bound client, gated for anon)
// Admin mutations: getAllDealsForAdminFn, setDealStatusFn, updateDealFn, deleteDealFn
// Pure helper: sanitiseLockedDeal (exported for testing)

import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { getServerClient, getServiceClient } from '@everyone-web/libs/supabase.server';
import { getSession, requireAdmin } from '@everyone-web/server/auth.server';
import type { DealRow, DealUpdate } from '@everyone-web/types/supabase';

// ---------------------------------------------------------------------------
// Public-facing types
// ---------------------------------------------------------------------------

/**
 * A full deal visible to authenticated users.
 * This is the raw DealRow extended with is_locked: false.
 */
export type PublicDeal = DealRow & { is_locked: false };

/**
 * The sanitised 6th-slot deal visible to anonymous visitors.
 * Contains ONLY id, title, image_url and is_locked: true — no price data.
 */
export type LockedDeal = {
  id: string;
  title: string;
  image_url: string | null;
  is_locked: true;
};

// ---------------------------------------------------------------------------
// sanitiseLockedDeal — pure function, exported for testing
// ---------------------------------------------------------------------------

/**
 * Strips all sensitive fields from a deal row, returning only the fields
 * safe to send to anonymous visitors (no prices, no affiliate/original URLs).
 *
 * See design §ADR-5 and REQ-DEALS-1.
 */
export function sanitiseLockedDeal(deal: DealRow): LockedDeal {
  return {
    id: deal.id,
    title: deal.title,
    image_url: deal.image_url,
    is_locked: true,
  };
}

// ---------------------------------------------------------------------------
// getPublicDealsFn — SSR loader for /deals
// ---------------------------------------------------------------------------

/**
 * Returns published deals for the /deals page.
 *
 * - Anon visitor   → 5 full deals + 1 locked (sanitised) deal
 * - Authenticated  → all published deals, no locked slot
 * - Fewer than 6   → lockedDeal is null
 *
 * See design §4.6 and REQ-DEALS-1 through REQ-DEALS-5.
 */
export const getPublicDealsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest();
  const session = await getSession(request);
  const client = getServerClient(request);

  if (session) {
    // Authenticated: return all published deals
    const { data, error } = await client
      .from('deals')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;

    const deals: PublicDeal[] = (data ?? []).map(d => ({ ...d, is_locked: false as const }));
    return { deals, lockedDeal: null };
  }

  // Anonymous: fetch up to 6 published deals
  const { data, error } = await client
    .from('deals')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6);

  if (error) throw error;

  const rows = data ?? [];

  if (rows.length <= 5) {
    const deals: PublicDeal[] = rows.map(d => ({ ...d, is_locked: false as const }));
    return { deals, lockedDeal: null };
  }

  const deals: PublicDeal[] = rows.slice(0, 5).map(d => ({ ...d, is_locked: false as const }));
  const lockedDeal: LockedDeal = sanitiseLockedDeal(rows[5]);
  return { deals, lockedDeal };
});

// ---------------------------------------------------------------------------
// Admin server fns
// ---------------------------------------------------------------------------

/**
 * Returns ALL deals regardless of status. Admin-gated.
 */
export const getAllDealsForAdminFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest();
  await requireAdmin(request);
  const svc = getServiceClient();

  const { data, error } = await svc
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
});

/**
 * Updates a deal's editable fields. Admin-gated.
 */
export const updateDealFn = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string; fields: DealUpdate }) => input)
  .handler(async ({ data: { id, fields } }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    const { data, error } = await svc.from('deals').update(fields).eq('id', id).select().single();

    if (error) throw error;
    return data;
  });

/**
 * Sets a deal's status. Publishing sets `published_at = now()` if currently null.
 * Admin-gated.
 */
export const setDealStatusFn = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string; status: 'pending' | 'published' | 'rejected' }) => input)
  .handler(async ({ data: { id, status } }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    // Check current published_at when transitioning to published
    let published_at: string | undefined;
    if (status === 'published') {
      const { data: current } = await svc
        .from('deals')
        .select('published_at')
        .eq('id', id)
        .single();
      if (!current?.published_at) {
        published_at = new Date().toISOString();
      }
    }

    const updatePayload: DealUpdate = { status };
    if (published_at !== undefined) {
      updatePayload.published_at = published_at;
    }

    const { data, error } = await svc
      .from('deals')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  });

/**
 * Deletes a deal permanently. Admin-gated.
 */
export const deleteDealFn = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data: { id } }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    const { error } = await svc.from('deals').delete().eq('id', id);
    if (error) throw error;
  });
