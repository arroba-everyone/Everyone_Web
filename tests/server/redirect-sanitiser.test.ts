// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';

// Tests for sanitiseRedirect — pure function, no async.

describe('sanitiseRedirect()', () => {
  // We use a dynamic import so the module can be loaded after this describe
  // block is registered without issues.
  let sanitiseRedirect: (url: string | undefined, origin: string) => string | null;

  beforeEach(async () => {
    const mod = await import('@everyone-web/server/redirect-sanitiser');
    sanitiseRedirect = mod.sanitiseRedirect;
  });

  it('returns the path for a same-origin path-only URL', () => {
    expect(sanitiseRedirect('/admin/deals', 'https://example.com')).toBe('/admin/deals');
  });

  it('returns the path including query string for same-origin path+search', () => {
    expect(sanitiseRedirect('/deals?foo=bar', 'https://example.com')).toBe('/deals?foo=bar');
  });

  it('returns null for an off-origin full URL', () => {
    expect(sanitiseRedirect('https://evil.com/phish', 'https://example.com')).toBeNull();
  });

  it('returns null for a protocol-relative URL (//evil.com)', () => {
    expect(sanitiseRedirect('//evil.com', 'https://example.com')).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(sanitiseRedirect(undefined, 'https://example.com')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(sanitiseRedirect('', 'https://example.com')).toBeNull();
  });

  it('returns "/" for a bare slash', () => {
    expect(sanitiseRedirect('/', 'https://example.com')).toBe('/');
  });
});
