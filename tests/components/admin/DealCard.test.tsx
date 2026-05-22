import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DealRow } from '@everyone-web/types/supabase';
import { DealCard } from '@everyone-web/components/admin/DealCard';

function makeDeal(overrides: Partial<DealRow> = {}): DealRow {
  return {
    id: 'deal-1',
    title: 'Auriculares Sony WH-1000XM5',
    current_price: 250,
    previous_price: 380,
    average_price: 300,
    discount_percent: 34,
    image_url: null,
    original_url: 'https://amazon.es/dp/B123456',
    affiliate_url: null,
    source: 'amazon',
    status: 'pending',
    found_at: '2026-05-08T10:00:00Z',
    published_at: null,
    telegram_message_id: null,
    chollometro_id: null,
    group_id: null,
    youtube_review_url: null,
    hashtags: [],
    created_at: '2026-05-08T10:00:00Z',
    updated_at: '2026-05-08T10:00:00Z',
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

describe('DealCard — status-conditional rendering', () => {
  it('(a) status=pending shows "Vista previa Telegram" button and NO dropdown (A3)', () => {
    const deal = makeDeal({ status: 'pending' });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    expect(screen.getByRole('button', { name: /vista previa telegram/i })).toBeInTheDocument();
    // Pending: no dropdown — all actions are inside the TelegramPreviewDialog
    expect(screen.queryByRole('button', { name: /más acciones/i })).toBeNull();
  });

  it('(b) status=published shows "Editar" button and dropdown with "Despublicar", "Eliminar"', async () => {
    const user = userEvent.setup();
    const deal = makeDeal({ status: 'published', telegram_message_id: 123 });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();

    const moreBtn = screen.getByRole('button', { name: /más acciones/i });
    await user.click(moreBtn);

    expect(screen.getByRole('menuitem', { name: /despublicar/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /eliminar/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /vista previa/i })).toBeNull();
    expect(screen.queryByRole('menuitem', { name: /rechazar/i })).toBeNull();
  });

  it('(c) status=rejected shows "Restaurar" button and dropdown with "Editar", "Eliminar"', async () => {
    const user = userEvent.setup();
    const deal = makeDeal({ status: 'rejected' });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    expect(screen.getByRole('button', { name: /restaurar/i })).toBeInTheDocument();

    const moreBtn = screen.getByRole('button', { name: /más acciones/i });
    await user.click(moreBtn);

    expect(screen.getByRole('menuitem', { name: /editar/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /eliminar/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /vista previa/i })).toBeNull();
    expect(screen.queryByRole('menuitem', { name: /rechazar/i })).toBeNull();
  });

  it('(d) badge -45% appears when discount_percent=45', () => {
    const deal = makeDeal({ discount_percent: 45 });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);
    expect(screen.getByText('-45%')).toBeInTheDocument();
  });

  it('(d) badge absent when discount_percent is null', () => {
    const deal = makeDeal({ discount_percent: null });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);
    expect(screen.queryByText(/-\d+%/)).toBeNull();
  });

  it('(e) "Mínimo histórico" badge appears when isHistoricalLow is true', () => {
    // current(200) <= average(300) && current(200) < previous(380) → historical low
    const deal = makeDeal({ current_price: 200, average_price: 300, previous_price: 380 });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);
    expect(screen.getByText(/mínimo histórico/i)).toBeInTheDocument();
  });

  it('(e) "Mínimo histórico" badge absent when isHistoricalLow is false', () => {
    // current(400) > average(300) → not a historical low
    const deal = makeDeal({ current_price: 400, average_price: 300, previous_price: 380 });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);
    expect(screen.queryByText(/mínimo histórico/i)).toBeNull();
  });

  it('(f) previous_price renders with line-through when non-null', () => {
    const deal = makeDeal({ previous_price: 380 });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);
    const strikethrough = screen.getByTestId('previous-price');
    expect(strikethrough).toHaveClass('line-through');
  });

  it('(f) previous_price element absent when previous_price is null', () => {
    const deal = makeDeal({ previous_price: null });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);
    expect(screen.queryByTestId('previous-price')).toBeNull();
  });

  it('(g) click "Vista previa" calls onPublishPreview(deal)', async () => {
    const user = userEvent.setup();
    const cbs = defaultCallbacks();
    const deal = makeDeal({ status: 'pending' });
    render(<DealCard deal={deal} {...cbs} />);

    await user.click(screen.getByRole('button', { name: /vista previa telegram/i }));
    expect(cbs.onPublishPreview).toHaveBeenCalledWith(deal);
  });

  it('(h) pending: no "Rechazar" in dropdown (moved to TelegramPreviewDialog — A3)', () => {
    const cbs = defaultCallbacks();
    const deal = makeDeal({ status: 'pending' });
    render(<DealCard deal={deal} {...cbs} />);

    // No dropdown button at all for pending
    expect(screen.queryByRole('button', { name: /más acciones/i })).toBeNull();
    expect(screen.queryByRole('menuitem', { name: /rechazar/i })).toBeNull();
  });

  it('(i) click "Restaurar" calls onRestore(deal.id)', async () => {
    const user = userEvent.setup();
    const cbs = defaultCallbacks();
    const deal = makeDeal({ status: 'rejected' });
    render(<DealCard deal={deal} {...cbs} />);

    await user.click(screen.getByRole('button', { name: /restaurar/i }));
    expect(cbs.onRestore).toHaveBeenCalledWith('deal-1');
  });

  it('(j) rejected: click "Editar" in dropdown calls onEdit(deal)', async () => {
    const user = userEvent.setup();
    const cbs = defaultCallbacks();
    const deal = makeDeal({ status: 'rejected' });
    render(<DealCard deal={deal} {...cbs} />);

    await user.click(screen.getByRole('button', { name: /más acciones/i }));
    await user.click(screen.getByRole('menuitem', { name: /editar/i }));
    expect(cbs.onEdit).toHaveBeenCalledWith(deal);
  });

  it('(k) published: click "Eliminar" in dropdown calls onDelete(deal.id)', async () => {
    const user = userEvent.setup();
    const cbs = defaultCallbacks();
    const deal = makeDeal({ status: 'published' });
    render(<DealCard deal={deal} {...cbs} />);

    await user.click(screen.getByRole('button', { name: /más acciones/i }));
    await user.click(screen.getByRole('menuitem', { name: /eliminar/i }));
    expect(cbs.onDelete).toHaveBeenCalledWith('deal-1');
  });
});

