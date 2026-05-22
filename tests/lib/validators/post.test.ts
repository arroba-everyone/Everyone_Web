// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';

describe('post validators', () => {
  let postCreateSchema: import('zod').ZodObject<Record<string, import('zod').ZodTypeAny>>;

  beforeEach(async () => {
    const mod = await import('@everyone-web/lib/validators/post');
    postCreateSchema = mod.postCreateSchema as typeof postCreateSchema;
  });

  it('rejects empty title', () => {
    expect(() =>
      postCreateSchema.parse({
        title: '',
        slug: 'valid-slug',
        author: 'Author',
        thumbnail_url: 'https://example.com/img.jpg',
        markdown: '# Hello',
      })
    ).toThrow();
  });

  it('rejects a slug that contains uppercase letters', () => {
    expect(() =>
      postCreateSchema.parse({
        title: 'My Post',
        slug: 'Invalid-Slug',
        author: 'Author',
        thumbnail_url: 'https://example.com/img.jpg',
        markdown: '# Hello',
      })
    ).toThrow();
  });

  it('rejects a slug with spaces', () => {
    expect(() =>
      postCreateSchema.parse({
        title: 'My Post',
        slug: 'has spaces',
        author: 'Author',
        thumbnail_url: 'https://example.com/img.jpg',
        markdown: '# Hello',
      })
    ).toThrow();
  });

  it('rejects a slug starting with a hyphen', () => {
    expect(() =>
      postCreateSchema.parse({
        title: 'My Post',
        slug: '-invalid',
        author: 'Author',
        thumbnail_url: 'https://example.com/img.jpg',
        markdown: '# Hello',
      })
    ).toThrow();
  });

  it('accepts a valid slug with lowercase letters, numbers, and hyphens', () => {
    expect(() =>
      postCreateSchema.parse({
        title: 'My Post',
        slug: 'my-post-123',
        author: 'Author',
        thumbnail_url: 'https://example.com/img.jpg',
        markdown: '# Hello',
      })
    ).not.toThrow();
  });

  it('rejects empty markdown content', () => {
    expect(() =>
      postCreateSchema.parse({
        title: 'My Post',
        slug: 'my-post',
        author: 'Author',
        thumbnail_url: 'https://example.com/img.jpg',
        markdown: '',
      })
    ).toThrow();
  });
});
