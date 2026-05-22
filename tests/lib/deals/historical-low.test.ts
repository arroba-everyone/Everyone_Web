import { describe, it, expect } from 'vitest';
import { isHistoricalLow } from '@everyone-web/lib/deals/historical-low';
import type { DealRow } from '@everyone-web/types/supabase';

function makeDeal(overrides: Partial<DealRow> = {}): DealRow {
  return {
    id: 'deal-1',
    title: 'Test Deal',
    current_price: 100,
    previous_price: 150,
    average_price: 120,
    discount_percent: 33,
    image_url: null,
    original_url: 'https://example.com',
    affiliate_url: null,
    source: 'amazon',
    status: 'published',
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

describe('isHistoricalLow', () => {
  it('(a) returns false when both average_price and previous_price are null', () => {
    const deal = makeDeal({ average_price: null, previous_price: null });
    expect(isHistoricalLow(deal)).toBe(false);
  });

  it('(b) returns false when average_price is null (even if previous_price is set)', () => {
    const deal = makeDeal({ average_price: null, previous_price: 150, current_price: 100 });
    expect(isHistoricalLow(deal)).toBe(false);
  });

  it('(c) returns false when previous_price is null (even if average_price is set)', () => {
    const deal = makeDeal({ previous_price: null, average_price: 120, current_price: 100 });
    expect(isHistoricalLow(deal)).toBe(false);
  });

  it('(d) returns true when current <= average AND current < previous', () => {
    // current=90, average=120, previous=150 → 90 <= 120 ✓ and 90 < 150 ✓
    const deal = makeDeal({ current_price: 90, average_price: 120, previous_price: 150 });
    expect(isHistoricalLow(deal)).toBe(true);
  });

  it('(e) returns false when current > average', () => {
    // current=130, average=120, previous=150 → 130 > 120 ✗
    const deal = makeDeal({ current_price: 130, average_price: 120, previous_price: 150 });
    expect(isHistoricalLow(deal)).toBe(false);
  });

  it('(f) returns false when current == average AND current == previous (no actual historical low)', () => {
    // current=120, average=120, previous=120 → current < previous is false
    const deal = makeDeal({ current_price: 120, average_price: 120, previous_price: 120 });
    expect(isHistoricalLow(deal)).toBe(false);
  });

  it('returns true when current == average (equal to average) but strictly below previous', () => {
    // current=120, average=120, previous=150 → 120 <= 120 ✓ and 120 < 150 ✓
    const deal = makeDeal({ current_price: 120, average_price: 120, previous_price: 150 });
    expect(isHistoricalLow(deal)).toBe(true);
  });
});