describe('DealCard — no dropdown for pending (A3)', () => {
  it('(n) pending: dropdown trigger NOT rendered', () => {
    const deal = makeDeal({ status: 'pending' });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    expect(screen.queryByRole('button', { name: /más acciones/i })).toBeNull();
  });

  it('(o) published: dropdown trigger IS rendered', () => {
    const deal = makeDeal({ status: 'published' });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    const moreBtn = screen.queryByRole('button', { name: /más acciones/i });
    expect(moreBtn).not.toBeNull();
  });

  it('(p) rejected: dropdown trigger IS rendered', async () => {
    const deal = makeDeal({ status: 'rejected' });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    const moreBtn = screen.queryByRole('button', { name: /más acciones/i });
    expect(moreBtn).not.toBeNull();
  });
});

describe('DealCard — direct "Rechazar" button for pending (A5)', () => {
  it('(q) pending: "Rechazar" button is visible directly on the card (not in any dropdown)', () => {
    const deal = makeDeal({ status: 'pending' });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    expect(screen.getByRole('button', { name: /rechazar/i })).toBeInTheDocument();
  });

  it('(r) pending: clicking "Rechazar" calls onReject(deal.id)', async () => {
    const user = userEvent.setup();
    const cbs = defaultCallbacks();
    const deal = makeDeal({ status: 'pending' });
    render(<DealCard deal={deal} {...cbs} />);

    await user.click(screen.getByRole('button', { name: /rechazar/i }));
    expect(cbs.onReject).toHaveBeenCalledWith('deal-1');
  });

  it('(s) published: no direct "Rechazar" button on the card', () => {
    const deal = makeDeal({ status: 'published' });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    expect(screen.queryByRole('button', { name: /rechazar/i })).toBeNull();
  });

  it('(t) rejected: no direct "Rechazar" button on the card', () => {
    const deal = makeDeal({ status: 'rejected' });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    expect(screen.queryByRole('button', { name: /rechazar/i })).toBeNull();
  });
});

describe('DealCard — "Ver en Amazon" link', () => {
  it('(l) link is present with correct href, target and rel', () => {
    const deal = makeDeal({ original_url: 'https://www.amazon.es/dp/B0X' });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    const link = screen.getByRole('link', { name: /ver en amazon/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.amazon.es/dp/B0X');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('(m) link contains ExternalLink icon (SVG)', () => {
    const deal = makeDeal({ original_url: 'https://www.amazon.es/dp/B0X' });
    render(<DealCard deal={deal} {...defaultCallbacks()} />);

    const link = screen.getByRole('link', { name: /ver en amazon/i });
    expect(link.querySelector('svg')).not.toBeNull();
  });
});
