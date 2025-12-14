import { Flex } from '@everyone-web/ui/Common/Flex';
import { Title } from '@everyone-web/ui/Common/Typography';
import { Image, Button } from 'antd';
import styles from '@everyone-web/css/index.module.css';
import movilLanding from '@everyone-web/assets/movilLanding.png';
import { Link } from '@tanstack/react-router';

export const Landing = () => {
  return (
    <Flex fullScreen className={styles.landing} justify="space-around" align="center">
      <Flex vertical>
        <Title level={1}>Innovar no es complicar. Es conectar.</Title>
        <Title level={2} style={{ fontWeight: 'normal', maxWidth: '55dvw' }}>
          En @Everyone hacemos apps y contenido tech para humanos normales. Sin humo. Sin postureo.
          Con mucho corazón.
        </Title>

        <Flex gap={8}>
          <Button type="primary" shape="round" size="large">
            Explorar
          </Button>
          <Link to="/contact">
            <Button shape="round" size="large" color="primary" variant="outlined" ghost>
              Escríbenos
            </Button>
          </Link>
        </Flex>
      </Flex>
      <Image src={movilLanding} preview={false} alt="Móvil landing page" />
    </Flex>
  );
};
