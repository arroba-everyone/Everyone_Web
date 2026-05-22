// OAuth callback route — /auth/callback
//
// Handles:
// 1. OAuth code exchange (Google OAuth flow)
// 2. PKCE recovery code exchange (password reset)
//
// On success: redirects to sanitised `?redirect=` param or `/`.
// On failure: redirects to `/login?error=oauth`.
//
// Note: the actual code exchange lives in `auth.ts` so we don't pull
// `@tanstack/react-start/server` or `supabase-server` into this route module.

import { createFileRoute, redirect } from '@tanstack/react-router';
import { exchangeCodeFn } from '@everyone-web/server/auth';
import { sanitiseRedirect } from '@everyone-web/server/redirect-sanitiser';

type CallbackSearch = {
  code?: string;
  redirect?: string;
  error?: string;
  error_description?: string;
  type?: string;
};

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search: Record<string, unknown>): CallbackSearch => ({
    code: typeof search['code'] === 'string' ? search['code'] : undefined,
    redirect: typeof search['redirect'] === 'string' ? search['redirect'] : undefined,
    error: typeof search['error'] === 'string' ? search['error'] : undefined,
    error_description:
      typeof search['error_description'] === 'string' ? search['error_description'] : undefined,
    type: typeof search['type'] === 'string' ? search['type'] : undefined,
  }),

  loader: async ({ location }) => {
    const search = location.search as CallbackSearch;

    // Provider-side error (user cancelled OAuth, etc.)
    if (search.error) {
      throw redirect({ to: '/login', search: { error: 'oauth' } });
    }

    if (!search.code) {
      throw redirect({ to: '/login', search: { error: 'oauth' } });
    }

    const result = await exchangeCodeFn({ data: { code: search.code } });

    if (!result.ok) {
      throw redirect({ to: '/login', search: { error: 'oauth' } });
    }

    // Password recovery flow: send the user to /auth/reset to set a new password.
    if (search.type === 'recovery') {
      throw redirect({ to: '/auth/reset' });
    }

    const origin = typeof globalThis.location !== 'undefined' ? globalThis.location.origin : '';
    const safe = sanitiseRedirect(search.redirect, origin);
    throw redirect({ to: safe ?? '/' });
  },

  component: () => null,
});
