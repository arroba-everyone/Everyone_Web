// deals.ts — server fns and helpers for the deals feature.
//
// Public read: getPublicDealsFn (SSR, cookie-bound client, gated for anon)
// Admin mutations: getAllDealsForAdminFn, setDealStatusFn, updateDealFn, deleteDealFn
//                  publishDealWithEditsFn, createDealFn
// Pure helper: sanitiseLockedDeal (exported for testing)

import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { getServerClient, getServiceClient } from '@everyone-web/libs/supabase.server';
import { getSession, requireAdmin } from '@everyone-web/server/auth.server';
import { dealCreateSchema } from '@everyone-web/lib/validators/deal';
import { calculateDiscount } from '@everyone-web/lib/deals/calculate-discount';
import type { DealRow, DealUpdate, DealInsert } from '@everyone-web/types/supabase';

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

/**
 * Persists the admin's edits and triggers Telegram publication.
 *
 * Step 1 — UPDATE the row with `hashtags` + `youtube_review_url` so the Edge
 * Function reads the user-edited values when formatting the message. Status
 * is NOT changed here — the EF flips it to 'published' itself after sending.
 *
 * Step 2 — invoke the `publish-to-telegram` Edge Function via HTTP POST.
 * The EF loads the row, sends the message, then UPDATEs telegram_message_id,
 * published_at and status='published'. If the Telegram send fails, the EF
 * returns 4xx/5xx and we surface the error to the dialog.
 *
 * Step 3 — re-read the row to return the post-EF state.
 *
 * Requires server env vars: VITE_SUPABASE_URL, BOT_INVOKE_SECRET.
 * Admin-gated.
 */
const publishInputSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  hashtags: z.array(z.string()),
  youtube_review_url: z.string().nullable(),
  previous_price: z.number().positive(),
});

export const publishDealWithEditsFn = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => publishInputSchema.parse(input))
  .handler(async ({ data: { id, title, hashtags, youtube_review_url, previous_price } }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    const supabaseUrl = process.env['VITE_SUPABASE_URL'];
    const botSecret = process.env['BOT_INVOKE_SECRET'];
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL is not set in the server environment.');
    }
    if (!botSecret) {
      throw new Error('BOT_INVOKE_SECRET is not set in the server environment.');
    }

    // Step 1: Read current_price and published_at from DB (source of truth for discount calc)
    const { data: currentRow, error: selectError } = await svc
      .from('deals')
      .select('current_price, published_at')
      .eq('id', id)
      .single();
    if (selectError) throw selectError;
    if (!currentRow) throw new Error(`Deal ${id} not found`);

    const discount_percent = calculateDiscount(currentRow.current_price, previous_price);

    // Step 2: Determine published_at (preserve existing or set now)
    const published_at = currentRow.published_at ?? new Date().toISOString();

    // Step 3: UPDATE (must succeed before invoking EF)
    const editPayload: DealUpdate = {
      title,
      hashtags,
      youtube_review_url,
      previous_price,
      discount_percent,
      status: 'published',
      published_at,
    };
    const { error: updateError } = await svc.from('deals').update(editPayload).eq('id', id);
    if (updateError) throw updateError;

    // Step 4: Invoke Edge Function (reads fresh data from DB)
    const efResponse = await fetch(`${supabaseUrl}/functions/v1/publish-to-telegram`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${botSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deal_id: id }),
    });

    if (!efResponse.ok) {
      const detail = await efResponse.text();
      throw new Error(`publish-to-telegram failed (${efResponse.status}): ${detail || 'no body'}`);
    }

    // Step 5: Re-read final state
    const { data, error } = await svc.from('deals').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  });

/**
 * Creates a new deal with status='pending'. Validates input against
 * dealCreateSchema before hitting Supabase. Admin-gated.
 */
export const createDealFn = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => dealCreateSchema.parse(input))
  .handler(async ({ data }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    const insertPayload: DealInsert = {
      title: data.title,
      current_price: data.current_price,
      original_url: data.original_url,
      source: data.source,
      status: 'pending',
      found_at: new Date().toISOString(),
      previous_price: data.previous_price ?? null,
      average_price: data.average_price ?? null,
      discount_percent: data.discount_percent ?? null,
      image_url: data.image_url ?? null,
      affiliate_url: data.affiliate_url ?? null,
      youtube_review_url: data.youtube_review_url ?? null,
      hashtags: data.hashtags ?? null,
    };

    const { data: row, error } = await svc.from('deals').insert(insertPayload).select().single();

    if (error) throw error;
    return row;
  });
