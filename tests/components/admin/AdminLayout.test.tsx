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
  it('(a) renders @EveryoneOfertas text with class glow-primary', () => {
    setPathname('/deals/manage');
    render(<AdminLayout>content</AdminLayout>);
    const brand = screen.getByText('@EveryoneOfertas');
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveClass('glow-primary');
  });

  it('(b) nav link for active path has glow-primary class; others do not', () => {
    setPathname('/deals/manage');
    render(<AdminLayout>content</AdminLayout>);

    const ofertasLink = screen.getByRole('link', { name: /ofertas/i });
    const blogLink = screen.getByRole('link', { name: /blog/i });

    expect(ofertasLink.className).toContain('glow-primary');
    expect(blogLink.className).not.toContain('glow-primary');
  });

  it('(c) <Separator /> renders between branding and nav tabs', () => {
    setPathname('/deals/manage');
    const { container } = render(<AdminLayout>content</AdminLayout>);
    // Separator renders with data-slot="separator" (decorative=true → role="none")
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
  });

  it('(d) children content renders', () => {
    setPathname('/deals/manage');
    render(<AdminLayout>Page content here</AdminLayout>);
    expect(screen.getByText('Page content here')).toBeInTheDocument();
  });
});
