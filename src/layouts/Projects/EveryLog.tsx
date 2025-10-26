import { Flex } from '@everyone-web/ui/Common/Flex';
import { Title, Text } from '@everyone-web/ui/Common/Typography';
import { Image } from 'antd';
import movilLanding from '@everyone-web/assets/movilLanding.png';

export const EveryLog = () => {
  return (
    <Flex fullScreen vertical gap={16} justify="center" align="center">
      <Flex fullWidth align="center" justify="space-evenly">
        <Flex vertical gap={16} style={{ maxWidth: '30dvw' }}>
          <Title level={3}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla natus quia ullam, placeat
            recusandae itaque maxime velit illum. Ut illo blanditiis aperiam nulla expedita omnis
            delectus quo nihil tempora aliquid.
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
          style={{ rotate: '-7.5deg' }}
        />
        <Flex vertical align="center" gap={16} style={{ maxWidth: '30dvw' }}>
          <Title>EveryLog</Title>
          <Title level={3}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci totam, obcaecati
            debitis dicta impedit accusantium magni. Voluptas vero aspernatur cumque iure quam?
            Numquam aliquam a consectetur placeat quos soluta rem?
          </Title>
          <Title level={3}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci totam, obcaecati
            debitis dicta impedit accusantium magni. Voluptas vero aspernatur cumque iure quam?
            Numquam aliquam a consectetur placeat quos soluta rem?
          </Title>
        </Flex>
      </Flex>
    </Flex>
  );
};
