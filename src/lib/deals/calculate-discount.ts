/**
 * Calculates the discount percentage from current and previous prices.
 *
 * Returns `null` when:
 * - Either input is null, undefined, or <= 0
 * - `previous` <= `current` (would yield 0% or negative discount)
 *
 * Otherwise returns `Math.round((1 - current / previous) * 100)`, which is
 * always a positive integer.
 */
export function calculateDiscount(
  current: number | null | undefined,
  previous: number | null | undefined
): number | null {
  if (current == null || previous == null) return null;
  if (current <= 0 || previous <= 0) return null;
  if (previous <= current) return null;
  return Math.round((1 - current / previous) * 100);
}
