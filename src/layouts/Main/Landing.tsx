import { Flex } from '@everyone-web/ui/Common/Flex';
import { Title } from '@everyone-web/ui/Common/Typography';
import { Image, Button } from 'antd';
import styles from '@everyone-web/css/index.module.css';
import movilLanding from '@everyone-web/assets/movilLanding.png';

export const Landing = () => {
  return (
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
  );
};
