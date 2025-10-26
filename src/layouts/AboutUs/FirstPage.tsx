import { Flex } from '@everyone-web/ui/Common/Flex';
import { Image } from 'antd';
import movilesContacto from '@everyone-web/assets/movilesContacto.png';
import { Title } from '@everyone-web/ui/Common/Typography';

export const FirstPage = () => {
  return (
    <Flex fullScreen justify="space-evenly" align="center">
      <Image
        src={movilesContacto}
        alt="Contact Us"
        width={'45dvw'}
        height={'45dvw'}
        preview={false}
      />
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
    </Flex>
  );
};
