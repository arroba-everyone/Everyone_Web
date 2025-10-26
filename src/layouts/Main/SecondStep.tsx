import { Button } from '@everyone-web/ui/Common/Button';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Title, Text } from '@everyone-web/ui/Common/Typography';
import { Image, Space } from 'antd';
import movilesSeccion2 from '@everyone-web/assets/movilesSeccion2.png';

export const SecondStep = () => {
  return (
    <Flex fullScreen justify="space-between" align="center">
      <Image src={movilesSeccion2} preview={false} alt="Móviles sección 2" />
      <Flex vertical gap={8} style={{ width: '40dvw', marginRight: '100px' }}>
        <Title level={1}>Aquí es donde va una frase pegadiza</Title>
        <Text>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur repellat, reiciendis,
          quidem laborum ducimus eos consectetur, ut itaque repellendus vero doloribus! Temporibus
          ex quis, exercitationem incidunt quam eius corporis perspiciatis!
        </Text>
        <Text>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur repellat, reiciendis,
          quidem laborum ducimus eos consectetur, ut itaque repellendus vero doloribus! Temporibus
          ex quis, exercitationem incidunt quam eius corporis perspiciatis!
        </Text>
        <Space>
          <Button type="primary" shape="round" size="large" className="mt-16">
            Descubre más
          </Button>
        </Space>
      </Flex>
    </Flex>
  );
};
