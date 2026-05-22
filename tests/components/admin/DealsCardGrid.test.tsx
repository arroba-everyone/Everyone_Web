import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DealRow } from '@everyone-web/types/supabase';
import { DealsCardGrid } from '@everyone-web/components/admin/DealsCardGrid';

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

function defaultCallbacks() {
  return {
    onPublishPreview: vi.fn(),
    onReject: vi.fn(),
    onRestore: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };
}

describe('DealsCardGrid', () => {
  it('(a) empty deals=[] renders empty state with PackageOpen icon and emptyMessage', () => {
    render(
      <DealsCardGrid
        deals={[]}
        emptyMessage="No hay ofertas pendientes"
        {...defaultCallbacks()}
      />
    );
    expect(screen.getByText('No hay ofertas pendientes')).toBeInTheDocument();
    // Empty state should have the fallback icon (data-testid from DealImage or its own)
    expect(screen.getByTestId('grid-empty-state')).toBeInTheDocument();
  });

  it('(b) deals with N items renders exactly N DealCard elements', () => {
    const deals = [
      makeDeal({ id: 'deal-1', title: 'Deal Uno' }),
      makeDeal({ id: 'deal-2', title: 'Deal Dos' }),
      makeDeal({ id: 'deal-3', title: 'Deal Tres' }),
    ];
    render(<DealsCardGrid deals={deals} {...defaultCallbacks()} />);

    expect(screen.getByText('Deal Uno')).toBeInTheDocument();
    expect(screen.getByText('Deal Dos')).toBeInTheDocument();
    expect(screen.getByText('Deal Tres')).toBeInTheDocument();
  });

  it('(c) onPublishPreview callback propagated to correct card by deal', async () => {
    const user = userEvent.setup();
    const cbs = defaultCallbacks();
    const deals = [
      makeDeal({ id: 'deal-1', title: 'Deal Uno', status: 'pending' }),
      makeDeal({ id: 'deal-2', title: 'Deal Dos', status: 'pending' }),
    ];
    render(<DealsCardGrid deals={deals} {...cbs} />);

    // Click preview on the first card specifically (using getAllByRole and index)
    const previewBtns = screen.getAllByRole('button', { name: /vista previa telegram/i });
    await user.click(previewBtns[0]);
    expect(cbs.onPublishPreview).toHaveBeenCalledWith(deals[0]);
  });

  it('(d) onDelete callback propagated correctly (via published deal dropdown)', async () => {
    const user = userEvent.setup();
    const cbs = defaultCallbacks();
    // Use published status — pending no longer has a dropdown (A3)
    const deals = [makeDeal({ id: 'deal-42', status: 'published' })];
    render(<DealsCardGrid deals={deals} {...cbs} />);

    // Open dropdown and click Eliminar
    await user.click(screen.getByRole('button', { name: /más acciones/i }));
    await user.click(screen.getByRole('menuitem', { name: /eliminar/i }));
    expect(cbs.onDelete).toHaveBeenCalledWith('deal-42');
  });
});
