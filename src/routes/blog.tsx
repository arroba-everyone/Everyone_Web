import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/blog')({
  component: Blog,
});

function Blog() {
  return <MainLayout></MainLayout>;
}
