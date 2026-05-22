import { PackageOpen } from 'lucide-react';
import { DealCard } from '@everyone-web/components/admin/DealCard';
import type { DealRow } from '@everyone-web/types/supabase';

interface DealsCardGridProps {
  deals: DealRow[];
  onPublishPreview: (deal: DealRow) => void;
  onReject: (id: string) => void;
  onRestore: (id: string) => void;
  onEdit: (deal: DealRow) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

/**
 * Responsive card grid for deals.
 *
 * - Renders a DealCard for each deal in a `auto-fill minmax(270px, 1fr)` grid.
 * - Shows an empty state with PackageOpen icon when there are no deals.
 */
export function DealsCardGrid({
  deals,
  onPublishPreview,
  onReject,
  onRestore,
  onEdit,
  onDelete,
  emptyMessage = 'No hay ofertas en esta categoría',
}: DealsCardGridProps) {
  if (deals.length === 0) {
    return (
      <div
        data-testid="grid-empty-state"
        className="flex flex-col items-center justify-center gap-4 py-16 text-foreground/40"
      >
        <PackageOpen className="h-12 w-12" />
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
      {deals.map(deal => (
        <DealCard
          key={deal.id}
          deal={deal}
          onPublishPreview={onPublishPreview}
          onReject={onReject}
          onRestore={onRestore}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
