// SERVER-ONLY module. Do NOT import from browser bundles.
//
// Guard: each exported function throws when invoked in a browser context.
// We deliberately do NOT throw at module load time — TanStack Start's compiler
// transforms `createServerFn` handlers into client-side stubs but does not
// reliably tree-shake top-level imports of server-only modules. A load-time
// throw would fire even though the actual server code never runs in the
// browser. The lazy guard preserves defense-in-depth without breaking dev
// hydration. See design §ADR-4 and REQ-SERVER-CLIENT-1.

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@everyone-web/types/supabase';

// IMPORTANT: never import `@tanstack/react-start/server` at module level here.
// Doing so pulls `@tanstack/start-server-core` into the client bundle via
// esbuild dep pre-bundling, which then fails on the virtual module
// `tanstack-start-injected-head-scripts:v`. We use a dynamic import inside
// the cookie setter so the module is only resolved at server runtime.

function assertServerOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      'supabase.server.ts must NEVER execute in the browser. ' +
        'A server-only function was called from client code. See REQ-SERVER-CLIENT-1.'
    );
  }
}

const supabaseUrl = typeof process !== 'undefined' ? (process.env['VITE_SUPABASE_URL'] ?? '') : '';
const supabaseAnonKey =
  typeof process !== 'undefined' ? (process.env['VITE_SUPABASE_ANON_KEY'] ?? '') : '';

/**
 * Cookie-bound Supabase client. RLS is applied (uses the anon key + the
 * session cookies from the incoming Request). Use this for all server-side
 * reads and for any operation that should respect RLS.
 */
export function getServerClient(request: Request): SupabaseClient<Database> {
  assertServerOnly();
  const cookieHeader = request.headers.get('cookie') ?? '';

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookies(cookieHeader);
      },
      async setAll(cookiesToSet) {
        // Persist session cookies to the response. REQUIRED for OAuth code
        // exchange (PKCE flow): @supabase/ssr emits the auth cookies via this
        // callback when /auth/callback calls `exchangeCodeForSession`, and
        // they MUST land in Set-Cookie response headers for the browser to
        // keep the session. We dynamic-import @tanstack/react-start/server so
        // it doesn't end up in the client bundle.
        const { setCookie } = await import('@tanstack/react-start/server');
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, options);
        }
      },
    },
  });
}

/**
 * Service-role Supabase client. RLS is bypassed. ONLY use this from
 * `createServerFn` handlers that have already called `requireAdmin(request)`.
 * Never use this for reads that should be RLS-filtered.
 *
 * Reads key from `process.env.SUPABASE_SERVICE_ROLE_KEY` (never VITE_).
 * See REQ-SERVER-CLIENT-2 / design §ADR-4.
 */
export function getServiceClient(): SupabaseClient<Database> {
  assertServerOnly();
  const serviceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in the server environment.');
  }
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface ParsedCookie {
  name: string;
  value: string;
}

function parseCookies(cookieHeader: string): ParsedCookie[] {
  if (!cookieHeader) return [];
  return cookieHeader.split(';').reduce<ParsedCookie[]>((acc, pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return acc;
    const name = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (name) acc.push({ name, value });
    return acc;
  }, []);
}
