import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';
import { getAllDealsForAdminFn, setDealStatusFn, deleteDealFn } from '@everyone-web/services/deals';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@everyone-web/ui/tabs';
import { Button } from '@everyone-web/ui/button';
import { DealStatsBar } from '@everyone-web/components/admin/DealStatsBar';
import { DealsCardGrid } from '@everyone-web/components/admin/DealsCardGrid';
import { TelegramPreviewDialog } from '@everyone-web/components/admin/TelegramPreviewDialog';
import { AddDealDialog } from '@everyone-web/components/admin/AddDealDialog';
import { DealEditDialog } from '@everyone-web/components/admin/DealEditDialog';
import { DeleteConfirmDialog } from '@everyone-web/components/admin/DeleteConfirmDialog';
import type { DealRow } from '@everyone-web/types/supabase';

export const Route = createFileRoute('/_admin/deals/manage')({
  loader: () => (getAllDealsForAdminFn as unknown as () => Promise<DealRow[]>)(),
  component: DealsManagePageWrapper,
});

function DealsManagePageWrapper() {
  const deals = Route.useLoaderData() as DealRow[];
  return <DealsManagePage deals={deals} />;
}

// Exported separately so it can be unit-tested with injected deals
export function DealsManagePage({ deals }: { deals: DealRow[] }) {
  const router = useRouter();

  // Dialog state
  const [editingDeal, setEditingDeal] = useState<DealRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewingDeal, setPreviewingDeal] = useState<DealRow | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Split deals by status
  const byStatus = useMemo(
    () => ({
      pending: deals.filter(d => d.status === 'pending'),
      published: deals.filter(d => d.status === 'published'),
      rejected: deals.filter(d => d.status === 'rejected'),
    }),
    [deals]
  );

  const counts = {
    pending: byStatus.pending.length,
    published: byStatus.published.length,
    rejected: byStatus.rejected.length,
  };

  // Handlers
  const handleReject = async (id: string) => {
    try {
      await setDealStatusFn({ data: { id, status: 'rejected' } });
      router.invalidate();
    } catch (err) {
      console.error('Error al rechazar oferta:', err);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await setDealStatusFn({ data: { id, status: 'pending' } });
      router.invalidate();
    } catch (err) {
      console.error('Error al restaurar oferta:', err);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await setDealStatusFn({ data: { id, status: 'pending' } });
      router.invalidate();
    } catch (err) {
      console.error('Error al despublicar oferta:', err);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteDealFn({ data: { id: deletingId } });
      router.invalidate();
      setDeletingId(null);
    } catch (err) {
      console.error('Error al eliminar oferta:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const deletingDeal = deletingId ? deals.find(d => d.id === deletingId) : null;

  const sharedCallbacks = {
    onEdit: setEditingDeal,
    onDelete: setDeletingId,
    onReject: handleReject,
    onRestore: handleUnpublish, // published → pending (Despublicar)
    onPublishPreview: setPreviewingDeal,
  };

  return (
    <div className="flex flex-col gap-8 tablet-lg:gap-10 laptop:gap-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl md:text-4xl tablet-lg:text-5xl laptop:text-6xl">
          Gestión de ofertas
        </h1>
        <p className="text-base md:text-lg laptop:text-xl text-foreground/70">
          Aprueba, rechaza y edita las ofertas del canal.
        </p>
      </div>

      {/* Stats bar */}
      <DealStatsBar counts={counts} />

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Ofertas</h2>
        <Button onClick={() => setAddOpen(true)}>Añadir oferta</Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList className="max-md:!flex-col max-md:!w-full max-md:!h-auto max-md:!bg-transparent max-md:!border-0 max-md:!p-0 max-md:gap-1.5">
          <TabsTrigger value="pending" className="w-full md:w-auto">
            Pendientes ({counts.pending})
          </TabsTrigger>
          <TabsTrigger value="published" className="w-full md:w-auto">
            Publicadas ({counts.published})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="w-full md:w-auto">
            Rechazadas ({counts.rejected})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <DealsCardGrid
            deals={byStatus.pending}
            emptyMessage="No hay ofertas pendientes de revisión"
            {...sharedCallbacks}
            onRestore={handleRestore}
          />
        </TabsContent>

        <TabsContent value="published" className="mt-4">
          <DealsCardGrid
            deals={byStatus.published}
            emptyMessage="No hay ofertas publicadas todavía"
            {...sharedCallbacks}
            onRestore={handleRestore}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <DealsCardGrid
            deals={byStatus.rejected}
            emptyMessage="No hay ofertas rechazadas"
            {...sharedCallbacks}
            onRestore={handleRestore}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <TelegramPreviewDialog
        deal={previewingDeal}
        open={previewingDeal !== null}
        onOpenChange={open => {
          if (!open) setPreviewingDeal(null);
        }}
        onReject={handleReject}
      />

      <AddDealDialog open={addOpen} onOpenChange={setAddOpen} />

      <DealEditDialog
        deal={editingDeal}
        open={editingDeal !== null}
        onOpenChange={open => {
          if (!open) setEditingDeal(null);
        }}
      />

      <DeleteConfirmDialog
        open={deletingId !== null}
        onOpenChange={open => {
          if (!open) setDeletingId(null);
        }}
        title="Eliminar oferta"
        description={
          deletingDeal
            ? `¿Seguro que quieres eliminar "${deletingDeal.title}"? Esta acción no se puede deshacer.`
            : '¿Seguro que quieres eliminar esta oferta? Esta acción no se puede deshacer.'
        }
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
}
