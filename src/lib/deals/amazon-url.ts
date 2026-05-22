/**
 * Amazon shortener hostnames authorised by policy.
 * Case-insensitive comparison is handled by normalising to lowercase.
 */
const AMAZON_SHORTENERS = new Set(['amzn.to', 'a.co', 'amzn.eu']);

/**
 * Regex matching official amazon.<tld> or amazon.<tld>.<tld2> domains.
 * Accepts both www. and bare forms. Case-insensitive.
 */
const AMAZON_DOMAIN_REGEX = /^(www\.)?amazon\.[a-z]{2,}(\.[a-z]{2,})?$/i;

/**
 * Returns true when `url` points to an official Amazon domain (amazon.*) or
 * one of the three authorised shorteners (amzn.to, a.co, amzn.eu).
 *
 * Returns false for invalid URLs or any other host.
 */
export function isAmazonUrl(url: string): boolean {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    const host = hostname.toLowerCase();
    return AMAZON_DOMAIN_REGEX.test(host) || AMAZON_SHORTENERS.has(host);
  } catch {
    return false;
  }
}
