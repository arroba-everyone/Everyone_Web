import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/contact')({
  component: Contact,
});

function Contact() {
  return <MainLayout></MainLayout>;
}
