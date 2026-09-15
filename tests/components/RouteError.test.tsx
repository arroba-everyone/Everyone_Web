import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouteError } from '@everyone-web/components/RouteError/RouteError';

describe('RouteError', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderError(error = new Error('boom')) {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    return render(<RouteError error={error} reset={vi.fn()} />);
  }

  it('shows a branded message instead of the TanStack default screen', () => {
    renderError();
    expect(
      screen.getByRole('heading', { name: 'Algo ha fallado al cargar la página' })
    ).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });

  it('does not expose the technical error message to visitors', () => {
    renderError(new Error('SUPABASE_SERVICE_ROLE_KEY missing'));
    expect(screen.queryByText(/SUPABASE_SERVICE_ROLE_KEY/)).not.toBeInTheDocument();
  });

  it('logs the error so it can be investigated', () => {
    const error = new Error('boom');
    renderError(error);
    expect(console.error).toHaveBeenCalledWith('[RouteError] Error al cargar la ruta:', error);
  });

  it('reloads the whole page when retrying', async () => {
    const reload = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({ ...window.location, reload });
    renderError();

    await userEvent.click(screen.getByRole('button', { name: 'Volver a intentarlo' }));
    expect(reload).toHaveBeenCalledOnce();
  });

  it('offers plain links home and to the contact email', () => {
    renderError();
    expect(screen.getByRole('link', { name: 'Ir al inicio' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'contacto@arrobaeveryone.com' })).toHaveAttribute(
      'href',
      'mailto:contacto@arrobaeveryone.com'
    );
  });
});
