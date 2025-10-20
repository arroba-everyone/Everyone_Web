import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Image } from 'antd';
import styles from '@everyone-web/css/index.module.css';
import movilLanding from '@everyone-web/assets/movilLanding.png';
import { Title } from '@everyone-web/ui/Common/Typography/Title';
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
    </MainLayout>
  );
}
