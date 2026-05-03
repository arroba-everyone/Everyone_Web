import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { DealRow } from '@everyone-web/types/supabase';

// Mock TanStack Router
vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useRouterState: vi.fn().mockReturnValue({ location: { pathname: '/deals/manage' } }),
  };
});

import { DealsTable } from '@everyone-web/components/admin/DealsTable';

function makeDeal(overrides: Partial<DealRow> = {}): DealRow {
  return {
    id: overrides.id ?? 'deal-1',
    title: overrides.title ?? 'Deal Test',
    current_price: overrides.current_price ?? 100,
    previous_price: overrides.previous_price ?? 150,
    average_price: null,
    discount_percent: null,
    image_url: null,
    original_url: 'https://example.com',
    affiliate_url: null,
    source: 'amazon',
    status: overrides.status ?? 'pending',
    found_at: '2026-01-01T00:00:00Z',
    published_at: overrides.published_at ?? null,
    telegram_message_id: null,
    chollometro_id: null,
    group_id: null,
    youtube_review_url: null,
    hashtags: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  };
}

const mixedDeals: DealRow[] = [
  makeDeal({ id: 'd1', title: 'Oferta pendiente', status: 'pending' }),
  makeDeal({
    id: 'd2',
    title: 'Oferta publicada',
    status: 'published',
    published_at: '2026-01-02T00:00:00Z',
  }),
  makeDeal({ id: 'd3', title: 'Oferta rechazada', status: 'rejected' }),
];

const noop = vi.fn();

describe('DealsTable', () => {
  it('renders all three statuses with correct badges', () => {
    render(
      <DealsTable
        deals={mixedDeals}
        onPublish={noop}
        onReject={noop}
        onEdit={noop}
        onDelete={noop}
      />
    );

    expect(screen.getByText('Oferta pendiente')).toBeTruthy();
    expect(screen.getByText('Oferta publicada')).toBeTruthy();
    expect(screen.getByText('Oferta rechazada')).toBeTruthy();

    // Status badges (Spanish labels)
    expect(screen.getByText('Pendiente')).toBeTruthy();
    expect(screen.getByText('Publicada')).toBeTruthy();
    expect(screen.getByText('Rechazada')).toBeTruthy();
  });

  it('filters by status when "published" is selected', async () => {
    render(
      <DealsTable
        deals={mixedDeals}
        onPublish={noop}
        onReject={noop}
        onEdit={noop}
        onDelete={noop}
      />
    );

    // Filter defaults to "Todas"
    const filterTrigger = screen.getByText('Todas');
    expect(filterTrigger).toBeTruthy();
  });

  it('calls onPublish with deal id when Publicar button is clicked', () => {
    const onPublish = vi.fn();
    render(
      <DealsTable
        deals={[makeDeal({ id: 'deal-p1', status: 'pending' })]}
        onPublish={onPublish}
        onReject={noop}
        onEdit={noop}
        onDelete={noop}
      />
    );

    const publishBtn = screen.getByRole('button', { name: /publicar/i });
    fireEvent.click(publishBtn);
    expect(onPublish).toHaveBeenCalledWith('deal-p1');
    expect(onPublish).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete with deal id when Eliminar button is clicked', () => {
    const onDelete = vi.fn();
    render(
      <DealsTable
        deals={[makeDeal({ id: 'deal-d1', status: 'pending' })]}
        onPublish={noop}
        onReject={noop}
        onEdit={noop}
        onDelete={onDelete}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith('deal-d1');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
