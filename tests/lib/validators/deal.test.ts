// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import type { ZodIssue } from 'zod';

describe('HASHTAG_REGEX', () => {
  let HASHTAG_REGEX: RegExp;
  let MAX_HASHTAGS: number;

  beforeEach(async () => {
    const mod = await import('@everyone-web/lib/validators/deal');
    HASHTAG_REGEX = mod.HASHTAG_REGEX;
    MAX_HASHTAGS = mod.MAX_HASHTAGS;
  });

  it('(a) valid alphanumeric + underscore passes', () => {
    expect(HASHTAG_REGEX.test('ofertazo')).toBe(true);
    expect(HASHTAG_REGEX.test('Sony_WH1000XM5')).toBe(true);
    expect(HASHTAG_REGEX.test('a1_B2')).toBe(true);
  });

  it('(a) valid with Spanish accents passes', () => {
    expect(HASHTAG_REGEX.test('ofertón')).toBe(true);
    expect(HASHTAG_REGEX.test('tecnología')).toBe(true);
    expect(HASHTAG_REGEX.test('Ñoño')).toBe(true);
    expect(HASHTAG_REGEX.test('güeña')).toBe(true);
  });

  it('(b) spaces fail', () => {
    expect(HASHTAG_REGEX.test('oferta mala')).toBe(false);
    expect(HASHTAG_REGEX.test(' oferta')).toBe(false);
  });

  it('(c) hyphens fail', () => {
    expect(HASHTAG_REGEX.test('oferta-mala')).toBe(false);
  });

  it('(d) emojis fail', () => {
    expect(HASHTAG_REGEX.test('oferta🔥')).toBe(false);
  });

  it('(e) length 1 passes', () => {
    expect(HASHTAG_REGEX.test('a')).toBe(true);
  });

  it('(f) length 30 passes', () => {
    const tag = 'a'.repeat(30);
    expect(HASHTAG_REGEX.test(tag)).toBe(true);
  });

  it('(g) length 31 fails', () => {
    const tag = 'a'.repeat(31);
    expect(HASHTAG_REGEX.test(tag)).toBe(false);
  });

  it('(h) empty string fails', () => {
    expect(HASHTAG_REGEX.test('')).toBe(false);
  });

  it('MAX_HASHTAGS is 15', () => {
    expect(MAX_HASHTAGS).toBe(15);
  });
});

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
        original_url: 'https://amazon.es/dp/B0X',
        source: 'manual',
      })
    ).not.toThrow();
  });

  it('accepts all optional fields as undefined', () => {
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: 19.99,
        original_url: 'https://amazon.es/dp/B0X',
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
        original_url: 'https://amazon.es/dp/B0X',
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
        original_url: 'https://amazon.es/dp/B0X',
        source: 'manual',
        status: 'invalid-status',
      })
    ).toThrow();
  });

  it('accepts valid hashtags array matching HASHTAG_REGEX', () => {
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: 9.99,
        original_url: 'https://amazon.es/dp/B0X',
        source: 'manual',
        hashtags: ['ofertazo', 'sony', 'auriculares'],
      })
    ).not.toThrow();
  });

  it('rejects hashtags with invalid characters (hyphen)', () => {
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: 9.99,
        original_url: 'https://amazon.es/dp/B0X',
        source: 'manual',
        hashtags: ['oferta-mala'],
      })
    ).toThrow();
  });

  it('rejects more than 15 hashtags', () => {
    const tags = Array.from({ length: 16 }, (_, i) => `tag${i}`);
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: 9.99,
        original_url: 'https://amazon.es/dp/B0X',
        source: 'manual',
        hashtags: tags,
      })
    ).toThrow();
  });

  it('accepts null hashtags', () => {
    expect(() =>
      dealEditSchema.parse({
        title: 'Test Deal',
        current_price: 9.99,
        original_url: 'https://amazon.es/dp/B0X',
        source: 'manual',
        hashtags: null,
      })
    ).not.toThrow();
  });
});

describe('original_url Amazon-only', () => {
  let dealEditSchema: import('zod').ZodObject<Record<string, import('zod').ZodTypeAny>>;
  let dealCreateSchema: import('zod').ZodObject<Record<string, import('zod').ZodTypeAny>>;

  const base = {
    title: 'Test Deal',
    current_price: 9.99,
    source: 'manual',
  };

  beforeEach(async () => {
    const mod = await import('@everyone-web/lib/validators/deal');
    dealEditSchema = mod.dealEditSchema as typeof dealEditSchema;
    dealCreateSchema = mod.dealCreateSchema as typeof dealCreateSchema;
  });

  // Accepted URLs
  it('accepts amazon.es', () => {
    expect(() =>
      dealEditSchema.parse({ ...base, original_url: 'https://www.amazon.es/dp/B0X' })
    ).not.toThrow();
  });

  it('accepts amzn.to shortener', () => {
    expect(() =>
      dealEditSchema.parse({ ...base, original_url: 'https://amzn.to/3XXXXXXX' })
    ).not.toThrow();
  });

  it('accepts a.co shortener', () => {
    expect(() =>
      dealEditSchema.parse({ ...base, original_url: 'https://a.co/d/XXXXXXX' })
    ).not.toThrow();
  });

  // Rejected URLs
  it('rejects chollometro.com with error on original_url field', () => {
    const result = dealEditSchema.safeParse({
      ...base,
      original_url: 'https://www.chollometro.com/ofertas/product/123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const field = (result.error.issues as ZodIssue[]).find(i => i.path[0] === 'original_url');
      expect(field).toBeDefined();
    }
  });

  it('rejects mediamarkt.es with error on original_url field', () => {
    const result = dealEditSchema.safeParse({
      ...base,
      original_url: 'https://www.mediamarkt.es/es/product/XXXX.html',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const field = (result.error.issues as ZodIssue[]).find(i => i.path[0] === 'original_url');
      expect(field).toBeDefined();
    }
  });

  it('rejects example.com with error on original_url field', () => {
    const result = dealEditSchema.safeParse({
      ...base,
      original_url: 'https://example.com/product',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const field = (result.error.issues as ZodIssue[]).find(i => i.path[0] === 'original_url');
      expect(field).toBeDefined();
    }
  });

  it('rejects empty string', () => {
    const result = dealEditSchema.safeParse({
      ...base,
      original_url: '',
    });
    expect(result.success).toBe(false);
  });

  it('applies refine in dealCreateSchema too', () => {
    const result = dealCreateSchema.safeParse({
      ...base,
      original_url: 'https://example.com/product',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const field = (result.error.issues as ZodIssue[]).find(i => i.path[0] === 'original_url');
      expect(field).toBeDefined();
    }
  });
});
