import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock TanStack Router redirect
vi.mock('@tanstack/react-router', () => ({
  redirect: vi.fn((opts: unknown) => {
    const error = new Error('REDIRECT');
    (error as unknown as Record<string, unknown>)['isRedirect'] = true;
    (error as unknown as Record<string, unknown>)['redirectOpts'] = opts;
    return error;
  }),
  createFileRoute: vi.fn(() => () => ({
    component: vi.fn(),
  })),
  Outlet: () => null,
}));

vi.mock('@everyone-web/libs/supabase.server', () => ({
  getServerClient: vi.fn(),
  getServiceClient: vi.fn(),
}));

vi.mock('@tanstack/react-start', () => ({
  createServerFn: vi.fn(() => ({
    inputValidator: vi.fn().mockReturnThis(),
    handler: vi.fn((fn: unknown) => fn),
  })),
}));

vi.mock('@tanstack/react-start/server', () => ({
  getRequest: vi.fn(),
}));

/**
 * Build a Supabase client mock that supports auth.getUser + from('users')...
 * The role now comes from public.users.role.
 */
function makeClientMock(opts: {
  user: Record<string, unknown> | null;
  profileRole?: 'user' | 'admin' | null;
}) {
  const { user, profileRole = 'user' } = opts;
  const single = vi.fn().mockResolvedValue({
    data: profileRole === null ? null : { role: profileRole },
    error: null,
  });
  const eq = vi.fn(() => ({ single }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
    },
    from,
  };
}

describe('_admin route guard (requireAdmin)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('throws redirect to /login when session is null (anon)', async () => {
    const { getServerClient } = await import('@everyone-web/libs/supabase.server');
    vi.mocked(getServerClient).mockReturnValue(
      makeClientMock({ user: null }) as unknown as ReturnType<typeof getServerClient>
    );

    const { getRequest } = await import('@tanstack/react-start/server');
    vi.mocked(getRequest).mockReturnValue(
      new Request('https://example.com/deals/manage') as Request
    );

    const { requireAdmin } = await import('@everyone-web/server/auth.server');

    await expect(
      requireAdmin(new Request('https://example.com/deals/manage'))
    ).rejects.toMatchObject({
      isRedirect: true,
      redirectOpts: expect.objectContaining({ to: '/login' }),
    });
  });

  it('throws redirect to / with error=forbidden for non-admin user', async () => {
    const { getServerClient } = await import('@everyone-web/libs/supabase.server');
    vi.mocked(getServerClient).mockReturnValue(
      makeClientMock({
        user: { id: 'user-1', email: 'user@test.com' },
        profileRole: 'user',
      }) as unknown as ReturnType<typeof getServerClient>
    );

    const { requireAdmin } = await import('@everyone-web/server/auth.server');

    await expect(
      requireAdmin(new Request('https://example.com/deals/manage'))
    ).rejects.toMatchObject({
      isRedirect: true,
      redirectOpts: expect.objectContaining({ to: '/' }),
    });
  });

  it('returns the session for an admin user', async () => {
    const { getServerClient } = await import('@everyone-web/libs/supabase.server');
    vi.mocked(getServerClient).mockReturnValue(
      makeClientMock({
        user: { id: 'admin-1', email: 'admin@test.com' },
        profileRole: 'admin',
      }) as unknown as ReturnType<typeof getServerClient>
    );

    const { requireAdmin } = await import('@everyone-web/server/auth.server');
    const session = await requireAdmin(new Request('https://example.com/deals/manage'));

    expect(session.role).toBe('admin');
    expect(session.userId).toBe('admin-1');
  });
});
