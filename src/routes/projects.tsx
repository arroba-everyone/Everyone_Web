import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { createFileRoute } from '@tanstack/react-router';
import { NutrIA } from '@everyone-web/layouts/Projects/NutrIA';
import { EveryLog } from '@everyone-web/layouts/Projects/EveryLog';

export const Route = createFileRoute('/projects')({
  component: Projects,
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
