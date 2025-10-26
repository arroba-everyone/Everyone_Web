import { Flex } from '@everyone-web/ui/Common/Flex';
import styles from '@everyone-web/css/index.module.css';
import { Title } from '@everyone-web/ui/Common/Typography';
import { Image } from 'antd';
import ordenador from '@everyone-web/assets/ordenador.png';

export const SecondPage = () => {
  return (
    <Flex fullScreen className={styles.landing} justify="space-evenly" align="center">
      <Flex vertical style={{ width: '40dvw' }}>
        <Title style={{ fontSize: 72 }}>Aquí va una frase que sea pegadiza</Title>
        <Title level={3}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta a, aliquid commodi qui
          accusantium reiciendis beatae. Modi recusandae facilis incidunt quas labore sequi
          adipisci, natus culpa, magnam doloremque quisquam nulla!
        </Title>
        <Title level={3}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta a, aliquid commodi qui
          accusantium reiciendis beatae. Modi recusandae facilis incidunt quas labore sequi
          adipisci, natus culpa, magnam doloremque quisquam nulla!
        </Title>
      </Flex>
      <Image src={ordenador} />
    </Flex>
  );
};
