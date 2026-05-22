import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DealRow } from '@everyone-web/types/supabase';

// Mock server fn and router BEFORE importing the component
vi.mock('@everyone-web/services/deals', () => ({
  publishDealWithEditsFn: vi.fn(),
}));

vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useRouter: vi.fn(() => ({ invalidate: vi.fn() })),
  };
});

import { TelegramPreviewDialog } from '@everyone-web/components/admin/TelegramPreviewDialog';
import { publishDealWithEditsFn as _publishDealWithEditsFn } from '@everyone-web/services/deals';
import type { Mock } from 'vitest';
const publishDealWithEditsFn = _publishDealWithEditsFn as unknown as Mock;

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
    hashtags: ['ofertazo', 'sony'],
    created_at: '2026-05-08T10:00:00Z',
    updated_at: '2026-05-08T10:00:00Z',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TelegramPreviewDialog', () => {
  it('(a) does not render content when open=false', () => {
    render(
      <TelegramPreviewDialog deal={makeDeal()} open={false} onOpenChange={vi.fn()} />
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('(b) when open=true with a deal having hashtags, prefills hashtags state', () => {
    const deal = makeDeal({ hashtags: ['ofertazo', 'sony'] });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    // Chips should be visible in the HashtagsInput (may appear multiple times due to preview)
    const ofertazoEls = screen.getAllByText('#ofertazo');
    expect(ofertazoEls.length).toBeGreaterThanOrEqual(1);
    const sonyEls = screen.getAllByText('#sony');
    expect(sonyEls.length).toBeGreaterThanOrEqual(1);
  });

  it('(c) editing hashtags via HashtagsInput reflects live in preview bubble', async () => {
    const user = userEvent.setup();
    const deal = makeDeal({ hashtags: [] });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const input = screen.getByPlaceholderText(/añadir hashtag/i);
    await user.click(input);
    await user.type(input, 'tecnologia');
    await user.keyboard('{Enter}');

    // The preview bubble should now show the hashtag
    expect(screen.getByTestId('telegram-preview-hashtags')).toHaveTextContent('#tecnologia');
  });

  it('(d) submit with valid data calls publishDealWithEditsFn', async () => {
    const user = userEvent.setup();
    publishDealWithEditsFn.mockResolvedValue({});
    const deal = makeDeal({ hashtags: ['ofertazo'] });
    const onOpenChange = vi.fn();
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(publishDealWithEditsFn).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: 'deal-1',
            hashtags: ['ofertazo'],
          }),
        })
      );
    });
  });

  it('(e) on success calls router.invalidate() and onOpenChange(false)', async () => {
    const user = userEvent.setup();
    publishDealWithEditsFn.mockResolvedValue({});
    const deal = makeDeal();
    const onOpenChange = vi.fn();
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('(f) on server error shows error message and keeps dialog open', async () => {
    const user = userEvent.setup();
    publishDealWithEditsFn.mockRejectedValue(new Error('Server error'));
    const deal = makeDeal();
    const onOpenChange = vi.fn();
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('(g) youtube URL empty is accepted without error', async () => {
    const user = userEvent.setup();
    publishDealWithEditsFn.mockResolvedValue({});
    const deal = makeDeal({ youtube_review_url: null });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    // Leave youtube URL field empty
    await user.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(publishDealWithEditsFn).toHaveBeenCalled();
    });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('(h) youtube URL with non-https value blocks submit with inline error', async () => {
    const user = userEvent.setup();
    const deal = makeDeal();
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const youtubeInput = screen.getByPlaceholderText(/https:\/\/youtube/i);
    await user.clear(youtubeInput);
    await user.type(youtubeInput, 'not-a-url');
    await user.click(screen.getByRole('button', { name: /publicar/i }));

    expect(screen.getByTestId('youtube-url-error')).toBeInTheDocument();
    expect(publishDealWithEditsFn).not.toHaveBeenCalled();
  });

  it('(i) cancel button calls onOpenChange(false) without calling publish fn', async () => {
    const user = userEvent.setup();
    const deal = makeDeal();
    const onOpenChange = vi.fn();
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(publishDealWithEditsFn).not.toHaveBeenCalled();
  });
});

describe('TelegramPreviewDialog — previous_price input + discount + hashtag fix', () => {
  it('(j) pre-fills previous price input from deal.previous_price', async () => {
    const deal = makeDeal({ previous_price: 89.99, current_price: 49.99 });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const input = screen.getByLabelText(/precio anterior/i);
    expect((input as HTMLInputElement).value).toBe('89.99');
  });

  it('(k) input is empty when previous_price is null', async () => {
    const deal = makeDeal({ previous_price: null });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const input = screen.getByLabelText(/precio anterior/i);
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('(l) typing 89.99 in previous_price shows -44% badge in preview bubble', async () => {
    const user = userEvent.setup();
    const deal = makeDeal({ current_price: 49.99, previous_price: null });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const input = screen.getByLabelText(/precio anterior/i);
    await user.clear(input);
    await user.type(input, '89.99');

    expect(screen.getByText(/\(-44%\)/)).toBeInTheDocument();
  });

  it('(m) discount label shows in right column when previous_price is valid', async () => {
    const user = userEvent.setup();
    const deal = makeDeal({ current_price: 49.99, previous_price: null });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const input = screen.getByLabelText(/precio anterior/i);
    await user.clear(input);
    await user.type(input, '89.99');

    // There should be a read-only label showing the calculated discount
    expect(screen.getByTestId('calculated-discount-label')).toHaveTextContent('44');
  });

  it('(n) Publicar button disabled when previousPrice is null (A2: previous_price is now mandatory)', async () => {
    const deal = makeDeal({ previous_price: null });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const publishBtn = screen.getByRole('button', { name: /publicar/i });
    expect(publishBtn).toBeDisabled();
    expect(publishDealWithEditsFn).not.toHaveBeenCalled();
  });

  it('(o) hashtag with # from deal renders without double # in preview', async () => {
    const deal = makeDeal({ hashtags: ['#ofertazo'] });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    // In the preview bubble, hashtags appear as #tag — '#ofertazo' → state 'ofertazo' → '#ofertazo'
    const hashtagsPreview = screen.getByTestId('telegram-preview-hashtags');
    expect(hashtagsPreview.textContent).toContain('#ofertazo');
    expect(hashtagsPreview.textContent).not.toContain('##ofertazo');
  });

  it('(p) mixed hashtags array (#ofertazo and sony) renders both without double #', async () => {
    const deal = makeDeal({ hashtags: ['#ofertazo', 'sony'] });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const hashtagsPreview = screen.getByTestId('telegram-preview-hashtags');
    expect(hashtagsPreview.textContent).toContain('#ofertazo');
    expect(hashtagsPreview.textContent).toContain('#sony');
    expect(hashtagsPreview.textContent).not.toContain('##');
  });
});

describe('TelegramPreviewDialog — editable title (A1)', () => {
  it('(q) title input is rendered and prefilled with deal.title', () => {
    const deal = makeDeal({ title: 'Auriculares Sony WH-1000XM5' });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const titleInput = screen.getByLabelText(/título/i);
    expect(titleInput).toBeInTheDocument();
    expect((titleInput as HTMLInputElement).value).toBe('Auriculares Sony WH-1000XM5');
  });

  it('(r) editing title updates preview bubble title', async () => {
    const user = userEvent.setup();
    const deal = makeDeal({ title: 'Título original' });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const titleInput = screen.getByLabelText(/título/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Nuevo título editado');

    // Preview bubble should show the updated title
    const previewBubble = screen.getByTestId('telegram-preview-title');
    expect(previewBubble).toHaveTextContent('Nuevo título editado');
  });

  it('(s) submit sends title in publishDealWithEditsFn payload', async () => {
    const user = userEvent.setup();
    publishDealWithEditsFn.mockResolvedValue({});
    const deal = makeDeal({ title: 'Título original', previous_price: 100 });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const titleInput = screen.getByLabelText(/título/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Título editado');

    await user.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(publishDealWithEditsFn).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ title: 'Título editado' }),
        })
      );
    });
  });

  it('(t) empty title disables the Publicar button', async () => {
    const user = userEvent.setup();
    const deal = makeDeal({ title: 'Título original', previous_price: 100 });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const titleInput = screen.getByLabelText(/título/i);
    await user.clear(titleInput);

    const publishBtn = screen.getByRole('button', { name: /publicar/i });
    expect(publishBtn).toBeDisabled();
  });
});

