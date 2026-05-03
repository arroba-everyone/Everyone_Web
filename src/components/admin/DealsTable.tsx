import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@everyone-web/ui/table';
import { Badge } from '@everyone-web/ui/badge';
import { Card } from '@everyone-web/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@everyone-web/ui/select';
import { Button } from '@everyone-web/ui/button';
import { cn } from '@everyone-web/libs/utils';
import type { DealRow, DealStatus } from '@everyone-web/types/supabase';

type FilterStatus = 'all' | DealStatus;

interface DealsTableProps {
  deals: DealRow[];
  onPublish: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (deal: DealRow) => void;
  onDelete: (id: string) => void;
}

function statusVariant(status: DealStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'published':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'rejected':
      return 'destructive';
  }
}

const statusLabel: Record<DealStatus, string> = {
  pending: 'Pendiente',
  published: 'Publicada',
  rejected: 'Rechazada',
};

const actionButtonClass = 'rounded-full px-4 cursor-pointer transition-all hover:scale-105';

export function DealsTable({ deals, onPublish, onReject, onEdit, onDelete }: DealsTableProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered = filter === 'all' ? deals : deals.filter(d => d.status === filter);

  return (
    <Card
      className={cn(
        'bg-card overflow-hidden',
        'rounded-[2rem] md:rounded-[2.5rem] laptop:rounded-[3rem] xl:rounded-[3.5rem]',
        'p-6 md:p-8 tablet-lg:p-10 laptop:p-12'
      )}
    >
      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-sm tablet-lg:text-base text-foreground/70 font-medium">
          Filtrar por estado
        </span>
        <Select value={filter} onValueChange={v => setFilter(v as FilterStatus)}>
          <SelectTrigger
            className="w-44 rounded-full border-foreground/15 bg-background"
            aria-label="Filtrar por estado"
          >
            <SelectValue>{filter === 'all' ? 'Todas' : statusLabel[filter]}</SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-foreground/15">
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="published">Publicadas</SelectItem>
            <SelectItem value="rejected">Rechazadas</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-foreground/60 ml-auto">
          {filtered.length} / {deals.length}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-foreground/10 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-foreground/[.04] hover:bg-foreground/[.04] border-b border-foreground/10">
              <TableHead className="font-semibold text-foreground">Título</TableHead>
              <TableHead className="font-semibold text-foreground">Estado</TableHead>
              <TableHead className="font-semibold text-foreground">Precio</TableHead>
              <TableHead className="font-semibold text-foreground">Fecha</TableHead>
              <TableHead className="font-semibold text-foreground text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-foreground/60 py-12">
                  No hay ofertas con este filtro.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(deal => (
                <TableRow
                  key={deal.id}
                  className="hover:bg-foreground/[.03] border-b border-foreground/5 last:border-b-0"
                >
                  <TableCell className="font-medium max-w-xs py-4">
                    <span className="line-clamp-2">{deal.title}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant={statusVariant(deal.status)}
                      className="rounded-full px-3 py-1 capitalize"
                    >
                      {statusLabel[deal.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-4 font-semibold">
                    {deal.current_price.toFixed(2)} €
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-foreground/60 text-sm py-4">
                    {deal.published_at
                      ? new Date(deal.published_at).toLocaleDateString('es-ES')
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {deal.status !== 'published' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onPublish(deal.id)}
                          className={actionButtonClass}
                        >
                          Publicar
                        </Button>
                      )}
                      {deal.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReject(deal.id)}
                          className={actionButtonClass}
                        >
                          Rechazar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(deal)}
                        className={actionButtonClass}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(deal.id)}
                        className={actionButtonClass}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
