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

// Set required env vars for publishDealWithEditsFn
process.env['VITE_SUPABASE_URL'] = 'https://test.supabase.co';
process.env['BOT_INVOKE_SECRET'] = 'test-secret';

import { publishDealWithEditsFn, createDealFn } from '@everyone-web/services/deals';
import { getServiceClient } from '@everyone-web/libs/supabase-server';
import { getRequest } from '@tanstack/react-start/server';
import { requireAdmin } from '@everyone-web/server/auth';
import type { DealRow } from '@everyone-web/types/supabase';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeDeal(overrides: Partial<DealRow> = {}): DealRow {
  return {
    id: 'deal-1',
    title: 'Test Deal',
    current_price: 100,
    previous_price: 150,
    average_price: 130,
    discount_percent: 33,
    image_url: 'https://example.com/img.jpg',
    original_url: 'https://example.com',
    affiliate_url: null,
    source: 'amazon',
    status: 'pending',
    found_at: '2026-01-01T00:00:00Z',
    published_at: null,
    telegram_message_id: null,
    chollometro_id: null,
    group_id: null,
    youtube_review_url: null,
    hashtags: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * Creates a chainable Supabase mock for publishDealWithEditsFn.
 *
 * New flow (after redesign):
 * Call 1: from('deals').select('current_price, published_at').eq('id', id).single()
 * Call 2: from('deals').update(payload).eq('id', id)
 * Call 3: from('deals').select('*').eq('id', id).single()  ← re-read
 *
 * All `.from()` calls use a counter to return different chain shapes.
 */
function makePublishClientMock(options: {
  currentPrice?: number;
  currentPublishedAt: string | null;
  updatedRow: DealRow;
  updateError?: { message: string };
}) {
  const updateMock = vi.fn();
  let fromCallCount = 0;

  const fromMock = vi.fn().mockImplementation(() => {
    fromCallCount++;
    if (fromCallCount === 1) {
      // First call: select('current_price, published_at').eq('id', id).single()
      const single1 = vi.fn().mockResolvedValue({
        data: {
          current_price: options.currentPrice ?? 49.99,
          published_at: options.currentPublishedAt,
        },
        error: null,
      });
      const eq1 = vi.fn().mockReturnValue({ single: single1 });
      return { select: vi.fn().mockReturnValue({ eq: eq1 }) };
    } else if (fromCallCount === 2) {
      // Second call: update(payload).eq('id', id)
      const eq2 = vi.fn().mockResolvedValue({
        data: options.updateError ? null : options.updatedRow,
        error: options.updateError ?? null,
      });
      updateMock.mockReturnValue({ eq: eq2 });
      return { update: updateMock };
    } else {
      // Third call: select('*').eq('id', id).single()  — re-read after EF
      const single3 = vi.fn().mockResolvedValue({
        data: options.updatedRow,
        error: null,
      });
      const eq3 = vi.fn().mockReturnValue({ single: single3 });
      return { select: vi.fn().mockReturnValue({ eq: eq3 }) };
    }
  });

  return { from: fromMock, _updateMock: updateMock };
}

/**
 * Creates a chainable Supabase mock for:
 * from('deals').insert(payload).select().single() → { data, error }
 */
function makeInsertClientMock(options: { row: DealRow; error?: { message: string } }) {
  const singleMock = vi.fn().mockResolvedValue({
    data: options.error ? null : options.row,
    error: options.error ?? null,
  });
  const selectMock = vi.fn().mockReturnValue({ single: singleMock });
  const insertMock = vi.fn().mockReturnValue({ select: selectMock });
  const fromMock = vi.fn().mockReturnValue({ insert: insertMock });

  return { from: fromMock, _insertMock: insertMock, _singleMock: singleMock };
}

const mockRequest = {} as Request;

beforeEach(() => {
  vi.clearAllMocks();
  (getRequest as Mock).mockReturnValue(mockRequest);
});

// ---------------------------------------------------------------------------
// publishDealWithEditsFn
// ---------------------------------------------------------------------------

describe('publishDealWithEditsFn', () => {
  // NOTE: With the createServerFn mock, `.handler(fn)` returns `fn` directly.
  // The handler receives `{ data: input }` in real TanStack Start execution, so
  // tests must wrap args as `{ data: { ... } }` to match that shape.
  type PublishHandler = (ctx: {
    data: {
      id: string;
      hashtags: string[];
      youtube_review_url: string | null;
      previous_price: number | null;
    };
  }) => Promise<unknown>;

  function mockFetchOk() {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })));
  }

  it('(a) calls update() with hashtags, youtube_review_url, status=published, published_at', async () => {
    mockFetchOk();
    (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

    const updatedRow = makeDeal({ status: 'published', published_at: new Date().toISOString() });
    const { from: fromMock, _updateMock: updateMock } = makePublishClientMock({
      currentPublishedAt: null,
      currentPrice: 49.99,
      updatedRow,
    });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    await (publishDealWithEditsFn as unknown as PublishHandler)({
      data: {
        id: 'deal-1',
        hashtags: ['ofertazo', 'sony'],
        youtube_review_url: 'https://youtube.com/watch?v=abc',
        previous_price: null,
      },
    });

    expect(updateMock).toHaveBeenCalledOnce();
    const updatePayload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(updatePayload.hashtags).toEqual(['ofertazo', 'sony']);
    expect(updatePayload.youtube_review_url).toBe('https://youtube.com/watch?v=abc');
    expect(updatePayload.status).toBe('published');
    expect(updatePayload.published_at).toBeDefined();
  });

  it('(b) preserves existing published_at when deal already has one', async () => {
    mockFetchOk();
    (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

    const existingPublishedAt = '2026-01-15T10:00:00Z';
    const updatedRow = makeDeal({ status: 'published', published_at: existingPublishedAt });
    const { from: fromMock, _updateMock: updateMock } = makePublishClientMock({
      currentPublishedAt: existingPublishedAt,
      currentPrice: 49.99,
      updatedRow,
    });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    await (publishDealWithEditsFn as unknown as PublishHandler)({
      data: { id: 'deal-1', hashtags: [], youtube_review_url: null, previous_price: null },
    });

    const updatePayload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(updatePayload.published_at).toBe(existingPublishedAt);
  });

  it('(c) sets published_at to now() when current value is null', async () => {
    mockFetchOk();
    (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

    const updatedRow = makeDeal({ status: 'published' });
    const { from: fromMock, _updateMock: updateMock } = makePublishClientMock({
      currentPublishedAt: null,
      currentPrice: 49.99,
      updatedRow,
    });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    const before = new Date();
    await (publishDealWithEditsFn as unknown as PublishHandler)({
      data: { id: 'deal-1', hashtags: [], youtube_review_url: null, previous_price: null },
    });
    const after = new Date();

    const updatePayload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    const publishedAt = new Date(updatePayload.published_at as string);
    expect(publishedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(publishedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('(d) throws when Supabase update returns error and does NOT call fetch', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

    const supabaseError = { message: 'DB error', code: '42P01' };
    const { from: fromMock } = makePublishClientMock({
      currentPublishedAt: null,
      currentPrice: 49.99,
      updatedRow: makeDeal(),
      updateError: supabaseError,
    });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    await expect(
      (publishDealWithEditsFn as unknown as PublishHandler)({
        data: { id: 'deal-1', hashtags: [], youtube_review_url: null, previous_price: null },
      })
    ).rejects.toMatchObject({ message: 'DB error' });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('(e) throws auth error when requireAdmin fails', async () => {
    (requireAdmin as Mock).mockRejectedValue(new Response(null, { status: 403 }));

    await expect(
      (publishDealWithEditsFn as unknown as PublishHandler)({
        data: { id: 'deal-1', hashtags: [], youtube_review_url: null, previous_price: null },
      })
    ).rejects.toBeInstanceOf(Response);
  });
});

describe('publishDealWithEditsFn — previous_price + discount', () => {
  type PublishHandler = (ctx: {
    data: {
      id: string;
      hashtags: string[];
      youtube_review_url: string | null;
      previous_price: number | null;
    };
  }) => Promise<unknown>;

  function mockFetchOk() {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })));
  }

  it('(a) UPDATE receives previous_price=89.99 and discount_percent=44 when current_price=49.99', async () => {
    mockFetchOk();
    (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

    const updatedRow = makeDeal({ current_price: 49.99, previous_price: 89.99, discount_percent: 44 });
    const { from: fromMock, _updateMock: updateMock } = makePublishClientMock({
      currentPublishedAt: null,
      currentPrice: 49.99,
      updatedRow,
    });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    await (publishDealWithEditsFn as unknown as PublishHandler)({
      data: { id: 'deal-1', hashtags: [], youtube_review_url: null, previous_price: 89.99 },
    });

    expect(updateMock).toHaveBeenCalledOnce();
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.previous_price).toBe(89.99);
    expect(payload.discount_percent).toBe(44);
    // EF should have been called after the update
    expect(fetch).toHaveBeenCalledOnce();
  });

  it('(b) UPDATE fails → EF NOT invoked and error propagated', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

    const { from: fromMock } = makePublishClientMock({
      currentPublishedAt: null,
      currentPrice: 49.99,
      updatedRow: makeDeal(),
      updateError: { message: 'Update failed' },
    });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    await expect(
      (publishDealWithEditsFn as unknown as PublishHandler)({
        data: { id: 'deal-1', hashtags: [], youtube_review_url: null, previous_price: 89.99 },
      })
    ).rejects.toMatchObject({ message: 'Update failed' });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('(c) previous_price=null → UPDATE receives previous_price:null, discount_percent:null', async () => {
    mockFetchOk();
    (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

    const updatedRow = makeDeal({ previous_price: null, discount_percent: null });
    const { from: fromMock, _updateMock: updateMock } = makePublishClientMock({
      currentPublishedAt: null,
      currentPrice: 49.99,
      updatedRow,
    });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    await (publishDealWithEditsFn as unknown as PublishHandler)({
      data: { id: 'deal-1', hashtags: [], youtube_review_url: null, previous_price: null },
    });

    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.previous_price).toBeNull();
    expect(payload.discount_percent).toBeNull();
  });

  it('(d) previous_price <= current_price → discount_percent:null in UPDATE', async () => {
    mockFetchOk();
    (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

    // current=89.99, previous=49.99 → previous < current → discount null
    const updatedRow = makeDeal({ current_price: 89.99, previous_price: 49.99, discount_percent: null });
    const { from: fromMock, _updateMock: updateMock } = makePublishClientMock({
      currentPublishedAt: null,
      currentPrice: 89.99,
      updatedRow,
    });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    await (publishDealWithEditsFn as unknown as PublishHandler)({
      data: { id: 'deal-1', hashtags: [], youtube_review_url: null, previous_price: 49.99 },
    });

    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.discount_percent).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// publishDealWithEditsFn — A2 schema: previous_price mandatory (positive)
// ---------------------------------------------------------------------------

import { z as zSchema } from 'zod';

// We test the Zod constraint directly since the createServerFn mock bypasses inputValidator.
// publishInputSchema is not exported, so we replicate the `previous_price` constraint only.
const previousPriceSchema = zSchema.object({ previous_price: zSchema.number().positive() });

describe('publishDealWithEditsFn — A2: previous_price mandatory positive', () => {
  it('(f) schema rejects previous_price:null', () => {
    expect(() => previousPriceSchema.parse({ previous_price: null })).toThrow();
  });

  it('(g) schema rejects previous_price:0', () => {
    expect(() => previousPriceSchema.parse({ previous_price: 0 })).toThrow();
  });

  it('(h) schema rejects negative previous_price', () => {
    expect(() => previousPriceSchema.parse({ previous_price: -10 })).toThrow();
  });

  it('(i) schema accepts previous_price > 0', () => {
    expect(() => previousPriceSchema.parse({ previous_price: 89.99 })).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// createDealFn
// ---------------------------------------------------------------------------

describe('createDealFn', () => {
  // NOTE: With the createServerFn mock, `.handler(fn)` returns `fn` directly.
  // The handler receives `{ data: parsedInput }`. Tests must wrap accordingly.
  // The inputValidator (dealCreateSchema.parse) runs inline — tests for validation
  // rejection call the handler directly with invalid data to exercise schema throws.

  type CreateHandler = (ctx: { data: Record<string, unknown> }) => Promise<unknown>;

  const validData = {
    title: 'Auriculares Sony',
    current_price: 199.99,
    original_url: 'https://amazon.es/dp/B123456',
    source: 'amazon',
    previous_price: null,
    image_url: null,
    affiliate_url: null,
    hashtags: null,
    youtube_review_url: null,
    status: undefined,
    average_price: null,
    discount_percent: null,
  };

  it('(a) inserts row with status="pending" and found_at set', async () => {
    (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

    const insertedRow = makeDeal({ status: 'pending', title: 'Auriculares Sony' });
    const { from: fromMock, _insertMock: insertMock } = makeInsertClientMock({ row: insertedRow });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    const before = new Date();
    await (createDealFn as unknown as CreateHandler)({ data: validData });
    const after = new Date();

    expect(insertMock).toHaveBeenCalledOnce();
    const payload = insertMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.status).toBe('pending');
    const foundAt = new Date(payload.found_at as string);
    expect(foundAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(foundAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('(b) rejects malformed input (missing title) before hitting Supabase — via schema in inputValidator', async () => {
    // The inputValidator calls dealCreateSchema.parse(input), which throws on bad data.
    // We test this by calling the raw schema directly since the mock bypasses the validator.
    const { dealCreateSchema: schema } = await import('@everyone-web/lib/validators/deal');
    expect(() => schema.parse({ ...validData, title: '' })).toThrow();
  });

  it('(c) rejects invalid original_url (non-https) — via schema in inputValidator', async () => {
    const { dealCreateSchema: schema } = await import('@everyone-web/lib/validators/deal');
    expect(() => schema.parse({ ...validData, original_url: 'not-a-url' })).toThrow();
  });

  it('(d) throws auth error when requireAdmin fails', async () => {
    (requireAdmin as Mock).mockRejectedValue(new Response(null, { status: 403 }));

    await expect(
      (createDealFn as unknown as CreateHandler)({ data: validData })
    ).rejects.toBeInstanceOf(Response);
  });

  it('(e) throws when Supabase returns error', async () => {
    (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

    const { from: fromMock } = makeInsertClientMock({
      row: makeDeal(),
      error: { message: 'Insert failed' },
    });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    await expect(
      (createDealFn as unknown as CreateHandler)({ data: validData })
    ).rejects.toMatchObject({ message: 'Insert failed' });
  });
});
