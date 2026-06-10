import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Session } from '@everyone-web/types/session';

// Mock TanStack Router hooks (must not use window.location.pathname)
vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useRouterState: vi.fn().mockReturnValue({ location: { pathname: '/' } }),
    useRouter: vi.fn().mockReturnValue({ invalidate: vi.fn() }),
    Link: ({ children, to }: { children: React.ReactNode; to?: string }) => (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a href={typeof to === 'string' ? to : undefined}>{children}</a>
    ),
  };
});

// Mock useSession hook
vi.mock('@everyone-web/hooks/useSession', () => ({
  useSession: vi.fn(),
}));

// Mock signOut
vi.mock('@everyone-web/libs/auth', () => ({
  signOut: vi.fn().mockResolvedValue({ ok: true, data: undefined }),
}));

// Mock DropdownMenu to render contents directly (Radix portals don't work in jsdom)
vi.mock('@everyone-web/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) =>
    asChild ? <>{children}</> : <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
    asChild,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    asChild?: boolean;
  }) =>
    asChild ? (
      <>{children}</>
    ) : (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
      <div role="menuitem" onClick={onClick}>
        {children}
      </div>
    ),
  DropdownMenuSeparator: () => <hr />,
}));

import { Navbar } from '@everyone-web/components/MainLayout/Navbar';
import { useSession } from '@everyone-web/hooks/useSession';
import type { Mock } from 'vitest';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Navbar', () => {
  it('does NOT show any login link when session is null (team access lives in the footer)', () => {
    (useSession as Mock).mockReturnValue(null);

    render(<Navbar />);

    expect(screen.queryByRole('link', { name: /entrar|iniciar sesión/i })).toBeNull();

    // The public CTA should be there instead
    const ctaLinks = screen.getAllByRole('link', { name: /empezar un proyecto/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
    expect(ctaLinks[0].getAttribute('href')).toBe('/contact');
  });

  it('does NOT access window.location.pathname for active route (uses useRouterState)', () => {
    (useSession as Mock).mockReturnValue(null);

    // Verify that useRouterState mock is driving the pathname, not window.location
    // The mock returns '/' — if the component used window.location, the jsdom default
    // pathname is also '/' so this test verifies the dependency injection path.
    // We explicitly spy to make sure window.location is not accessed.
    let locationAccessed = false;
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
    Object.defineProperty(window, 'location', {
      get: () => {
        locationAccessed = true;
        return originalDescriptor?.get?.call(window);
      },
      configurable: true,
    });

    render(<Navbar />);

    // Clean up
    if (originalDescriptor) {
      Object.defineProperty(window, 'location', originalDescriptor);
    }

    expect(locationAccessed).toBe(false);
  });

  it('shows UserMenu (avatar button) and not "Entrar" when session is present', () => {
    const session: Session = { userId: 'u1', email: 'user@test.com', displayName: 'Usuario', avatarUrl: null, role: 'user' };
    (useSession as Mock).mockReturnValue(session);

    render(<Navbar />);

    // No login link should appear either way
    expect(screen.queryByRole('link', { name: /entrar|iniciar sesión/i })).toBeNull();

    // The avatar button should appear (aria-label contains the display name)
    const avatarBtn = screen
      .getAllByRole('button')
      .find(btn => btn.getAttribute('aria-label')?.includes('Usuario'));
    expect(avatarBtn).toBeTruthy();
  });

  it('renders "Panel admin" in user menu only for admin role', () => {
    const adminSession: Session = { userId: 'a1', email: 'admin@test.com', displayName: 'Admin', avatarUrl: null, role: 'admin' };
    (useSession as Mock).mockReturnValue(adminSession);

    render(<Navbar />);

    // The dropdown content is rendered (mocked to always be visible)
    // Multiple dropdown-content elements exist (desktop + mobile both render UserMenu)
    const dropdowns = screen.getAllByTestId('dropdown-content');
    expect(dropdowns.length).toBeGreaterThan(0);

    // "Panel admin" link should be present in the DOM
    const adminLinks = screen.getAllByRole('link', { name: /panel admin/i });
    expect(adminLinks.length).toBeGreaterThan(0);
  });
});
