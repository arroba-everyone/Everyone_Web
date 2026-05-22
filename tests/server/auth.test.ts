// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Session } from '@everyone-web/types/session';

// Mock supabase-server so the browser guard doesn't fire in jsdom
vi.mock('@everyone-web/libs/supabase-server', () => ({
  getServerClient: vi.fn(),
  getServiceClient: vi.fn(),
}));

// Mock @tanstack/react-start. createServerFn returns a chainable builder
// supporting both `.handler(fn)` and `.inputValidator(v).handler(fn)`.
vi.mock('@tanstack/react-start', () => ({
  createServerFn: vi.fn(() => ({
    inputValidator: vi.fn().mockReturnThis(),
    handler: vi.fn((fn: unknown) => fn),
  })),
}));

// Mock TanStack Router redirect
vi.mock('@tanstack/react-router', () => ({
  redirect: vi.fn((opts: unknown) => {
    const error = new Error('REDIRECT');
    (error as unknown as Record<string, unknown>)['isRedirect'] = true;
    (error as unknown as Record<string, unknown>)['redirectOpts'] = opts;
    return error;
  }),
}));

function makeRequest(cookie = ''): Request {
  return new Request('https://example.com/some/path', {
    headers: cookie ? { cookie } : {},
  });
}

/**
 * Build a minimal Supabase client mock that supports:
 *   - client.auth.getUser()
 *   - client.from('users').select('role').eq('id', ...).single()
 */
function makeSupabaseClientMock(opts: {
  user: Record<string, unknown> | null;
  profileRole?: 'user' | 'admin' | null; // null → row doesn't exist
  authError?: unknown;
}) {
  const { user, profileRole = 'user', authError = null } = opts;

  const single = vi.fn().mockResolvedValue({
    data: profileRole === null ? null : { role: profileRole },
    error: null,
  });
  const eq = vi.fn(() => ({ single }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: authError }),
    },
    from,
  };
}

describe('getSession()', () => {
  let getServerClientMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('@everyone-web/libs/supabase-server');
    getServerClientMock = vi.mocked(mod.getServerClient);
  });

  it('returns null when there is no authenticated user (no cookie)', async () => {
    getServerClientMock.mockReturnValue(makeSupabaseClientMock({ user: null }));

    const { getSession } = await import('@everyone-web/server/auth');
    const result = await getSession(makeRequest());
    expect(result).toBeNull();
  });

  it('returns Session with role: "admin" when public.users.role === "admin"', async () => {
    getServerClientMock.mockReturnValue(
      makeSupabaseClientMock({
        user: { id: 'user-1', email: 'admin@example.com' },
        profileRole: 'admin',
      })
    );

    const { getSession } = await import('@everyone-web/server/auth');
    const result: Session | null = await getSession(makeRequest('sb-token=abc'));
    expect(result).not.toBeNull();
    expect(result?.role).toBe('admin');
    expect(result?.userId).toBe('user-1');
    expect(result?.email).toBe('admin@example.com');
  });

  it('returns Session with role: "user" when public.users row has role="user"', async () => {
    getServerClientMock.mockReturnValue(
      makeSupabaseClientMock({
        user: { id: 'user-2', email: 'user@example.com' },
        profileRole: 'user',
      })
    );

    const { getSession } = await import('@everyone-web/server/auth');
    const result: Session | null = await getSession(makeRequest('sb-token=xyz'));
    expect(result).not.toBeNull();
    expect(result?.role).toBe('user');
  });

  it('returns Session with role: "user" when public.users row does not exist (race / fallback)', async () => {
    getServerClientMock.mockReturnValue(
      makeSupabaseClientMock({
        user: { id: 'user-3', email: 'newbie@example.com' },
        profileRole: null,
      })
    );

    const { getSession } = await import('@everyone-web/server/auth');
    const result: Session | null = await getSession(makeRequest('sb-token=xyz'));
    expect(result).not.toBeNull();
    expect(result?.role).toBe('user');
  });
});

describe('requireAdmin()', () => {
  let getServerClientMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('@everyone-web/libs/supabase-server');
    getServerClientMock = vi.mocked(mod.getServerClient);
  });

  it('throws a redirect to /login?redirect=... when session is null (anon)', async () => {
    getServerClientMock.mockReturnValue(makeSupabaseClientMock({ user: null }));

    const { requireAdmin } = await import('@everyone-web/server/auth');
    const request = makeRequest();

    await expect(requireAdmin(request)).rejects.toMatchObject({
      isRedirect: true,
      redirectOpts: expect.objectContaining({ to: '/login' }),
    });
  });

  it('throws a redirect to / with error=forbidden for non-admin authenticated user', async () => {
    getServerClientMock.mockReturnValue(
      makeSupabaseClientMock({
        user: { id: 'user-3', email: 'regular@example.com' },
        profileRole: 'user',
      })
    );

    const { requireAdmin } = await import('@everyone-web/server/auth');

    await expect(requireAdmin(makeRequest('sb=tok'))).rejects.toMatchObject({
      isRedirect: true,
      redirectOpts: expect.objectContaining({ to: '/' }),
    });
  });

  it('returns the session for an admin user', async () => {
    getServerClientMock.mockReturnValue(
      makeSupabaseClientMock({
        user: { id: 'admin-1', email: 'admin@example.com' },
        profileRole: 'admin',
      })
    );

    const { requireAdmin } = await import('@everyone-web/server/auth');
    const session = await requireAdmin(makeRequest('sb=admintok'));
    expect(session.role).toBe('admin');
    expect(session.userId).toBe('admin-1');
  });
});
