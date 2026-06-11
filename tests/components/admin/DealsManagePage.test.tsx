// @vitest-environment jsdom
/**
 * REQ-CALLBACK-1 — DealsManagePage handlers must be referentially stable
 *
 * Spec acceptance criterion:
 * - All six async handlers are wrapped in useCallback with correct dependency arrays
 * - sharedCallbacks is wrapped in useMemo (or constituent callbacks are stable refs)
 * - A test renders DealsManagePage with a fixed deals prop, triggers a state update
 *   that does NOT change deals, and asserts that handler references passed to child
 *   components did NOT change.
 *
 * T13 is a SAFETY-NET test: it must be GREEN against the new (useCallback/useMemo)
 * implementation. Do NOT force a RED phase — the test design must verify stability
 * in a way that already passes once T14 is applied.
 *
 * Test strategy:
 * We cannot directly inspect function references via React Testing Library without
 * instrumenting the component. Instead we verify the BEHAVIORAL outcome of stability:
 * - A pure UI state update (opening the "Add deal" dialog) should NOT cause
 *   DealsCardGrid to re-render with different callback props.
 * - We mock DealsCardGrid to capture the props it receives on each render.
 * - After a state-only update, all callback props must be the SAME reference as before.
 *
 * This is the canonical pattern for testing referential stability in React.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DealRow } from '@everyone-web/types/supabase';

// ── Mocks ──────────────────────────────────────────────────────────────────

// Mock TanStack Router (useRouter)
vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useRouter: vi.fn().mockReturnValue({ invalidate: vi.fn() }),
    createFileRoute: actual.createFileRoute,
  };
});

// Capture DealsCardGrid props per render
type CardGridProps = {
  deals: DealRow[];
  emptyMessage: string;
  onEdit: unknown;
  onDelete: unknown;
  onReject: unknown;
  onRestore: unknown;
  onPublishPreview: unknown;
  onToggleSelect?: unknown;
  selectedIds?: unknown;
};
const cardGridRenders: CardGridProps[] = [];

vi.mock('@everyone-web/components/admin/DealsCardGrid', () => ({
  DealsCardGrid: (props: CardGridProps) => {
    cardGridRenders.push(props);
    return <div data-testid="deals-card-grid">{props.emptyMessage}</div>;
  },
}));

// Mock all dialog/heavy components to avoid deep dependency tree
vi.mock('@everyone-web/components/admin/TelegramPreviewDialog', () => ({
  TelegramPreviewDialog: () => null,
}));
vi.mock('@everyone-web/components/admin/AddDealDialog', () => ({
  AddDealDialog: ({ open }: { open: boolean }) => (
    <div data-testid="add-deal-dialog" data-open={open} />
  ),
}));
vi.mock('@everyone-web/components/admin/DealEditDialog', () => ({
  DealEditDialog: () => null,
}));
vi.mock('@everyone-web/components/admin/DeleteConfirmDialog', () => ({
  DeleteConfirmDialog: () => null,
}));
vi.mock('@everyone-web/components/admin/DealStatsBar', () => ({
  DealStatsBar: () => null,
}));

// Mock Tabs to render all content
vi.mock('@everyone-web/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeDeal(overrides: Partial<DealRow> = {}): DealRow {
  return {
    id: 'deal-1',
    title: 'Test Deal',
    current_price: 100,
    previous_price: 150,
    average_price: 125,
    discount_percent: 33,
    image_url: null,
    original_url: 'https://amazon.es/dp/B123',
    affiliate_url: null,
    source: 'amazon',
    status: 'pending',
    found_at: '2026-06-01T10:00:00Z',
    published_at: null,
    telegram_message_id: null,
    chollometro_id: null,
    group_id: null,
    youtube_review_url: null,
    hashtags: [],
    created_at: '2026-06-01T10:00:00Z',
    updated_at: '2026-06-01T10:00:00Z',
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('DealsManagePage — REQ-CALLBACK-1: handler referential stability', () => {
  beforeEach(() => {
    cardGridRenders.length = 0;
    vi.clearAllMocks();
  });

  it('renders DealsCardGrid with the pending deals list', async () => {
    const { DealsManagePage } = await import('@everyone-web/routes/_admin/deals.manage');
    const deals = [makeDeal({ status: 'pending' })];

    render(<DealsManagePage deals={deals} />);

    expect(screen.getAllByTestId('deals-card-grid').length).toBeGreaterThan(0);
  });

  it('handler references are stable across state-only updates (open/close dialog)', async () => {
    const user = userEvent.setup();
    const { DealsManagePage } = await import('@everyone-web/routes/_admin/deals.manage');
    const deals = [makeDeal({ status: 'pending' })];

    render(<DealsManagePage deals={deals} />);

    // Capture initial render callbacks from the FIRST CardGrid render
    const initialRender = cardGridRenders[0];
    expect(initialRender).toBeDefined();
    const {
      onEdit: onEditBefore,
      onDelete: onDeleteBefore,
      onReject: onRejectBefore,
      onRestore: onRestoreBefore,
      onPublishPreview: onPublishPreviewBefore,
    } = initialRender;

    // Trigger a state-only update: click "Añadir oferta" button (opens addOpen dialog)
    // This changes `addOpen` state which does NOT affect deals or handler deps
    const addButton = screen.getByRole('button', { name: /añadir oferta/i });
    await user.click(addButton);

    // After state update, get the LATEST CardGrid renders (Tabs renders 3 grids)
    // All grids rendered AFTER the state update
    const rendersAfterUpdate = cardGridRenders.filter(r => r !== initialRender);
    expect(rendersAfterUpdate.length).toBeGreaterThan(0);

    // All post-update renders should have the SAME function references as before
    for (const render of rendersAfterUpdate) {
      expect(render.onEdit).toBe(onEditBefore);
      expect(render.onDelete).toBe(onDeleteBefore);
      expect(render.onReject).toBe(onRejectBefore);
      expect(render.onRestore).toBe(onRestoreBefore);
      expect(render.onPublishPreview).toBe(onPublishPreviewBefore);
    }
  });

  it('sharedCallbacks object is stable across state-only updates', async () => {
    const user = userEvent.setup();
    const { DealsManagePage } = await import('@everyone-web/routes/_admin/deals.manage');
    const deals = [makeDeal({ status: 'pending' }), makeDeal({ id: 'deal-2', status: 'published' })];

    render(<DealsManagePage deals={deals} />);

    const initialRender = cardGridRenders[0];
    const { onEdit: onEditBefore } = initialRender;

    // Multiple state updates should not change the references
    const addButton = screen.getByRole('button', { name: /añadir oferta/i });
    await user.click(addButton);
    await act(async () => {});
    await user.click(addButton); // toggle twice

    const laterRenders = cardGridRenders.slice(1);
    for (const r of laterRenders) {
      expect(r.onEdit).toBe(onEditBefore);
    }
  });
});
