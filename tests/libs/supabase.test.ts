// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

// We mock @supabase/ssr so we can verify singleton behaviour without
// making real network calls.
vi.mock('@supabase/ssr', () => {
  const mockInstance = { isMockClient: true };
  return {
    createBrowserClient: vi.fn(() => mockInstance),
  };
});

describe('supabase.ts — browser client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('import.meta', {
      env: {
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-anon-key',
      },
    });
  });

  it('getBrowserClient() returns a singleton — createBrowserClient called once across multiple calls', async () => {
    const { createBrowserClient } = await import('@supabase/ssr');
    const mod = await import('@everyone-web/libs/supabase');

    // Call the export multiple times
    const a = mod.getBrowserClient();
    const b = mod.getBrowserClient();
    const c = mod.getBrowserClient();

    // All calls must return the same object reference
    expect(a).toBe(b);
    expect(b).toBe(c);

    // createBrowserClient was called at most once (lazy init or module-level init)
    expect(createBrowserClient).toHaveBeenCalledTimes(1);
  });
});
