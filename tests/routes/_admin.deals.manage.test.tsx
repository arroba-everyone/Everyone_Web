import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DealRow } from '@everyone-web/types/supabase';

// Mock TanStack Router before importing the route component
vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useRouterState: vi.fn().mockReturnValue('/deals/manage'),
    useRouter: vi.fn(() => ({ invalidate: vi.fn() })),
    Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => (
      <a href={to} className={className}>{children}</a>
    ),
    createFileRoute: vi.fn(() => (config: unknown) => config),
  };
});

// Mock MainLayout to avoid Navbar + useRouteContext complexity
vi.mock('@everyone-web/components/MainLayout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock service fns
vi.mock('@everyone-web/services/deals', () => ({
  getAllDealsForAdminFn: vi.fn(),
  setDealStatusFn: vi.fn(),
  deleteDealFn: vi.fn(),
  publishDealWithEditsFn: vi.fn(),
  createDealFn: vi.fn(),
  updateDealFn: vi.fn(),
}));

vi.mock('@tanstack/react-start', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-start')>();
  return {
    ...actual,
    createServerFn: vi.fn(() => ({
      inputValidator: vi.fn().mockReturnThis(),
      handler: vi.fn((fn: unknown) => fn),
    })),
  };
});

// Import AFTER mocks
import { DealsManagePage } from '@everyone-web/routes/_admin/deals.manage';

function makeDeal(overrides: Partial<DealRow> = {}): DealRow {
  return {
    id: overrides.id ?? 'deal-1',
    title: overrides.title ?? 'Deal Test',
    current_price: 100,
    previous_price: 150,
    average_price: null,
    discount_percent: null,
    image_url: null,
    original_url: 'https://example.com',
    affiliate_url: null,
    source: 'amazon',
    status: overrides.status ?? 'pending',
    found_at: '2026-01-01T00:00:00Z',
    published_at: null,
    telegram_message_id: null,
    chollometro_id: null,
    group_id: null,
    youtube_review_url: null,
    hashtags: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DealsManagePage', () => {
  it('(a) renders DealStatsBar with counts derived from loader data', () => {
    const deals = [
      makeDeal({ status: 'pending' }),
      makeDeal({ id: 'd2', status: 'pending' }),
      makeDeal({ id: 'd3', status: 'published' }),
      makeDeal({ id: 'd4', status: 'rejected' }),
    ];
    render(<DealsManagePage deals={deals} />);

    expect(screen.getByTestId('published-count')).toHaveTextContent('1');
    // 2 pending shows in the tab trigger
    expect(screen.getByRole('tab', { name: /pendientes \(2\)/i })).toBeInTheDocument();
  });

  it('(b) renders Tabs with three tabs', () => {
    render(<DealsManagePage deals={[]} />);
    expect(screen.getByRole('tab', { name: /pendientes/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /publicadas/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /rechazadas/i })).toBeInTheDocument();
  });

  it('(c) default tab is "Pendientes"', () => {
    render(<DealsManagePage deals={[]} />);
    const pendientesTab = screen.getByRole('tab', { name: /pendientes/i });
    expect(pendientesTab).toHaveAttribute('data-state', 'active');
  });

  it('(d) clicking "Publicadas" tab shows only published deals', async () => {
    const user = userEvent.setup();
    const deals = [
      makeDeal({ id: 'd1', title: 'Pendiente Deal', status: 'pending' }),
      makeDeal({ id: 'd2', title: 'Published Deal', status: 'published' }),
    ];
    render(<DealsManagePage deals={deals} />);

    await user.click(screen.getByRole('tab', { name: /publicadas/i }));

    expect(screen.getByText('Published Deal')).toBeInTheDocument();
    expect(screen.queryByText('Pendiente Deal')).toBeNull();
  });

  it('(e) clicking "Rechazadas" tab shows only rejected deals', async () => {
    const user = userEvent.setup();
    const deals = [
      makeDeal({ id: 'd1', title: 'Pendiente Deal', status: 'pending' }),
      makeDeal({ id: 'd2', title: 'Rechazada Deal', status: 'rejected' }),
    ];
    render(<DealsManagePage deals={deals} />);

    await user.click(screen.getByRole('tab', { name: /rechazadas/i }));

    expect(screen.getByText('Rechazada Deal')).toBeInTheDocument();
    expect(screen.queryByText('Pendiente Deal')).toBeNull();
  });

  it('(f) clicking "Añadir oferta" button renders AddDealDialog open', async () => {
    const user = userEvent.setup();
    render(<DealsManagePage deals={[]} />);

    await user.click(screen.getByRole('button', { name: /añadir oferta/i }));

    // AddDealDialog should now be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('(g) clicking "Vista previa" on a pending card renders TelegramPreviewDialog open', async () => {
    const user = userEvent.setup();
    const deals = [makeDeal({ status: 'pending', title: 'Test Deal' })];
    render(<DealsManagePage deals={deals} />);

    await user.click(screen.getByRole('button', { name: /vista previa telegram/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // TelegramPreviewDialog dialog title (different from the button label)
    expect(screen.getByRole('heading', { name: /vista previa/i })).toBeInTheDocument();
  });

  it('(h) empty state renders in a tab with no deals for that status', async () => {
    const user = userEvent.setup();
    const deals = [makeDeal({ status: 'pending' })]; // no rejected deals
    render(<DealsManagePage deals={deals} />);

    await user.click(screen.getByRole('tab', { name: /rechazadas/i }));

    expect(screen.getByTestId('grid-empty-state')).toBeInTheDocument();
  });
});
