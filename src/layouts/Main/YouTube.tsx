import { FALLBACK_VIDEOS, useGetLatestVideos } from '@everyone-web/queries/useGetLatestVideos';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Card } from '@everyone-web/ui/Card/Card';
import { Title } from '@everyone-web/ui/Common/Typography';
import { Button } from '@everyone-web/ui/Common/Button';
import { Space } from 'antd';
import ReactPlayer from 'react-player';

export const YouTube = () => {
  const { data = FALLBACK_VIDEOS } = useGetLatestVideos();

  return (
    <Flex fullScreen align="center" justify="space-around">
      <Card bgColor="var(--color-secondary)" borderRadius={50} width={'97dvw'} height={'97dvh'}>
        <Flex gap={8} justify="center" align="center" style={{ width: '100%', height: '100%' }}>
          <Flex vertical gap={16} style={{ width: '45%' }}>
            <ReactPlayer
              src={`https://www.youtube.com/watch?v=${data[0]}`}
              width={654}
              height={400}
              style={{ borderRadius: '12px', overflow: 'hidden' }}
            />
            <ReactPlayer
              src={`https://www.youtube.com/watch?v=${data[1]}`}
              width={654}
              height={400}
              style={{ borderRadius: '12px', overflow: 'hidden' }}
            />
          </Flex>
          <Flex vertical gap={16} style={{ width: '45%' }}>
            <Title color="var(--color-bg)" level={1} style={{ fontSize: 72 }}>
              Mantente al día con lo que hacemos
            </Title>
            <Title color="var(--color-bg)" level={3}>
              Nos gusta construir, probar, contar y volver a empezar. Si quieres saber en qué
              estamos metidos ahora, este es tu sitio.
            </Title>
            <Space>
              <Button type="primary" shape="round" size="large" className="mt-16">
                Descubre más
              </Button>
            </Space>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};
