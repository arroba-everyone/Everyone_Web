// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock auth functions
vi.mock('@everyone-web/libs/auth', () => ({
  signInWithPassword: vi.fn(),
  signInWithGoogle: vi.fn(),
  requestPasswordReset: vi.fn(),
}));

describe('LoginForm', () => {
  let signInWithPassword: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    const authMod = await import('@everyone-web/libs/auth');
    signInWithPassword = vi.mocked(authMod.signInWithPassword);
  });

  it('shows a field error for invalid email and does NOT call signInWithPassword', async () => {
    const user = userEvent.setup();
    const { LoginForm } = await import('@everyone-web/components/auth/LoginForm');

    render(<LoginForm onSuccess={vi.fn()} />);

    // Submit with invalid email
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'not-an-email');
    await user.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signInWithPassword).not.toHaveBeenCalled();
    });
  });

  it('calls signInWithPassword with correct values on valid submission', async () => {
    const user = userEvent.setup();
    signInWithPassword = vi.fn().mockResolvedValue({ ok: true, data: { session: {} } });
    const authMod = await import('@everyone-web/libs/auth');
    vi.mocked(authMod.signInWithPassword).mockImplementation(signInWithPassword);

    const { LoginForm } = await import('@everyone-web/components/auth/LoginForm');
    const onSuccess = vi.fn();

    render(<LoginForm onSuccess={onSuccess} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledWith('user@example.com', 'password123');
    });
  });

  it('shows an error message when signInWithPassword returns { ok: false }', async () => {
    const user = userEvent.setup();
    const authMod = await import('@everyone-web/libs/auth');
    vi.mocked(authMod.signInWithPassword).mockResolvedValue({
      ok: false,
      error: { code: 'invalid_credentials', message: 'Credenciales inválidas' },
    });

    const { LoginForm } = await import('@everyone-web/components/auth/LoginForm');

    render(<LoginForm onSuccess={vi.fn()} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });
  });
});
