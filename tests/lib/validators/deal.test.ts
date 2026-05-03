// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';

describe('deal validators', () => {
  let dealEditSchema: import('zod').ZodObject<Record<string, import('zod').ZodTypeAny>>;

  beforeEach(async () => {
    const mod = await import('@everyone-web/lib/validators/deal');
    dealEditSchema = mod.dealEditSchema as typeof dealEditSchema;
  });

  it('rejects current_price when negative', () => {
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: -1,
        original_url: 'https://example.com',
        source: 'manual',
      })
    ).toThrow();
  });

  it('rejects current_price of zero', () => {
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: 0,
        original_url: 'https://example.com',
        source: 'manual',
      })
    ).toThrow();
  });

  it('accepts a valid deal with all required fields', () => {
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: 9.99,
        original_url: 'https://example.com',
        source: 'manual',
      })
    ).not.toThrow();
  });

  it('accepts all optional fields as undefined', () => {
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: 19.99,
        original_url: 'https://example.com',
        source: 'manual',
        // All optional fields omitted
      })
    ).not.toThrow();
  });

  it('accepts valid status values', () => {
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: 9.99,
        original_url: 'https://example.com',
        source: 'manual',
        status: 'published',
      })
    ).not.toThrow();
  });

  it('rejects invalid status value', () => {
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: 9.99,
        original_url: 'https://example.com',
        source: 'manual',
        status: 'invalid-status',
      })
    ).toThrow();
  });
});
