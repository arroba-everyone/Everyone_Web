import { useRouteContext } from '@tanstack/react-router';
import type { Session } from '@everyone-web/types/session';

/**
 * Returns the current session from the router context.
 *
 * The session is hydrated server-side in `__root.tsx` `beforeLoad` via
 * `getSessionFn()`. After login/logout, call `router.invalidate()` to
 * re-run beforeLoad and refresh the context.
 *
 * Returns `null` for unauthenticated visitors.
 */
export function useSession(): Session | null {
  const ctx = useRouteContext({ from: '__root__' });
  return ctx.session ?? null;
}
