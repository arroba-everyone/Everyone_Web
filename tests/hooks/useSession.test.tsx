// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { Session } from '@everyone-web/types/session';

// Mock useRouteContext from TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useRouteContext: vi.fn(),
}));

import { useRouteContext } from '@tanstack/react-router';

const mockSession: Session = {
  userId: 'user-1',
  email: 'test@example.com',
  displayName: 'Test',
  avatarUrl: null,
  role: 'user',
};

describe('useSession()', () => {
  it('returns null when context has no session', async () => {
    vi.mocked(useRouteContext).mockReturnValue({ session: null });

    const { useSession } = await import('@everyone-web/hooks/useSession');
    const { result } = renderHook(() => useSession());

    expect(result.current).toBeNull();
  });

  it('returns the session object when context has a valid session', async () => {
    vi.mocked(useRouteContext).mockReturnValue({ session: mockSession });

    const { useSession } = await import('@everyone-web/hooks/useSession');
    const { result } = renderHook(() => useSession());

    expect(result.current).toEqual(mockSession);
    expect(result.current?.role).toBe('user');
    expect(result.current?.email).toBe('test@example.com');
  });
});
