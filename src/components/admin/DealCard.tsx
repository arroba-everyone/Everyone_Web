import { MoreHorizontal, ExternalLink, Check } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from '@everyone-web/ui/card';
import { Badge } from '@everyone-web/ui/badge';
import { Button } from '@everyone-web/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@everyone-web/ui/dropdown-menu';
import { DealImage } from '@everyone-web/components/admin/DealImage';
import { isHistoricalLow } from '@everyone-web/lib/deals/historical-low';
import { cn } from '@everyone-web/libs/utils';
import type { DealRow } from '@everyone-web/types/supabase';

interface DealCardProps {
  deal: DealRow;
  onPublishPreview: (deal: DealRow) => void;
  onReject: (id: string) => void;
  onRestore: (id: string) => void;
  onEdit: (deal: DealRow) => void;
  onDelete: (id: string) => void;
  /** When provided, the card shows a selection checkbox (bulk actions). */
  onToggleSelect?: (id: string) => void;
  selected?: boolean;
}

const STATUS_LABEL: Record<DealRow['status'], string> = {
  pending: 'Pendiente',
  published: 'Publicada',
  rejected: 'Rechazada',
};

const STATUS_BADGE_CLASS: Record<DealRow['status'], string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-500/30',
  published: 'bg-lime-tint text-lime-deep border-lime-deep/30',
  rejected: 'bg-rose-100 text-rose-700 border-rose-500/30',
};

/**
 * Card representation of a single deal with contextual actions per status.
 *
 * - pending  → primary button "Vista previa Telegram" + dropdown [Rechazar, Editar, Eliminar]
 * - published → primary button "Editar" + dropdown [Despublicar, Eliminar]
 * - rejected  → primary button "Restaurar" + dropdown [Editar, Eliminar]
 */
export function DealCard({
  deal,
  onPublishPreview,
  onReject,
  onRestore,
  onEdit,
  onDelete,
  onToggleSelect,
  selected = false,
}: DealCardProps) {
  const historicalLow = isHistoricalLow(deal);
  const foundAtFormatted = deal.found_at
    ? format(new Date(deal.found_at), 'd MMM yyyy', { locale: es })
    : null;

  return (
    <article>
      <Card
        className={cn(
          'overflow-hidden flex flex-col rounded-2xl bg-card border border-foreground/10',
          'hover:border-primary/30 transition-colors h-full',
          selected && 'border-lime-deep ring-2 ring-lime-deep/40'
        )}
      >
        {/* Image section */}
        <div className="relative">
          <DealImage src={deal.image_url} alt={deal.title} />

          {/* Overlaid badges — top-left */}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {onToggleSelect && (
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                aria-label={selected ? 'Quitar de la selección' : 'Seleccionar oferta'}
                onClick={() => onToggleSelect(deal.id)}
                className={cn(
                  'grid place-items-center size-6 rounded-md border-2 transition-colors cursor-pointer',
                  selected
                    ? 'bg-lime border-lime text-ink-solid'
                    : 'bg-white/80 border-foreground/30 hover:border-lime-deep'
                )}
              >
                {selected && <Check className="h-4 w-4" strokeWidth={3} />}
              </button>
            )}
            {deal.discount_percent != null && deal.discount_percent > 0 && (
              <Badge variant="destructive">-{deal.discount_percent}%</Badge>
            )}
            {historicalLow && (
              <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300">
                Mínimo histórico
              </Badge>
            )}
          </div>

          {/* Status badge + Amazon link — top-right */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <Badge className={cn('border', STATUS_BADGE_CLASS[deal.status])}>
              {STATUS_LABEL[deal.status]}
            </Badge>
            <a
              href={deal.original_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver en Amazon"
              onClick={e => e.stopPropagation()}
              className="rounded-md bg-black/40 hover:bg-black/60 p-1 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-white" />
            </a>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <h3 className="line-clamp-2 font-semibold text-sm leading-snug">{deal.title}</h3>

          {/* Price section */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-lime-deep">
              {deal.current_price.toFixed(2)} €
            </span>
            {deal.previous_price != null && (
              <del data-testid="previous-price" className="line-through text-foreground/50 text-sm">
                {deal.previous_price.toFixed(2)} €
              </del>
            )}
          </div>

          {/* Meta */}
          <div className="text-xs text-foreground/60 mt-auto">
            {deal.source}
            {foundAtFormatted ? ` · ${foundAtFormatted}` : null}
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-foreground/10">
            {/* Primary contextual action */}
            {deal.status === 'pending' && (
              <>
                <Button size="sm" className="flex-1 text-xs" onClick={() => onPublishPreview(deal)}>
                  Vista previa Telegram
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="text-xs"
                  onClick={() => onReject(deal.id)}
                >
                  Rechazar
                </Button>
              </>
            )}
            {deal.status === 'published' && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => onEdit(deal)}
              >
                Editar
              </Button>
            )}
            {deal.status === 'rejected' && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => onRestore(deal.id)}
              >
                Restaurar
              </Button>
            )}

            {/* Secondary actions dropdown — hidden for pending (all actions are inside the dialog) */}
            {deal.status !== 'pending' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                    aria-label="Más acciones"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {deal.status === 'published' && (
                    <DropdownMenuItem onClick={() => onRestore(deal.id)}>
                      Despublicar
                    </DropdownMenuItem>
                  )}
                  {deal.status === 'rejected' && (
                    <DropdownMenuItem onClick={() => onEdit(deal)}>Editar</DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(deal.id)}
                  >
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </Card>
    </article>
  );
}
