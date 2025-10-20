import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects')({
  component: Projects,
});

function Projects() {
  return <MainLayout></MainLayout>;
}
