// Browser auth helpers. All functions return a discriminated union so callers
// don't need try/catch — they pattern-match on `result.ok`.
//
// Design §4.4: signIn/signUp/signOut/signInGoogle/passwordReset live here.
// This module must only be imported in browser code.

import { getBrowserClient } from '@everyone-web/libs/supabase';
import type { Role, Session } from '@everyone-web/types/session';

// ---------------------------------------------------------------------------
// AuthResult discriminated union
// ---------------------------------------------------------------------------

export type AuthResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function mapRole(appMetadata: Record<string, unknown> | undefined): Role {
  return appMetadata?.['role'] === 'admin' ? 'admin' : 'user';
}

function pickString(meta: Record<string, unknown> | undefined, ...keys: string[]): string | null {
  if (!meta) return null;
  for (const k of keys) {
    const v = meta[k];
    if (typeof v === 'string' && v.trim().length > 0) return v.trim();
  }
  return null;
}

function buildSession(user: {
  id: string;
  email?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}): Session {
  const email = user.email ?? '';
  const displayName =
    pickString(user.user_metadata, 'display_name', 'name', 'full_name') ??
    email.split('@')[0] ??
    '';
  const avatarUrl = pickString(user.user_metadata, 'avatar_url', 'picture');
  return {
    userId: user.id,
    email,
    displayName,
    avatarUrl,
    role: mapRole(user.app_metadata),
  };
}

function mapError(err: { code?: string; message?: string } | null): {
  code: string;
  message: string;
} {
  return {
    code: err?.code ?? 'unknown',
    message: err?.message ?? 'Unknown error',
  };
}

// ---------------------------------------------------------------------------
// signInWithPassword
// ---------------------------------------------------------------------------

export async function signInWithPassword(
  email: string,
  password: string
): Promise<AuthResult<{ session: Session }>> {
  const { data, error } = await getBrowserClient().auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { ok: false, error: mapError(error) };
  }

  return {
    ok: true,
    data: {
      session: buildSession({
        id: data.user.id,
        email: data.user.email,
        app_metadata: data.user.app_metadata as Record<string, unknown>,
        user_metadata: data.user.user_metadata as Record<string, unknown>,
      }),
    },
  };
}

// ---------------------------------------------------------------------------
// signUpWithPassword
// ---------------------------------------------------------------------------

export async function signUpWithPassword(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResult<{ session: Session | null }>> {
  const trimmedName = displayName?.trim();
  const { data, error } = await getBrowserClient().auth.signUp({
    email,
    password,
    options: trimmedName ? { data: { display_name: trimmedName } } : undefined,
  });

  if (error) {
    return { ok: false, error: mapError(error) };
  }

  const session =
    data.user != null
      ? buildSession({
          id: data.user.id,
          email: data.user.email,
          app_metadata: data.user.app_metadata as Record<string, unknown>,
          user_metadata: data.user.user_metadata as Record<string, unknown>,
        })
      : null;

  return { ok: true, data: { session } };
}

// ---------------------------------------------------------------------------
// signOut
// ---------------------------------------------------------------------------

export async function signOut(): Promise<AuthResult> {
  const { error } = await getBrowserClient().auth.signOut();
  if (error) return { ok: false, error: mapError(error) };
  return { ok: true, data: undefined };
}

// ---------------------------------------------------------------------------
// signInWithGoogle — OAuth redirect
// ---------------------------------------------------------------------------

export async function signInWithGoogle(redirectAfterLogin?: string): Promise<AuthResult> {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  let redirectTo = `${origin}/auth/callback`;

  if (redirectAfterLogin) {
    const params = new URLSearchParams({ redirect: redirectAfterLogin });
    redirectTo = `${redirectTo}?${params.toString()}`;
  }

  const { error } = await getBrowserClient().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  if (error) return { ok: false, error: mapError(error) };
  return { ok: true, data: undefined };
}

// ---------------------------------------------------------------------------
// requestPasswordReset — sends the reset email
// ---------------------------------------------------------------------------

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const redirectTo = `${origin}/auth/callback`;

  const { error } = await getBrowserClient().auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { ok: false, error: mapError(error) };
  return { ok: true, data: undefined };
}

// ---------------------------------------------------------------------------
// resetPassword — sets the new password (user already has a recovery session)
// ---------------------------------------------------------------------------

export async function resetPassword(newPassword: string): Promise<AuthResult> {
  const { error } = await getBrowserClient().auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: mapError(error) };
  return { ok: true, data: undefined };
}
