import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/aboutUs')({
  component: AboutUs,
});

function AboutUs() {
  return <MainLayout></MainLayout>;
}
