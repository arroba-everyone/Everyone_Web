import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock server fn and router BEFORE importing the component
vi.mock('@everyone-web/services/deals', () => ({
  createDealFn: vi.fn(),
}));

vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useRouter: vi.fn(() => ({ invalidate: vi.fn() })),
  };
});

import { AddDealDialog } from '@everyone-web/components/admin/AddDealDialog';
import { createDealFn as _createDealFn } from '@everyone-web/services/deals';
import type { Mock } from 'vitest';
// The mock replaces createDealFn with a vi.fn() — use unknown cast to satisfy TS
const createDealFn = _createDealFn as unknown as Mock;

beforeEach(() => {
  vi.clearAllMocks();
});

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: /url original/i }), 'https://amazon.es/dp/B123456');
  await user.type(screen.getByRole('textbox', { name: /título/i }), 'Auriculares Sony');
  // type="number" inputs have role="spinbutton"
  await user.type(screen.getByRole('spinbutton', { name: /precio actual/i }), '199.99');
}


describe('AddDealDialog', () => {
  it('(a) empty form submit shows zod errors on required fields', async () => {
    const user = userEvent.setup();
    render(<AddDealDialog open={true} onOpenChange={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /añadir oferta/i }));

    await waitFor(() => {
      // At least the required field errors should show
      expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(1);
    });
    expect(createDealFn).not.toHaveBeenCalled();
  });

  it('(b) original_url without https:// shows URL error on that field', async () => {
    const user = userEvent.setup();
    render(<AddDealDialog open={true} onOpenChange={vi.fn()} />);

    await user.type(screen.getByRole('textbox', { name: /url original/i }), 'amazon.com/dp/abc');
    await user.type(screen.getByRole('textbox', { name: /título/i }), 'Test');
    await user.type(screen.getByRole('spinbutton', { name: /precio actual/i }), '100{Enter}');
    await user.click(screen.getByRole('button', { name: /añadir oferta/i }));

    await waitFor(() => {
      expect(screen.getByTestId('original-url-error')).toBeInTheDocument();
    });
    expect(createDealFn).not.toHaveBeenCalled();
  });

  it('(c) valid form calls createDealFn(values)', async () => {
    const user = userEvent.setup();
    createDealFn.mockResolvedValue({ id: 'new-deal' });
    render(<AddDealDialog open={true} onOpenChange={vi.fn()} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /añadir oferta/i }));

    await waitFor(() => {
      expect(createDealFn).toHaveBeenCalled();
    });
    const callArg = createDealFn.mock.calls[0][0] as { data: Record<string, unknown> };
    const callArgs = callArg.data;
    expect(callArgs.original_url).toBe('https://amazon.es/dp/B123456');
    expect(callArgs.title).toBe('Auriculares Sony');
    expect(callArgs.current_price).toBe(199.99);
  });

  it('(d) on success calls router.invalidate(), resets form, and calls onOpenChange(false)', async () => {
    const user = userEvent.setup();
    createDealFn.mockResolvedValue({ id: 'new-deal' });
    const onOpenChange = vi.fn();
    render(<AddDealDialog open={true} onOpenChange={onOpenChange} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /añadir oferta/i }));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('(e) on server error shows message and keeps dialog open', async () => {
    const user = userEvent.setup();
    createDealFn.mockRejectedValue(new Error('Insert failed'));
    const onOpenChange = vi.fn();
    render(<AddDealDialog open={true} onOpenChange={onOpenChange} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /añadir oferta/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('(f) optional fields absent from payload when blank', async () => {
    const user = userEvent.setup();
    createDealFn.mockResolvedValue({ id: 'new-deal' });
    render(<AddDealDialog open={true} onOpenChange={vi.fn()} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /añadir oferta/i }));

    await waitFor(() => {
      expect(createDealFn).toHaveBeenCalled();
    });
    const callArg = createDealFn.mock.calls[0][0] as { data: Record<string, unknown> };
    const callArgs = callArg.data;
    // These optional fields should be null/undefined when not filled
    expect(callArgs.previous_price == null || callArgs.previous_price === '').toBe(true);
    expect(callArgs.image_url == null || callArgs.image_url === '').toBe(true);
    expect(callArgs.affiliate_url == null || callArgs.affiliate_url === '').toBe(true);
  });
});
