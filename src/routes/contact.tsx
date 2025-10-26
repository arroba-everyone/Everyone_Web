import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Card } from '@everyone-web/ui/Card/Card';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { createFileRoute } from '@tanstack/react-router';
import { Avatar, Image } from 'antd';
import movilesContacto from '@everyone-web/assets/movilesContacto.png';
import { Title } from '@everyone-web/ui/Common/Typography';

export const Route = createFileRoute('/contact')({
  component: Contact,
});

function Contact() {
  return (
    <MainLayout>
      <Flex fullScreen justify="space-evenly" style={{ paddingTop: '11dvh' }}>
        <Card bgColor="var(--color-primary)" borderRadius={70}>
          <Image
            src={movilesContacto}
            alt="Contact Us"
            width={'45dvw'}
            height={'45dvw'}
            preview={false}
          />
        </Card>
        <Flex vertical gap={48}>
          <Card bgColor="var(--color-secondary)" borderRadius={50}>
            <Flex style={{ width: '45dvw' }} justify="center">
              <Title style={{ fontSize: 60 }}>contacto@everyone.com</Title>
            </Flex>
          </Card>
          <Flex gap={32}>
            <Avatar size={100} shape="square" />
            <Avatar size={100} shape="square" />
            <Avatar size={100} shape="square" />
          </Flex>
        </Flex>
      </Flex>
    </MainLayout>
  );
}
