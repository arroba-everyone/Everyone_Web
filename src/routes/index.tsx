import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Image, Space } from 'antd';
import styles from '@everyone-web/css/index.module.css';
import movilLanding from '@everyone-web/assets/movilLanding.png';
import movilesSeccion2 from '@everyone-web/assets/movilesSeccion2.png';
import { Title, Text } from '@everyone-web/ui/Common/Typography';
import { Button } from '@everyone-web/ui/Common/Button';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <MainLayout>
      <Flex justify="center">
        <Flex className={styles.landing} justify="space-around" align="center">
          <Flex vertical>
            <Title level={1}>Aquí es donde va una frase pegadiza</Title>
            <Title level={2}>Con su subtítulo correspondiente (o no)</Title>

            <Flex gap={8}>
              <Button type="primary" shape="round" size="large">
                Descubre más
              </Button>
              <Button shape="round" size="large" color="primary" variant="outlined" ghost>
                Contacta con nosotros
              </Button>
            </Flex>
          </Flex>
          <Image src={movilLanding} preview={false} />
        </Flex>
      </Flex>
      <Flex justify="space-between" align="center" style={{ height: '100dvh' }}>
        <Image src={movilesSeccion2} preview={false} />
        <Flex vertical gap={8} style={{ width: '40dvw', marginRight: '100px' }}>
          <Title level={1}>Aquí es donde va una frase pegadiza</Title>
          <Text>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur repellat,
            reiciendis, quidem laborum ducimus eos consectetur, ut itaque repellendus vero
            doloribus! Temporibus ex quis, exercitationem incidunt quam eius corporis perspiciatis!
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur repellat,
            reiciendis, quidem laborum ducimus eos consectetur, ut itaque repellendus vero
            doloribus! Temporibus ex quis, exercitationem incidunt quam eius corporis perspiciatis!
          </Text>
          <Space>
            <Button type="primary" shape="round" size="large" style={{ marginTop: '16px' }}>
              Descubre más
            </Button>
          </Space>
        </Flex>
      </Flex>
    </MainLayout>
  );
}
