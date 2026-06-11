import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// Mock server-only modules BEFORE importing deals
vi.mock('@everyone-web/libs/supabase-server', () => ({
  getServerClient: vi.fn(),
  getServiceClient: vi.fn(),
}));
vi.mock('@tanstack/react-start/server', () => ({
  getRequest: vi.fn(),
}));
vi.mock('@everyone-web/server/auth', () => ({
  getSession: vi.fn(),
  requireAdmin: vi.fn(),
}));
// createServerFn mock: returns the handler directly so tests can call it
vi.mock('@tanstack/react-start', () => ({
  createServerFn: vi.fn(() => ({
    inputValidator: vi.fn().mockReturnThis(),
    handler: vi.fn((fn: unknown) => fn),
  })),
}));

import { getPublicDealsFn, getAllDealsForAdminFn } from '@everyone-web/services/deals';
import { getServerClient, getServiceClient } from '@everyone-web/libs/supabase-server';
import { getRequest } from '@tanstack/react-start/server';
import { getSession, requireAdmin } from '@everyone-web/server/auth';
import type { DealRow } from '@everyone-web/types/supabase';

// Helpers

function makeDeal(overrides: Partial<DealRow> = {}): DealRow {
  return {
    id: overrides.id ?? 'deal-1',
    title: overrides.title ?? 'Deal Test',
    current_price: overrides.current_price ?? 100,
    previous_price: overrides.previous_price ?? 150,
    average_price: overrides.average_price ?? 130,
    discount_percent: overrides.discount_percent ?? 33,
    image_url: overrides.image_url ?? 'https://example.com/img.jpg',
    original_url: overrides.original_url ?? 'https://example.com',
    affiliate_url: overrides.affiliate_url ?? 'https://aff.example.com',
    source: overrides.source ?? 'amazon',
    status: overrides.status ?? 'published',
    found_at: overrides.found_at ?? '2026-01-01T00:00:00Z',
    published_at: overrides.published_at ?? '2026-01-02T00:00:00Z',
    telegram_message_id: overrides.telegram_message_id ?? null,
    chollometro_id: overrides.chollometro_id ?? null,
    group_id: overrides.group_id ?? null,
    youtube_review_url: overrides.youtube_review_url ?? null,
    hashtags: overrides.hashtags ?? [],
    created_at: overrides.created_at ?? '2026-01-01T00:00:00Z',
    updated_at: overrides.updated_at ?? '2026-01-01T00:00:00Z',
  };
}

/**
 * Creates a minimal Supabase mock for anon path:
 * from().select().eq().order().limit() → { data, error }
 */
function makeAnonClientMock(rows: DealRow[]) {
  const limitMock = vi.fn().mockResolvedValue({ data: rows, error: null });
  const orderMock = vi.fn().mockReturnValue({ limit: limitMock });
  const eqMock = vi.fn().mockReturnValue({ order: orderMock });
  const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
  const fromMock = vi.fn().mockReturnValue({ select: selectMock });
  return { from: fromMock };
}

/**
 * Creates a minimal Supabase mock for auth path:
 * from().select().eq().order() → { data, error }
 */
function makeAuthClientMock(rows: DealRow[]) {
  const orderMock = vi.fn().mockResolvedValue({ data: rows, error: null });
  const eqMock = vi.fn().mockReturnValue({ order: orderMock });
  const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
  const fromMock = vi.fn().mockReturnValue({ select: selectMock });
  return { from: fromMock };
}

/**
 * Creates a minimal Supabase mock for admin path:
 * from().select().order() → { data, error }
 * from().delete().eq().lt() → { error } (stale-pending purge)
 */
function makeAdminClientMock(rows: DealRow[]) {
  const orderMock = vi.fn().mockResolvedValue({ data: rows, error: null });
  const selectMock = vi.fn().mockReturnValue({ order: orderMock });
  const ltMock = vi.fn().mockResolvedValue({ error: null });
  const deleteEqMock = vi.fn().mockReturnValue({ lt: ltMock });
  const deleteMock = vi.fn().mockReturnValue({ eq: deleteEqMock });
  const fromMock = vi.fn().mockReturnValue({ select: selectMock, delete: deleteMock });
  return { from: fromMock };
}

const mockFakeRequest = {} as Request;

beforeEach(() => {
  vi.clearAllMocks();
  (getRequest as Mock).mockReturnValue(mockFakeRequest);
});

// ---------------------------------------------------------------------------
// getPublicDealsFn
// ---------------------------------------------------------------------------

