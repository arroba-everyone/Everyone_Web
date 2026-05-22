/**
 * Sanitises a `?redirect=` URL parameter before using it as a navigation target.
 *
 * Rules:
 * - Returns `null` for null-ish, empty, or invalid input.
 * - Returns `null` for protocol-relative URLs (`//foo.com`) — these are not
 *   safe because they can point to external origins.
 * - Returns `null` for any URL whose origin differs from the provided `origin`.
 * - For path-only strings (starting with `/` but NOT `//`), returns the path
 *   as-is — they are implicitly same-origin.
 *
 * @param url    The raw value from the `?redirect=` query parameter.
 * @param origin The trusted origin (e.g. `https://example.com`).
 */
export function sanitiseRedirect(url: string | undefined, origin: string): string | null {
  if (!url) return null;

  // Reject protocol-relative URLs (e.g. //evil.com)
  if (url.startsWith('//')) return null;

  // Path-only URLs (start with / but not //) are safe — they are same-origin
  if (url.startsWith('/')) {
    return url;
  }

  // For absolute URLs, compare origins
  try {
    const parsed = new URL(url);
    const trusted = new URL(origin);
    if (parsed.origin !== trusted.origin) return null;
    // Return path + search + hash (omit origin)
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    // Unparseable as an absolute URL — not a known-safe path
    return null;
  }
}
