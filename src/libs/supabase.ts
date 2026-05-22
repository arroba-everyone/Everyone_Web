// Browser-only Supabase client.
//
// Uses @supabase/ssr's createBrowserClient so that cookie-based auth sessions
// (set by the server on /auth/callback) are automatically included in all
// requests made from the browser.
//
// getBrowserClient() is a singleton: createBrowserClient is called at most once
// per module lifecycle, so multiple callers share the same client instance and
// avoid redundant initialisation.

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@everyone-web/types/supabase';

let _client: SupabaseClient<Database> | null = null;

/**
 * Returns the singleton browser Supabase client.
 * Reads credentials from Vite env vars (public, VITE_ prefix).
 */
export function getBrowserClient(): SupabaseClient<Database> {
  if (_client) return _client;

  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  _client = createBrowserClient<Database>(url, anonKey);
  return _client;
}
