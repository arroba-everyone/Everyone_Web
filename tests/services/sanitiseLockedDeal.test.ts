import { describe, it, expect, vi } from 'vitest';

// Mock server-only modules before importing deals.ts
vi.mock('@everyone-web/libs/supabase-server', () => ({
  getServerClient: vi.fn(),
  getServiceClient: vi.fn(),
}));
vi.mock('@everyone-web/server/auth', () => ({
  getSession: vi.fn(),
  requireAdmin: vi.fn(),
}));

import { sanitiseLockedDeal } from '@everyone-web/services/deals';
import type { DealRow } from '@everyone-web/types/supabase';

const fullDeal: DealRow = {
  id: 'deal-1',
  title: 'Auriculares Sony WH-1000XM5',
  current_price: 250.0,
  previous_price: 380.0,
  average_price: 300.0,
  discount_percent: 34.0,
  image_url: 'https://example.com/image.jpg',
  original_url: 'https://amazon.es/dp/B123456',
  affiliate_url: 'https://affiliate.example.com/ref=123',
  source: 'amazon',
  status: 'published',
  found_at: '2026-01-01T00:00:00Z',
  published_at: '2026-01-02T00:00:00Z',
  telegram_message_id: 42,
  chollometro_id: 'choll-123',
  group_id: 'g1',
  youtube_review_url: 'https://youtube.com/watch?v=abc',
  hashtags: ['#sony', '#auriculares'],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('sanitiseLockedDeal', () => {
  it('retains only id, title, image_url and sets is_locked: true', () => {
    const result = sanitiseLockedDeal(fullDeal);

    expect(result.id).toBe('deal-1');
    expect(result.title).toBe('Auriculares Sony WH-1000XM5');
    expect(result.image_url).toBe('https://example.com/image.jpg');
    expect(result.is_locked).toBe(true);
  });

  it('strips current_price', () => {
    const result = sanitiseLockedDeal(fullDeal);
    expect((result as Record<string, unknown>)['current_price']).toBeUndefined();
  });

  it('strips previous_price', () => {
    const result = sanitiseLockedDeal(fullDeal);
    expect((result as Record<string, unknown>)['previous_price']).toBeUndefined();
  });

  it('strips average_price', () => {
    const result = sanitiseLockedDeal(fullDeal);
    expect((result as Record<string, unknown>)['average_price']).toBeUndefined();
  });

  it('strips discount_percent', () => {
    const result = sanitiseLockedDeal(fullDeal);
    expect((result as Record<string, unknown>)['discount_percent']).toBeUndefined();
  });

  it('strips original_url', () => {
    const result = sanitiseLockedDeal(fullDeal);
    expect((result as Record<string, unknown>)['original_url']).toBeUndefined();
  });

  it('strips affiliate_url', () => {
    const result = sanitiseLockedDeal(fullDeal);
    expect((result as Record<string, unknown>)['affiliate_url']).toBeUndefined();
  });

  it('contains exactly the allowed keys', () => {
    const result = sanitiseLockedDeal(fullDeal);
    const keys = Object.keys(result).sort();
    expect(keys).toEqual(['id', 'image_url', 'is_locked', 'title'].sort());
  });
});
