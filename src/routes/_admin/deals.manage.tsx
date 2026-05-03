import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';
import { getAllDealsForAdminFn, setDealStatusFn, deleteDealFn } from '@everyone-web/services/deals';
import { DealsTable } from '@everyone-web/components/admin/DealsTable';
import { DealEditDialog } from '@everyone-web/components/admin/DealEditDialog';
import { DeleteConfirmDialog } from '@everyone-web/components/admin/DeleteConfirmDialog';
import type { DealRow } from '@everyone-web/types/supabase';

export const Route = createFileRoute('/_admin/deals/manage')({
  loader: () => (getAllDealsForAdminFn as unknown as () => Promise<DealRow[]>)(),
  component: DealsManagePage,
});

function DealsManagePage() {
  const deals = Route.useLoaderData() as DealRow[];
  const router = useRouter();

  const [editingDeal, setEditingDeal] = useState<DealRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handlePublish = async (id: string) => {
    try {
      await (
        setDealStatusFn as unknown as (input: {
          id: string;
          status: 'published';
        }) => Promise<unknown>
      )({ id, status: 'published' });
      router.invalidate();
    } catch (err) {
      console.error('Error al publicar oferta:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await (
        setDealStatusFn as unknown as (input: {
          id: string;
          status: 'rejected';
        }) => Promise<unknown>
      )({ id, status: 'rejected' });
      router.invalidate();
    } catch (err) {
      console.error('Error al rechazar oferta:', err);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsPending(true);
    try {
      await (deleteDealFn as unknown as (input: { id: string }) => Promise<unknown>)({
        id: deletingId,
      });
      router.invalidate();
      setDeletingId(null);
    } catch (err) {
      console.error('Error al eliminar oferta:', err);
    } finally {
      setIsPending(false);
    }
  };

  const deletingDeal = deletingId ? deals.find(d => d.id === deletingId) : null;

  return (
    <div className="flex flex-col gap-8 tablet-lg:gap-10 laptop:gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl md:text-4xl tablet-lg:text-5xl laptop:text-6xl">
          Gestión de ofertas
        </h1>
        <p className="text-base md:text-lg laptop:text-xl text-foreground/70">
          Aprueba, rechaza y edita las ofertas del canal.
        </p>
      </div>

      <DealsTable
        deals={deals}
        onPublish={handlePublish}
        onReject={handleReject}
        onEdit={setEditingDeal}
        onDelete={setDeletingId}
      />

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
        isPending={isPending}
      />
    </div>
  );
}
