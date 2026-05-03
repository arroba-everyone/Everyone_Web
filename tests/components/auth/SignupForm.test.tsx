// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock auth functions
vi.mock('@everyone-web/libs/auth', () => ({
  signUpWithPassword: vi.fn(),
  signInWithGoogle: vi.fn(),
}));

describe('SignupForm', () => {
  let signUpWithPassword: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const authMod = await import('@everyone-web/libs/auth');
    signUpWithPassword = vi.mocked(authMod.signUpWithPassword);
  });

  it('shows a validation error for passwords shorter than 8 characters', async () => {
    const user = userEvent.setup();
    const { SignupForm } = await import('@everyone-web/components/auth/SignupForm');

    render(<SignupForm onSuccess={vi.fn()} onEmailConfirmationRequired={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'short');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'short');
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(signUpWithPassword).not.toHaveBeenCalled();
    });
  });

  it('calls signUpWithPassword with correct values on valid input', async () => {
    const user = userEvent.setup();
    const authMod = await import('@everyone-web/libs/auth');
    vi.mocked(authMod.signUpWithPassword).mockResolvedValue({
      ok: true,
      data: { session: { userId: 'u1', email: 'user@example.com', displayName: 'User', avatarUrl: null, role: 'user' } },
    });

    const { SignupForm } = await import('@everyone-web/components/auth/SignupForm');
    const onSuccess = vi.fn();

    render(<SignupForm onSuccess={onSuccess} onEmailConfirmationRequired={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'password123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      // Third arg is the optional displayName — empty when the user leaves it blank.
      expect(signUpWithPassword).toHaveBeenCalledWith('user@example.com', 'password123', '');
    });
  });

  it('shows an error message when Supabase returns "email already in use" error', async () => {
    const user = userEvent.setup();
    const authMod = await import('@everyone-web/libs/auth');
    vi.mocked(authMod.signUpWithPassword).mockResolvedValue({
      ok: false,
      error: { code: 'email_exists', message: 'El email ya está registrado' },
    });

    const { SignupForm } = await import('@everyone-web/components/auth/SignupForm');

    render(<SignupForm onSuccess={vi.fn()} onEmailConfirmationRequired={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'password123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText(/email ya está registrado/i)).toBeInTheDocument();
    });
  });
});
