import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock MainLayout to avoid pulling in Navbar + useRouteContext complexity
vi.mock('@everyone-web/components/MainLayout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock TanStack Router (used in AdminLayout for useRouterState + Link)
vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useRouterState: vi.fn(),
    Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => (
      <a href={to} className={className}>{children}</a>
    ),
  };
});

import { AdminLayout } from '@everyone-web/components/admin/AdminLayout';
import { useRouterState } from '@tanstack/react-router';
import type { Mock } from 'vitest';

function setPathname(path: string) {
  (useRouterState as Mock).mockReturnValue(path);
}

describe('AdminLayout', () => {
  it('(a) renders the "Panel de equipo" branding header', () => {
    setPathname('/deals/manage');
    render(<AdminLayout>content</AdminLayout>);
    expect(screen.getByText('Panel de equipo')).toBeInTheDocument();
  });

  it('(b) nav link for active path gets the active pill classes; others do not', () => {
    setPathname('/deals/manage');
    render(<AdminLayout>content</AdminLayout>);

    const ofertasLink = screen.getByRole('link', { name: /ofertas/i });
    const blogLink = screen.getByRole('link', { name: /blog/i });

    expect(ofertasLink.classList.contains('bg-ink')).toBe(true);
    expect(blogLink.classList.contains('bg-ink')).toBe(false);
  });

  it('(c) toggles the light token scope class on <body> while mounted', () => {
    setPathname('/deals/manage');
    const { unmount } = render(<AdminLayout>content</AdminLayout>);
    expect(document.body.classList.contains('theme-light')).toBe(true);
    unmount();
    expect(document.body.classList.contains('theme-light')).toBe(false);
  });

  it('(d) children content renders', () => {
    setPathname('/deals/manage');
    render(<AdminLayout>Page content here</AdminLayout>);
    expect(screen.getByText('Page content here')).toBeInTheDocument();
  });
});
