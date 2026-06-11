import { useMemo, useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Archive, Mail, RotateCcw, Trash2 } from 'lucide-react';
import {
  getContactRequestsFn,
  setContactRequestStatusFn,
  deleteContactRequestFn,
} from '@everyone-web/services/contact';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@everyone-web/ui/tabs';
import { Button } from '@everyone-web/ui/button';
import { Badge } from '@everyone-web/ui/badge';
import { DeleteConfirmDialog } from '@everyone-web/components/admin/DeleteConfirmDialog';
import { PROJECT_TYPES } from '@everyone-web/lib/validators/contact';
import { cn } from '@everyone-web/libs/utils';
import type { ContactRequestRow, ContactRequestStatus } from '@everyone-web/types/supabase';

export const Route = createFileRoute('/_admin/contacts/manage')({
  loader: () => (getContactRequestsFn as unknown as () => Promise<ContactRequestRow[]>)(),
  component: ContactsManagePageWrapper,
});

function ContactsManagePageWrapper() {
  const requests = Route.useLoaderData() as ContactRequestRow[];
  return <ContactsManagePage requests={requests} />;
}

const PROJECT_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  PROJECT_TYPES.map(t => [t.value, t.label])
);

function RequestCard({
  request,
  onSetStatus,
  onDelete,
}: {
  request: ContactRequestRow;
  onSetStatus: (id: string, status: ContactRequestStatus) => void;
  onDelete: (id: string) => void;
}) {
  const createdAt = format(new Date(request.created_at), "d MMM yyyy 'a las' HH:mm", {
    locale: es,
  });

  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-2xl bg-card ring-1 ring-ink/8 p-6',
        'transition-shadow hover:shadow-lg hover:shadow-ink/5'
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-lg text-ink">{request.name}</h3>
            {request.company && <span className="text-sm text-ink-soft">· {request.company}</span>}
          </div>
          <a
            href={`mailto:${request.email}`}
            className="text-sm font-semibold text-lime-deep hover:underline"
          >
            {request.email}
          </a>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge className="bg-grape-tint text-grape-deep border border-grape-deep/20">
            {PROJECT_TYPE_LABEL[request.project_type] ?? request.project_type}
          </Badge>
          <span className="text-xs text-ink-soft/70">{createdAt}</span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-ink/80 whitespace-pre-wrap">{request.message}</p>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ink/8">
        <Button asChild size="sm" className="text-xs">
          <a
            href={`mailto:${request.email}?subject=${encodeURIComponent('Tu proyecto con @everyone')}`}
          >
            <Mail className="size-3.5" />
            Responder
          </a>
        </Button>

        {request.status !== 'replied' && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => onSetStatus(request.id, 'replied')}
          >
            Marcar respondida
          </Button>
        )}
        {request.status !== 'archived' ? (
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => onSetStatus(request.id, 'archived')}
          >
            <Archive className="size-3.5" />
            Archivar
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => onSetStatus(request.id, 'new')}
          >
            <RotateCcw className="size-3.5" />
            Recuperar
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="text-xs text-destructive hover:text-destructive ml-auto"
          onClick={() => onDelete(request.id)}
        >
          <Trash2 className="size-3.5" />
          Eliminar
        </Button>
      </div>
    </article>
  );
}

function RequestList({
  requests,
  emptyMessage,
  onSetStatus,
  onDelete,
}: {
  requests: ContactRequestRow[];
  emptyMessage: string;
  onSetStatus: (id: string, status: ContactRequestStatus) => void;
  onDelete: (id: string) => void;
}) {
  if (requests.length === 0) {
    return <p className="text-ink-soft text-sm py-8 text-center">{emptyMessage}</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      {requests.map(request => (
        <RequestCard
          key={request.id}
          request={request}
          onSetStatus={onSetStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// Exported separately so it can be unit-tested with injected requests
export function ContactsManagePage({ requests }: { requests: ContactRequestRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const byStatus = useMemo(
    () => ({
      new: requests.filter(r => r.status === 'new'),
      replied: requests.filter(r => r.status === 'replied'),
      archived: requests.filter(r => r.status === 'archived'),
    }),
    [requests]
  );

  const handleSetStatus = async (id: string, status: ContactRequestStatus) => {
    try {
      await setContactRequestStatusFn({ data: { id, status } });
      router.invalidate();
    } catch (err) {
      console.error('Error al actualizar la solicitud:', err);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteContactRequestFn({ data: { id: deletingId } });
      router.invalidate();
      setDeletingId(null);
    } catch (err) {
      console.error('Error al eliminar la solicitud:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl md:text-4xl tablet-lg:text-5xl">
          Solicitudes de contacto
        </h1>
        <p className="text-base md:text-lg text-ink-soft">
          Lo que llega desde el formulario de la web. Responde, marca y archiva.
        </p>
      </div>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">Nuevas ({byStatus.new.length})</TabsTrigger>
          <TabsTrigger value="replied">Respondidas ({byStatus.replied.length})</TabsTrigger>
          <TabsTrigger value="archived">Archivadas ({byStatus.archived.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-4">
          <RequestList
            requests={byStatus.new}
            emptyMessage="No hay solicitudes nuevas. ¡A por ellas!"
            onSetStatus={handleSetStatus}
            onDelete={setDeletingId}
          />
        </TabsContent>
        <TabsContent value="replied" className="mt-4">
          <RequestList
            requests={byStatus.replied}
            emptyMessage="Todavía no has marcado ninguna como respondida"
            onSetStatus={handleSetStatus}
            onDelete={setDeletingId}
          />
        </TabsContent>
        <TabsContent value="archived" className="mt-4">
          <RequestList
            requests={byStatus.archived}
            emptyMessage="Nada archivado por aquí"
            onSetStatus={handleSetStatus}
            onDelete={setDeletingId}
          />
        </TabsContent>
      </Tabs>

      <DeleteConfirmDialog
        open={deletingId !== null}
        onOpenChange={open => {
          if (!open) setDeletingId(null);
        }}
        title="Eliminar solicitud"
        description="¿Seguro que quieres eliminar esta solicitud de contacto? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
}
