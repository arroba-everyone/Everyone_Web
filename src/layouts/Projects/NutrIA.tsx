import { Flex } from '@everyone-web/ui/Common/Flex';
import { Text, Title } from '@everyone-web/ui/Common/Typography';
import { Image } from 'antd';
import movilLanding from '@everyone-web/assets/movilLanding.png';

export const NutrIA = () => {
  return (
    <Flex fullScreen vertical gap={16} justify="center" align="center">
      <Flex fullWidth align="center" justify="space-evenly">
        <Flex vertical gap={16} style={{ maxWidth: '30dvw' }}>
          <Title level={3}>
            Por ahora solo diremos esto 🦦: el nombre no es casualidad. Y si te intriga… es buena
            señal.
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
        <Image
          src={movilLanding}
          width={530}
          height={869}
          preview={false}
          alt="Móvil landing page"
          style={{ rotate: '7.5deg' }}
        />
        <Flex vertical align="center" gap={16} style={{ maxWidth: '30dvw' }}>
          <Title>NutrIA</Title>
          <Title level={3}>
            Estamos trabajando en algo nuevo 💡. Algo pequeño por fuera, pero con mucho detrás. Un
            proyecto que mezcla calma, curiosidad y tecnología con propósito.
          </Title>
          <Title level={3}>
            Aún no podemos contarte de qué va 🤫 (y créenos, nos cuesta guardar el secreto). Pero sí
            podemos decir que va de conectar, de simplificar y de disfrutar más, no de hacer más.
          </Title>
        </Flex>
      </Flex>
    </Flex>
  );
};