describe('TelegramPreviewDialog — Rechazar button (A4)', () => {
  it('(w) Rechazar button is rendered in left column', () => {
    const deal = makeDeal();
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} onReject={vi.fn()} />);

    expect(screen.getByRole('button', { name: /rechazar/i })).toBeInTheDocument();
  });

  it('(x) clicking Rechazar calls onReject(deal.id)', async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    const onOpenChange = vi.fn();
    const deal = makeDeal({ id: 'deal-1' });
    render(
      <TelegramPreviewDialog deal={deal} open={true} onOpenChange={onOpenChange} onReject={onReject} />
    );

    await user.click(screen.getByRole('button', { name: /rechazar/i }));

    expect(onReject).toHaveBeenCalledWith('deal-1');
  });

  it('(y) clicking Rechazar closes the dialog', async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    const onOpenChange = vi.fn();
    const deal = makeDeal();
    render(
      <TelegramPreviewDialog deal={deal} open={true} onOpenChange={onOpenChange} onReject={onReject} />
    );

    await user.click(screen.getByRole('button', { name: /rechazar/i }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('TelegramPreviewDialog — previous_price mandatory (A2)', () => {
  it('(u) Publicar disabled when previousPrice is 0 (must be positive)', async () => {
    const user = userEvent.setup();
    const deal = makeDeal({ previous_price: null, title: 'Deal válido' });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const priceInput = screen.getByLabelText(/precio anterior/i);
    await user.clear(priceInput);
    await user.type(priceInput, '0');

    const publishBtn = screen.getByRole('button', { name: /publicar/i });
    expect(publishBtn).toBeDisabled();
  });

  it('(v) Publicar enabled when title and previousPrice are both valid', async () => {
    const deal = makeDeal({ previous_price: 100, title: 'Deal con precio' });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const publishBtn = screen.getByRole('button', { name: /publicar/i });
    expect(publishBtn).not.toBeDisabled();
  });
});

describe('TelegramPreviewDialog — "Ver en Amazon" link (A6)', () => {
  it('(z1) renders link "Ver en Amazon" with correct href, target and rel', () => {
    const deal = makeDeal({ original_url: 'https://www.amazon.es/dp/B123456' });
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const link = screen.getByRole('link', { name: /ver en amazon/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.amazon.es/dp/B123456');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('(z2) link contains an icon (svg)', () => {
    const deal = makeDeal();
    render(<TelegramPreviewDialog deal={deal} open={true} onOpenChange={vi.fn()} />);

    const link = screen.getByRole('link', { name: /ver en amazon/i });
    expect(link.querySelector('svg')).not.toBeNull();
  });
});
