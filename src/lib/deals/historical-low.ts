import type { DealRow } from '@everyone-web/types/supabase';

/**
 * Returns true when the current price qualifies as a "historical low".
 *
 * Rules (locked in design §6):
 *  - average_price must be non-null (we use it as the historical reference)
 *  - previous_price must be non-null (we compare current against it)
 *  - current_price <= average_price  (at or below the historical average)
 *  - current_price < previous_price  (actually lower than the previous known price)
 *
 * When a table `deal_price_history` is added in the future, this function
 * will be rewritten to compare against MIN(history). Until then, average_price
 * is the best available approximation.
 */
export function isHistoricalLow(deal: DealRow): boolean {
  if (deal.average_price == null) return false;
  if (deal.previous_price == null) return false;
  return deal.current_price <= deal.average_price && deal.current_price < deal.previous_price;
}
