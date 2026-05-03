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
import type { Post, PostStatus } from '@everyone-web/types/supabase';

type FilterStatus = 'all' | PostStatus;

interface PostsTableProps {
  posts: Post[];
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

function statusVariant(status: PostStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'published':
      return 'default';
    case 'draft':
      return 'secondary';
  }
}

const statusLabel: Record<PostStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
};

const actionButtonClass = 'rounded-full px-4 cursor-pointer transition-all hover:scale-105';

export function PostsTable({ posts, onPublish, onUnpublish, onEdit, onDelete }: PostsTableProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter);

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
            <SelectValue>{filter === 'all' ? 'Todos' : statusLabel[filter]}</SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-foreground/15">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-foreground/60 ml-auto">
          {filtered.length} / {posts.length}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-foreground/10 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-foreground/[.04] hover:bg-foreground/[.04] border-b border-foreground/10">
              <TableHead className="font-semibold text-foreground">Título</TableHead>
              <TableHead className="font-semibold text-foreground">Estado</TableHead>
              <TableHead className="font-semibold text-foreground">Fecha</TableHead>
              <TableHead className="font-semibold text-foreground text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-foreground/60 py-12">
                  No hay posts con este filtro.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(post => (
                <TableRow
                  key={post.id}
                  className="hover:bg-foreground/[.03] border-b border-foreground/5 last:border-b-0"
                >
                  <TableCell className="font-medium max-w-xs py-4">
                    <span className="line-clamp-2">{post.title}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant={statusVariant(post.status)}
                      className="rounded-full px-3 py-1 capitalize"
                    >
                      {statusLabel[post.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-foreground/60 text-sm py-4">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('es-ES')
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {post.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onPublish(post.id)}
                          className={actionButtonClass}
                        >
                          Publicar
                        </Button>
                      )}
                      {post.status === 'published' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUnpublish(post.id)}
                          className={actionButtonClass}
                        >
                          Despublicar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(post)}
                        className={actionButtonClass}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(post.id)}
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
