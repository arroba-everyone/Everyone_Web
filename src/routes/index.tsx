import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Landing, SecondStep, OurProjects, Chat } from '@everyone-web/layouts/Main/';
import { YouTube } from '@everyone-web/layouts/Main/YouTube';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  // TODO: Convertir imágenes a WebP
  return (
    <MainLayout>
      <Landing />
      <SecondStep />
      <OurProjects />
      <Chat />
      <YouTube />
    </MainLayout>
  );
}
