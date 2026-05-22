import { createFileRoute } from '@tanstack/react-router';
import { PostEditor } from '@everyone-web/components/admin/PostEditor';

export const Route = createFileRoute('/_admin/blog/new')({
  component: NewPostPage,
});

function NewPostPage() {
  return <PostEditor mode="create" />;
}
