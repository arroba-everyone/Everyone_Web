import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { createFileRoute } from '@tanstack/react-router';
import { NutrIA } from '@everyone-web/layouts/Projects/NutrIA';
import { Divider } from 'antd';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { EveryLog } from '@everyone-web/layouts/Projects/EveryLog';

export const Route = createFileRoute('/projects')({
  component: Projects,
});

function Projects() {
  return (
    <MainLayout>
      <Flex vertical align="center">
        <NutrIA />
        <Flex style={{ width: '90dvw' }}>
          <Divider style={{ borderColor: 'var(--color-primary)' }} />
        </Flex>
        <EveryLog />
      </Flex>
    </MainLayout>
  );
}
