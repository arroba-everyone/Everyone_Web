import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Landing, SecondStep, OurProjects, Chat } from '@everyone-web/layouts/Main/';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <MainLayout>
      <Landing />
      <SecondStep />
      <OurProjects />
      <Chat />
    </MainLayout>
  );
}
