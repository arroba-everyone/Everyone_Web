// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock TanStack Router redirect — turn into a throwable marker so we can
// assert which target the loader chose without running the real router.
vi.mock('@tanstack/react-router', () => ({
  redirect: vi.fn((opts: unknown) => {
    const error = new Error('REDIRECT');
    (error as unknown as Record<string, unknown>)['isRedirect'] = true;
    (error as unknown as Record<string, unknown>)['redirectOpts'] = opts;
    return error;
  }),
  createFileRoute: vi.fn(() => (config: unknown) => config),
}));

// Mock the server fn (we don't actually exchange anything in tests).
vi.mock('@everyone-web/server/auth.server', () => ({
  exchangeCodeFn: vi.fn(),
}));

// Mock @tanstack/react-start (used transitively by auth.server) so the route
// file can be imported in jsdom without resolving the start-server-core chain.
vi.mock('@tanstack/react-start', () => ({
  createServerFn: vi.fn(() => ({ handler: vi.fn((fn: unknown) => fn) })),
}));

vi.mock('@tanstack/react-start/server', () => ({
  getRequest: vi.fn(),
  setCookie: vi.fn(),
}));

vi.mock('@everyone-web/libs/supabase.server', () => ({
  getServerClient: vi.fn(),
  getServiceClient: vi.fn(),
}));

interface LoaderFn {
  (args: { location: { search: Record<string, unknown> } }): Promise<unknown>;
}

interface RouteConfig {
  loader: LoaderFn;
}

async function importLoader(): Promise<LoaderFn> {
  const mod = await import('@everyone-web/routes/auth/callback');
  // Route is the result of createFileRoute(...)(config) — our mock just
  // returns the config, so Route is the config object with `.loader`.
  return (mod.Route as unknown as RouteConfig).loader;
}

describe('/auth/callback loader', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('redirects to /login?error=oauth when the provider sent an error', async () => {
    const loader = await importLoader();
    await expect(
      loader({ location: { search: { error: 'access_denied' } } })
    ).rejects.toMatchObject({
      isRedirect: true,
      redirectOpts: { to: '/login', search: { error: 'oauth' } },
    });
  });

  it('redirects to /login?error=oauth when no code is present', async () => {
    const loader = await importLoader();
    await expect(loader({ location: { search: {} } })).rejects.toMatchObject({
      isRedirect: true,
      redirectOpts: { to: '/login', search: { error: 'oauth' } },
    });
  });

  it('redirects to /login?error=oauth when exchangeCodeFn returns ok:false', async () => {
    const { exchangeCodeFn } = await import('@everyone-web/server/auth.server');
    vi.mocked(exchangeCodeFn).mockResolvedValue({ ok: false, error: 'bad code' });

    const loader = await importLoader();
    await expect(
      loader({ location: { search: { code: 'abc' } } })
    ).rejects.toMatchObject({
      isRedirect: true,
      redirectOpts: { to: '/login', search: { error: 'oauth' } },
    });
  });

  it('redirects to /auth/reset when type=recovery and exchange succeeds', async () => {
    const { exchangeCodeFn } = await import('@everyone-web/server/auth.server');
    vi.mocked(exchangeCodeFn).mockResolvedValue({ ok: true });

    const loader = await importLoader();
    await expect(
      loader({ location: { search: { code: 'abc', type: 'recovery' } } })
    ).rejects.toMatchObject({
      isRedirect: true,
      redirectOpts: { to: '/auth/reset' },
    });
  });

  it('redirects to "/" on a successful exchange with no redirect target', async () => {
    const { exchangeCodeFn } = await import('@everyone-web/server/auth.server');
    vi.mocked(exchangeCodeFn).mockResolvedValue({ ok: true });

    const loader = await importLoader();
    await expect(
      loader({ location: { search: { code: 'abc' } } })
    ).rejects.toMatchObject({
      isRedirect: true,
      redirectOpts: { to: '/' },
    });
  });
});
