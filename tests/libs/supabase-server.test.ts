// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

// These tests verify the server-only guard on supabase-server.ts.
//
// The guard is LAZY (per-call), not load-time, because TanStack Start does
// not reliably tree-shake top-level imports of server-only modules from
// client bundles (see design §ADR-4). The contract:
//   - Importing the module is harmless in any environment.
//   - Calling getServerClient() / getServiceClient() in a browser context
//     throws.
//   - Calling them server-side (window undefined) does not throw on the
//     guard (other errors may surface from missing env vars, etc.).

describe('supabase-server.ts — lazy browser guard', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('module import does NOT throw in a browser context', async () => {
    vi.stubGlobal('window', { location: {} });
    // No throw at import time — the guard is per-call.
    await expect(import('@everyone-web/libs/supabase-server')).resolves.toBeDefined();
  });

  it('getServerClient throws when invoked with window defined', async () => {
    vi.stubGlobal('window', { location: {} });
    const mod = await import('@everyone-web/libs/supabase-server');
    expect(() => mod.getServerClient(new Request('https://example.com'))).toThrow(/server/i);
  });

  it('getServiceClient throws when invoked with window defined', async () => {
    vi.stubGlobal('window', { location: {} });
    const mod = await import('@everyone-web/libs/supabase-server');
    expect(() => mod.getServiceClient()).toThrow(/server/i);
  });

  it('exports are defined and callable in a server context (window undefined)', async () => {
    vi.stubGlobal('window', undefined);
    const mod = await import('@everyone-web/libs/supabase-server');
    expect(typeof mod.getServerClient).toBe('function');
    expect(typeof mod.getServiceClient).toBe('function');
  });
});
