import { Card } from '@everyone-web/ui/Card/Card';
import { Button } from '@everyone-web/ui/Common/Button';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Title } from '@everyone-web/ui/Common/Typography';
import { Space } from 'antd';

export const OurProjects = () => {
  return (
    <Flex justify="center" align="center" gap={50} style={{ height: '100dvh' }}>
      <Card bgColor="var(--color-primary)" borderRadius={70} bodySize={'45dvw'}>
        <Flex style={{ height: '100%', marginLeft: '25px' }} align="end">
          <Title level={1} style={{ color: '#0A0A0A' }}>
            YouTube
          </Title>
        </Flex>
      </Card>
      <Flex vertical gap={50}>
        <Flex gap={50}>
          <Card bgColor="var(--color-secondary)" borderRadius={70} bodySize={'20dvw'}>
            <Flex vertical justify="space-between" style={{ height: '100%' }}>
              <Flex vertical>
                <Title level={4}>Tu chef personal en la palma de tu mano</Title>
              </Flex>
              <Title level={1}>NutrIA</Title>
            </Flex>
          </Card>
          <Card bgColor="var(--color-primary)" borderRadius={70} bodySize={'20dvw'}>
            <Flex vertical justify="space-between" style={{ height: '100%' }}>
              <Flex vertical>
                <Title level={4} style={{ color: '#0A0A0A' }}>
                  Compite con tus amigos en las cosas del día a día
                </Title>
              </Flex>
              <Title level={1} style={{ color: '#0A0A0A' }}>
                EveryLog
              </Title>
            </Flex>
          </Card>
        </Flex>
        <Card borderRadius={70} width={'40dvw'} height={'20dvw'}>
          <Flex vertical justify="space-between" style={{ height: '100%' }}>
            <Flex vertical>
              <Title level={1}>Y ahora...</Title>
              <Title level={2}>Con su correspondiente subtitulo (o no)</Title>
              <Space>
                <Button type="primary" shape="round" size="large" style={{ marginTop: '16px' }}>
                  Descubre más
                </Button>
              </Space>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};
