import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { createFileRoute } from '@tanstack/react-router';
import { NutrIA } from '@everyone-web/layouts/Projects/NutrIA';
import { EveryLog } from '@everyone-web/layouts/Projects/EveryLog';

export const Route = createFileRoute('/projects')({
  component: Projects,
  head: () => ({
    meta: [
      { title: 'Proyectos - @Everyone' },
      {
        name: 'description',
        content:
          'Descubre nuestros proyectos: EveryLog y NutrIA. Apps con propósito, diseño cuidado y tecnología que conecta personas.',
      },
      { property: 'og:title', content: 'Proyectos - @Everyone' },
      {
        property: 'og:description',
        content:
          'Descubre nuestros proyectos: EveryLog y NutrIA. Apps con propósito, diseño cuidado y tecnología que conecta personas.',
      },
      { property: 'og:url', content: 'https://arrobaeveryone.com/projects' },
      { property: 'og:image', content: 'https://arrobaeveryone.com/logo512.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: 'Proyectos - @Everyone' },
      {
        name: 'twitter:description',
        content:
          'Descubre nuestros proyectos: EveryLog y NutrIA. Apps con propósito, diseño cuidado y tecnología que conecta personas.',
      },
      { name: 'twitter:image', content: 'https://arrobaeveryone.com/logo512.png' },
    ],
    links: [{ rel: 'canonical', href: 'https://arrobaeveryone.com/projects' }],
  }),
});

function Projects() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center">
        <EveryLog />
        <NutrIA />
      </div>
    </MainLayout>
  );
}
