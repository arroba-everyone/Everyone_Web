import { useState } from 'react';
import { createFileRoute, useNavigate, useRouter, Link } from '@tanstack/react-router';
import { Button } from '@everyone-web/ui/button';
import {
  getAllPostsForAdminFn,
  setPostStatusFn,
  deletePostFn,
} from '@everyone-web/services/posts';
import { PostsTable } from '@everyone-web/components/admin/PostsTable';
import { DeleteConfirmDialog } from '@everyone-web/components/admin/DeleteConfirmDialog';
import type { Post } from '@everyone-web/types/supabase';

export const Route = createFileRoute('/_admin/blog/manage')({
  loader: () => (getAllPostsForAdminFn as unknown as () => Promise<Post[]>)(),
  component: BlogManagePage,
});

function BlogManagePage() {
  const posts = Route.useLoaderData() as Post[];
  const router = useRouter();
  const navigate = useNavigate();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handlePublish = async (id: string) => {
    try {
      await (
        setPostStatusFn as unknown as (input: {
          data: { id: string; status: 'published' };
        }) => Promise<unknown>
      )({ data: { id, status: 'published' } });
      router.invalidate();
    } catch (err) {
      console.error('Error al publicar post:', err);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await (
        setPostStatusFn as unknown as (input: {
          data: { id: string; status: 'draft' };
        }) => Promise<unknown>
      )({ data: { id, status: 'draft' } });
      router.invalidate();
    } catch (err) {
      console.error('Error al despublicar post:', err);
    }
  };

  const handleEdit = (post: Post) => {
    void navigate({ to: '/blog/edit/$id', params: { id: post.id } });
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsPending(true);
    try {
      await (deletePostFn as unknown as (input: { data: { id: string } }) => Promise<unknown>)({
        data: { id: deletingId },
      });
      router.invalidate();
      setDeletingId(null);
    } catch (err) {
      console.error('Error al eliminar post:', err);
    } finally {
      setIsPending(false);
    }
  };

  const deletingPost = deletingId ? posts.find(p => p.id === deletingId) : null;

  return (
    <div className="flex flex-col gap-8 tablet-lg:gap-10 laptop:gap-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl md:text-4xl tablet-lg:text-5xl laptop:text-6xl">
            Gestión del blog
          </h1>
          <p className="text-base md:text-lg laptop:text-xl text-foreground/70">
            Crea, edita y publica los posts del blog.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="rounded-full transition-all hover:scale-110 cursor-pointer text-base laptop:text-lg"
        >
          <Link to="/blog/new">Crear post</Link>
        </Button>
      </div>

      <PostsTable
        posts={posts}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onEdit={handleEdit}
        onDelete={setDeletingId}
      />

      <DeleteConfirmDialog
        open={deletingId !== null}
        onOpenChange={open => {
          if (!open) setDeletingId(null);
        }}
        title="Eliminar post"
        description={
          deletingPost
            ? `¿Seguro que quieres eliminar "${deletingPost.title}"? Se eliminará también el archivo de Storage.`
            : '¿Seguro que quieres eliminar este post?'
        }
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </div>
  );
}
