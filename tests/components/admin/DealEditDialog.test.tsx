import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DealRow } from '@everyone-web/types/supabase';

vi.mock('@everyone-web/services/deals', () => ({
  updateDealFn: vi.fn(),
}));

vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useRouter: vi.fn(() => ({ invalidate: vi.fn() })),
  };
});

import { DealEditDialog } from '@everyone-web/components/admin/DealEditDialog';
import { updateDealFn as _updateDealFn } from '@everyone-web/services/deals';
import type { Mock } from 'vitest';
const updateDealFn = _updateDealFn as unknown as Mock;

function makeDeal(overrides: Partial<DealRow> = {}): DealRow {
  return {
    id: 'deal-1',
    title: 'Auriculares Sony',
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

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DealEditDialog', () => {
  it('(a) dialog opens with deal data pre-filled', async () => {
    const deal = makeDeal({ title: 'Auriculares Sony' });
    render(<DealEditDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Auriculares Sony')).toBeInTheDocument();
    });
  });

  it('(b) editing title and saving calls updateDealFn with updated fields', async () => {
    const user = userEvent.setup();
    updateDealFn.mockResolvedValue({});
    const deal = makeDeal({ title: 'Auriculares Sony' });
    render(<DealEditDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const titleInput = screen.getByDisplayValue('Auriculares Sony');
    await user.clear(titleInput);
    await user.type(titleInput, 'Nuevo Título');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(updateDealFn).toHaveBeenCalled();
    });
    const callArg = updateDealFn.mock.calls[0][0] as { data: { id: string; fields: Record<string, unknown> } };
    const fields = callArg.data.fields;
    expect(fields.title).toBe('Nuevo Título');
  });

  it('(c) no regression in form validation — empty title throws validation error', async () => {
    const user = userEvent.setup();
    const deal = makeDeal({ title: 'Auriculares Sony' });
    render(<DealEditDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const titleInput = screen.getByDisplayValue('Auriculares Sony');
    await user.clear(titleInput);
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(updateDealFn).not.toHaveBeenCalled();
    });
  });
});

describe('DealEditDialog — "Ver en Amazon" link on original_url field', () => {
  it('(d) link present with correct href matching initial original_url', async () => {
    const deal = makeDeal({ original_url: 'https://www.amazon.es/dp/B0X' });
    render(<DealEditDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    await waitFor(() => {
      const link = screen.getByRole('link', { name: /ver en amazon/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://www.amazon.es/dp/B0X');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('(e) href updates live when original_url input value changes', async () => {
    const user = userEvent.setup();
    const deal = makeDeal({ original_url: 'https://www.amazon.es/dp/B0X' });
    render(<DealEditDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://www.amazon.es/dp/B0X')).toBeInTheDocument();
    });

    const urlInput = screen.getByDisplayValue('https://www.amazon.es/dp/B0X');
    await user.clear(urlInput);
    await user.type(urlInput, 'https://amazon.com/dp/B0Y');

    await waitFor(() => {
      const link = screen.getByRole('link', { name: /ver en amazon/i });
      expect(link).toHaveAttribute('href', 'https://amazon.com/dp/B0Y');
    });
  });
});
