// @vitest-environment jsdom
/**
 * REQ-LOGINFORM-1 — LoginForm must not duplicate react-hook-form's isSubmitting
 *
 * Spec acceptance criterion:
 * - LoginForm.tsx contains no useState for isSubmitting
 * - <Button disabled={...}> reads form.formState.isSubmitting
 * - Submitting behaviour (button disabled during async call, label change) is functionally identical
 *
 * Test strategy:
 * 1. Mock signInWithPassword to return a never-resolving Promise (pending)
 * 2. Submit the form
 * 3. While pending: submit button MUST be disabled and show loading label
 * 4. After resolve: submit button MUST be enabled again and show normal label
 *
 * This test is a BEHAVIORAL assertion — it verifies the spec outcome regardless
 * of implementation detail (useState vs formState.isSubmitting). The code-review
 * verification (no useState present) is separate and confirmed by reading source.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Session } from '@everyone-web/types/session';

vi.mock('@everyone-web/libs/auth', () => ({
  signInWithPassword: vi.fn(),
  signInWithGoogle: vi.fn(),
  requestPasswordReset: vi.fn(),
}));

describe('LoginForm — REQ-LOGINFORM-1: isSubmitting via RHF formState', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('disables the submit button while signInWithPassword is pending', async () => {
    const user = userEvent.setup();
    const authMod = await import('@everyone-web/libs/auth');

    const mockSession: Session = {
      userId: 'user-1',
      email: 'user@example.com',
      displayName: 'User',
      avatarUrl: null,
      role: 'user',
    };

    // Never-resolving promise → keeps the form in submitting state
    let resolveSignIn!: (val: { ok: true; data: { session: Session } }) => void;
    const pendingPromise = new Promise<{ ok: true; data: { session: Session } }>(res => {
      resolveSignIn = res;
    });
    vi.mocked(authMod.signInWithPassword).mockReturnValue(pendingPromise);

    const { LoginForm } = await import('@everyone-web/components/auth/LoginForm');
    render(<LoginForm onSuccess={vi.fn()} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');

    // Submit
    fireEvent.click(submitButton);

    // While pending: button must be disabled
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /iniciando sesión/i })).toBeDisabled();
    });

    // Resolve the promise → button re-enables
    resolveSignIn({ ok: true, data: { session: mockSession } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).not.toBeDisabled();
    });
  });

  it('shows loading label ("Iniciando sesión...") while pending, normal label after resolve', async () => {
    const user = userEvent.setup();
    const authMod = await import('@everyone-web/libs/auth');

    const mockSession2: Session = {
      userId: 'user-2',
      email: 'user2@example.com',
      displayName: 'User2',
      avatarUrl: null,
      role: 'user',
    };

    let resolveSignIn!: (val: { ok: true; data: { session: Session } }) => void;
    const pendingPromise = new Promise<{ ok: true; data: { session: Session } }>(res => {
      resolveSignIn = res;
    });
    vi.mocked(authMod.signInWithPassword).mockReturnValue(pendingPromise);

    const { LoginForm } = await import('@everyone-web/components/auth/LoginForm');
    render(<LoginForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Loading label visible while pending
    await waitFor(() => {
      expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument();
    });

    resolveSignIn({ ok: true, data: { session: mockSession2 } });

    // Back to normal label after resolve
    await waitFor(() => {
      expect(screen.queryByText(/iniciando sesión/i)).toBeNull();
    });
  });
});
