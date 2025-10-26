import { Card } from '@everyone-web/ui/Card/Card';
import { Button } from '@everyone-web/ui/Common/Button';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Title } from '@everyone-web/ui/Common/Typography';
import { Space } from 'antd';

export const OurProjects = () => {
  return (
    <Flex fullScreen justify="center" align="center" gap={50}>
      <Card bgColor="var(--color-primary)" borderRadius={70} bodySize={'45dvw'}>
        <Flex fullHeight style={{ marginLeft: '25px' }} align="end">
          <Title level={1} color="var(--color-bg)">
            YouTube
          </Title>
        </Flex>
      </Card>
      <Flex vertical gap={50}>
        <Flex gap={50}>
          <Card bgColor="var(--color-secondary)" borderRadius={70} bodySize={'20dvw'}>
            <Flex vertical justify="space-between" style={{ height: '100%' }}>
              <Flex vertical>
                {/* TODO: Hablar con Juan. Cambio de color de texto para aumentar contraste (Opción 2 es cambiar el color morado) */}
                <Title color="var(--color-bg)" level={4}>
                  Tu chef personal en la palma de tu mano
                </Title>
              </Flex>
              <Title color="var(--color-bg)" level={1}>
                NutrIA
              </Title>
            </Flex>
          </Card>
          <Card bgColor="var(--color-primary)" borderRadius={70} bodySize={'20dvw'}>
            <Flex vertical justify="space-between" style={{ height: '100%' }}>
              <Flex vertical>
                <Title level={4} color="var(--color-bg)">
                  Compite con tus amigos en las cosas del día a día
                </Title>
              </Flex>
              <Title level={1} color="var(--color-bg)">
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
                <Button type="primary" shape="round" size="large" className="mt-16">
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
