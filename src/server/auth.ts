// Server-only auth helpers. Responsible for session hydration and admin
// enforcement for all server fns in this application.
//
// Design §4.3: getSession + requireAdmin live here. getSessionFn is the
// createServerFn wrapper used by __root.tsx beforeLoad.

import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { redirect } from '@tanstack/react-router';
import { getServerClient } from '@everyone-web/libs/supabase-server';
import type { Role, Session } from '@everyone-web/types/session';

// ---------------------------------------------------------------------------
// getSession — reads the cookie-bound client and returns Session | null
// ---------------------------------------------------------------------------

/**
 * Reads the Supabase session from the incoming request cookies.
 * Calls `auth.getUser()` (not `getSession()`) — this revalidates against
 * the Supabase Auth server, ensuring the JWT is still valid.
 *
 * The role is sourced from `public.users.role` (DB-side source of truth),
 * NOT `auth.users.app_metadata.role`. This makes role changes effective
 * on the next request without needing a JWT refresh.
 *
 * Returns `null` for unauthenticated requests.
 */
export async function getSession(request: Request): Promise<Session | null> {
  const client = getServerClient(request);
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) return null;

  const { user } = data;

  // Read profile from public.users. RLS lets each authenticated user read
  // their own row (users_self_select policy).
  const { data: profile } = await client
    .from('users')
    .select('display_name, avatar_url, role')
    .eq('id', user.id)
    .single();

  const role: Role = profile?.role === 'admin' ? 'admin' : 'user';
  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? '';

  return {
    userId: user.id,
    email: user.email ?? '',
    displayName,
    avatarUrl: profile?.avatar_url ?? null,
    role,
  };
}

// ---------------------------------------------------------------------------
// requireAdmin — throws redirect if not authenticated / not admin
// ---------------------------------------------------------------------------

/**
 * Asserts that the incoming request belongs to an authenticated admin.
 *
 * - Anon → throws redirect to `/login?redirect=<current path>`
 * - Authenticated but not admin → throws redirect to `/?error=forbidden`
 * - Admin → returns the Session
 *
 * Use as the FIRST line in every admin `createServerFn` handler.
 */
// ---------------------------------------------------------------------------
// getSessionFn — createServerFn wrapper for __root.tsx beforeLoad
// ---------------------------------------------------------------------------

/**
 * Server fn that reads the session from the incoming request cookies.
 * Called in `__root.tsx` `beforeLoad` to hydrate `context.session`.
 */
export const getSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest();
  return getSession(request);
});

// ---------------------------------------------------------------------------
// requireAdmin — throws redirect if not authenticated / not admin
// ---------------------------------------------------------------------------

export async function requireAdmin(request: Request): Promise<Session> {
  const session = await getSession(request);

  if (!session) {
    const url = new URL(request.url);
    const redirectPath = url.pathname + url.search;
    throw redirect({
      to: '/login',
      search: { redirect: redirectPath },
    });
  }

  if (session.role !== 'admin') {
    throw redirect({
      to: '/',
      search: { error: 'forbidden' },
    });
  }

  return session;
}

/**
 * Server-fn wrapper for `requireAdmin`. Use this from route `beforeLoad`
 * hooks instead of calling `getRequest()` directly — keeps server-only
 * imports out of the client bundle.
 */
export const requireAdminFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest();
  return requireAdmin(request);
});

// ---------------------------------------------------------------------------
// exchangeCodeFn — used by /auth/callback to exchange OAuth/PKCE codes
// ---------------------------------------------------------------------------

/**
 * Exchanges an OAuth or PKCE recovery code for a Supabase session. Lives
 * here (not in the route file) so the route doesn't need to import
 * `@tanstack/react-start/server` or `supabase-server` at module level.
 */
export const exchangeCodeFn = createServerFn({ method: 'GET' })
  .inputValidator((input: { code: string }) => input)
  .handler(async ({ data }) => {
    const request = getRequest();
    const supabase = getServerClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(data.code);
    if (error) {
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const };
  });
