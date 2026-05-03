import { createFileRoute } from '@tanstack/react-router';
import { PostEditor } from '@everyone-web/components/admin/PostEditor';
import {
  getAllPostsForAdminFn,
  getPostMarkdownFn,
} from '@everyone-web/services/posts';
import type { Post } from '@everyone-web/types/supabase';

export const Route = createFileRoute('/_admin/blog/edit/$id')({
  loader: async ({ params }) => {
    // Reuse the admin-list fn (returns ALL posts) and pick the one we want.
    // This avoids a dedicated fetch-by-id server fn.
    const all = (await (getAllPostsForAdminFn as unknown as () => Promise<Post[]>)()) as Post[];
    const post = all.find(p => p.id === params.id);
    if (!post) throw new Error('Post no encontrado');

    const markdown = await (
      getPostMarkdownFn as unknown as (input: { data: string }) => Promise<string>
    )({ data: post.id });

    return { ...post, markdown };
  },
  component: EditPostPage,
});

function EditPostPage() {
  const post = Route.useLoaderData() as Post & { markdown: string };
  return <PostEditor mode="edit" post={post} />;
}
