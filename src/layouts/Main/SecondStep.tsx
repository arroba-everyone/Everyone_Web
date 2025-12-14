import { Button } from '@everyone-web/ui/Common/Button';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Title, Text } from '@everyone-web/ui/Common/Typography';
import { Image, Space } from 'antd';
import movilesSeccion2 from '@everyone-web/assets/movilesSeccion2.png';

export const SecondStep = () => {
  return (
    <Flex fullScreen justify="space-between" align="center">
      <Image src={movilesSeccion2} preview={false} alt="Móviles sección 2" />
      <Flex vertical gap={26} style={{ width: '40dvw', marginRight: '100px' }}>
        <Title level={1}>Creamos tecnología que se siente humana.</Title>
        <Text style={{ fontSize: '26px' }}>
          En @Everyone creemos que la tecnología no tiene por qué ser complicada ni distante.
          Creemos en crear cosas que sumen, que inspiren, que mejoren el día a día sin distraerte
          del mundo real.
        </Text>
        <Text style={{ fontSize: '26px' }}>
          Somos un equipo joven que diseña apps, proyectos y contenido con una idea clara: hacer que
          la innovación se sienta humana, honesta y accesible. Sin tecnicismos. Sin filtros. Sin
          postureo.
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
