// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Session } from '@everyone-web/types/session';

// The beforeLoad function in __root.tsx calls getSessionFn. We test the
// extracted beforeLoad helper directly by mocking getSessionFn.

// Mock getSessionFn — this is what beforeLoad calls
vi.mock('@everyone-web/server/auth', () => ({
  getSessionFn: vi.fn(),
  getSession: vi.fn(),
  requireAdmin: vi.fn(),
}));

// Mock supabase-server to prevent browser guard from firing
vi.mock('@everyone-web/libs/supabase-server', () => ({
  getServerClient: vi.fn(),
  getServiceClient: vi.fn(),
}));

const mockSession: Session = {
  userId: 'user-1',
  email: 'test@example.com',
  displayName: 'Test',
  avatarUrl: null,
  role: 'user',
};

describe('__root.tsx beforeLoad', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns the session when getSessionFn resolves with a session', async () => {
    const { getSessionFn } = await import('@everyone-web/server/auth');
    vi.mocked(getSessionFn).mockResolvedValue(mockSession);

    const rootMod = await import('@everyone-web/routes/__root');
    const result = await rootMod.beforeLoadHandler();

    expect(result).toEqual({ session: mockSession });
  });

  it('returns null session when getSessionFn resolves with null', async () => {
    const { getSessionFn } = await import('@everyone-web/server/auth');
    vi.mocked(getSessionFn).mockResolvedValue(null);

    const rootMod = await import('@everyone-web/routes/__root');
    const result = await rootMod.beforeLoadHandler();

    expect(result).toEqual({ session: null });
  });
});
