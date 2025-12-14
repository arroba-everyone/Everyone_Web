import { Flex } from '@everyone-web/ui/Common/Flex';
import { Title, Text } from '@everyone-web/ui/Common/Typography';
import { Image } from 'antd';
import movilLanding from '@everyone-web/assets/movilLanding.png';

export const EveryLog = () => {
  return (
    <Flex fullScreen vertical gap={16} justify="center" align="center">
      <Flex fullWidth align="center" justify="space-evenly">
        <Flex vertical align="center" gap={16} style={{ maxWidth: '33dvw' }}>
          <Title>EveryLog</Title>
          <Title level={3}>
            Hay cosas que hacemos todos los días sin pensarlo 📱: un paseo, una tarea, un logro
            pequeño. Everilog las convierte en algo más, en una forma nueva de mirar lo cotidiano.
          </Title>
          <Title level={3}>
            No se trata de ganar, sino de compartir 💬. De disfrutar del progreso, de celebrar cada
            paso y descubrir que competir también puede ser sano, divertido y hasta motivador.
          </Title>
        </Flex>
        <Image
          src={movilLanding}
          width={530}
          height={869}
          preview={false}
          alt="Móvil landing page"
          style={{ rotate: '-7.5deg' }}
        />
        <Flex vertical gap={16} style={{ maxWidth: '30dvw' }}>
          <Title level={3}>
            Porque al final, las pequeñas cosas también cuentan. Y con Everylog, contarlas puede ser
            parte del juego. 🎯
          </Title>
          <Text>Disponible en</Text>
          <Flex gap={16}>
            <Image
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              width={150}
              preview={false}
              alt="Download on the App Store"
            />
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              width={150}
              preview={false}
              alt="Get it on Google Play"
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