describe('getPublicDealsFn', () => {
  describe('anon visitor (session = null)', () => {
    it('returns 5 full deals and 1 locked deal when 6 published exist', async () => {
      (getSession as Mock).mockResolvedValue(null);

      const sixDeals = Array.from({ length: 6 }, (_, i) =>
        makeDeal({ id: `deal-${i + 1}`, title: `Deal ${i + 1}` })
      );

      (getServerClient as Mock).mockReturnValue(makeAnonClientMock(sixDeals));

      const result = await (
        getPublicDealsFn as unknown as () => Promise<{ deals: unknown[]; lockedDeal: unknown }>
      )();

      expect(result.deals).toHaveLength(5);
      expect(result.lockedDeal).not.toBeNull();
      expect((result.lockedDeal as Record<string, unknown>)['is_locked']).toBe(true);
      expect((result.lockedDeal as Record<string, unknown>)['id']).toBe('deal-6');
    });

    it('does not include price data in the locked deal', async () => {
      (getSession as Mock).mockResolvedValue(null);

      const sixDeals = Array.from({ length: 6 }, (_, i) =>
        makeDeal({ id: `deal-${i + 1}`, current_price: 200 })
      );

      (getServerClient as Mock).mockReturnValue(makeAnonClientMock(sixDeals));

      const result = await (
        getPublicDealsFn as unknown as () => Promise<{ deals: unknown[]; lockedDeal: unknown }>
      )();

      const locked = result.lockedDeal as Record<string, unknown>;
      expect(locked['current_price']).toBeUndefined();
      expect(locked['affiliate_url']).toBeUndefined();
      expect(locked['original_url']).toBeUndefined();
    });

    it('returns lockedDeal: null when fewer than 6 deals exist', async () => {
      (getSession as Mock).mockResolvedValue(null);

      const fiveDeals = Array.from({ length: 5 }, (_, i) => makeDeal({ id: `deal-${i + 1}` }));
      (getServerClient as Mock).mockReturnValue(makeAnonClientMock(fiveDeals));

      const result = await (
        getPublicDealsFn as unknown as () => Promise<{ deals: unknown[]; lockedDeal: unknown }>
      )();

      expect(result.deals).toHaveLength(5);
      expect(result.lockedDeal).toBeNull();
    });

    it('returns empty deals and lockedDeal: null when no deals exist', async () => {
      (getSession as Mock).mockResolvedValue(null);
      (getServerClient as Mock).mockReturnValue(makeAnonClientMock([]));

      const result = await (
        getPublicDealsFn as unknown as () => Promise<{ deals: unknown[]; lockedDeal: unknown }>
      )();

      expect(result.deals).toHaveLength(0);
      expect(result.lockedDeal).toBeNull();
    });
  });

  describe('authenticated visitor (session present)', () => {
    it('returns all published deals and no locked deal', async () => {
      (getSession as Mock).mockResolvedValue({
        userId: 'user-1',
        email: 'user@test.com',
        role: 'user',
      });

      const tenDeals = Array.from({ length: 10 }, (_, i) => makeDeal({ id: `deal-${i + 1}` }));
      (getServerClient as Mock).mockReturnValue(makeAuthClientMock(tenDeals));

      const result = await (
        getPublicDealsFn as unknown as () => Promise<{
          deals: Array<{ is_locked: boolean }>;
          lockedDeal: unknown;
        }>
      )();

      expect(result.deals).toHaveLength(10);
      expect(result.lockedDeal).toBeNull();
      result.deals.forEach(d => expect(d.is_locked).toBe(false));
    });
  });
});

// ---------------------------------------------------------------------------
// getAllDealsForAdminFn
// ---------------------------------------------------------------------------

describe('getAllDealsForAdminFn', () => {
  it('throws for non-admin (requireAdmin throws)', async () => {
    (requireAdmin as Mock).mockRejectedValue(new Response(null, { status: 403 }));

    await expect(
      (getAllDealsForAdminFn as unknown as () => Promise<unknown>)()
    ).rejects.toBeInstanceOf(Response);
  });

  it('returns all deals for admin regardless of status', async () => {
    (requireAdmin as Mock).mockResolvedValue({
      userId: 'admin-1',
      email: 'a@a.com',
      role: 'admin',
    });

    const deals = [
      makeDeal({ status: 'published' }),
      makeDeal({ id: 'deal-2', status: 'pending' }),
    ];
    (getServiceClient as Mock).mockReturnValue(makeAdminClientMock(deals));

    const result = await (getAllDealsForAdminFn as unknown as () => Promise<unknown[]>)();
    expect(result).toHaveLength(2);
  });
});
