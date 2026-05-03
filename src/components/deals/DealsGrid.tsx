import { DealCard } from './DealCard';
import { LockedDealOverlay } from './LockedDealOverlay';
import type { PublicDeal, LockedDeal } from '@everyone-web/services/deals';

interface DealsGridProps {
  deals: PublicDeal[];
  lockedDeal: LockedDeal | null;
}

export function DealsGrid({ deals, lockedDeal }: DealsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {deals.map(deal => (
        <DealCard key={deal.id} deal={deal} />
      ))}

      {lockedDeal && <LockedDealOverlay lockedDeal={lockedDeal} />}
    </div>
  );
}
