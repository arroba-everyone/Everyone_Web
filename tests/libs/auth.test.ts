// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the supabase browser client
vi.mock('@everyone-web/libs/supabase', () => {
  const mockAuth = {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    signInWithOAuth: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  };
  return {
    getBrowserClient: vi.fn(() => ({ auth: mockAuth })),
  };
});

describe('signInWithPassword()', () => {
  let mockAuth: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    vi.resetModules();
    const supabaseMod = await import('@everyone-web/libs/supabase');
    const client = supabaseMod.getBrowserClient();
    mockAuth = client.auth as unknown as Record<string, ReturnType<typeof vi.fn>>;
  });

  it('returns { ok: true, data: { session } } on success', async () => {
    mockAuth['signInWithPassword'].mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          app_metadata: { role: 'user' },
        },
        session: { access_token: 'tok' },
      },
      error: null,
    });

    const { signInWithPassword } = await import('@everyone-web/libs/auth');
    const result = await signInWithPassword('test@example.com', 'password123');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.session.userId).toBe('user-1');
      expect(result.data.session.email).toBe('test@example.com');
      expect(result.data.session.role).toBe('user');
    }
  });

  it('returns { ok: false, error } on invalid credentials', async () => {
    mockAuth['signInWithPassword'].mockResolvedValue({
      data: { user: null, session: null },
      error: { code: 'invalid_credentials', message: 'Invalid login credentials' },
    });

    const { signInWithPassword } = await import('@everyone-web/libs/auth');
    const result = await signInWithPassword('bad@example.com', 'wrongpassword');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_credentials');
    }
  });
});

describe('signInWithGoogle()', () => {
  let mockAuth: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    vi.resetModules();
    const supabaseMod = await import('@everyone-web/libs/supabase');
    const client = supabaseMod.getBrowserClient();
    mockAuth = client.auth as unknown as Record<string, ReturnType<typeof vi.fn>>;
  });

  it('calls signInWithOAuth with provider: "google" and redirectTo ending in /auth/callback', async () => {
    mockAuth['signInWithOAuth'].mockResolvedValue({ data: {}, error: null });

    const { signInWithGoogle } = await import('@everyone-web/libs/auth');
    await signInWithGoogle();

    expect(mockAuth['signInWithOAuth']).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'google',
        options: expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/callback'),
        }),
      })
    );
  });
});

describe('requestPasswordReset()', () => {
  let mockAuth: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    vi.resetModules();
    const supabaseMod = await import('@everyone-web/libs/supabase');
    const client = supabaseMod.getBrowserClient();
    mockAuth = client.auth as unknown as Record<string, ReturnType<typeof vi.fn>>;
  });

  it('calls resetPasswordForEmail with the email and a redirectTo pointing to /auth/callback', async () => {
    mockAuth['resetPasswordForEmail'].mockResolvedValue({ data: {}, error: null });

    const { requestPasswordReset } = await import('@everyone-web/libs/auth');
    await requestPasswordReset('user@example.com');

    expect(mockAuth['resetPasswordForEmail']).toHaveBeenCalledWith(
      'user@example.com',
      expect.objectContaining({
        redirectTo: expect.stringContaining('/auth/callback'),
      })
    );
  });
});

describe('resetPassword()', () => {
  let mockAuth: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    vi.resetModules();
    const supabaseMod = await import('@everyone-web/libs/supabase');
    const client = supabaseMod.getBrowserClient();
    mockAuth = client.auth as unknown as Record<string, ReturnType<typeof vi.fn>>;
  });

  it('calls updateUser with { password } and returns { ok: true } on success', async () => {
    mockAuth['updateUser'].mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          email: 'user@example.com',
          app_metadata: {},
        },
      },
      error: null,
    });

    const { resetPassword } = await import('@everyone-web/libs/auth');
    const result = await resetPassword('newpassword123');

    expect(mockAuth['updateUser']).toHaveBeenCalledWith({ password: 'newpassword123' });
    expect(result.ok).toBe(true);
  });
});
