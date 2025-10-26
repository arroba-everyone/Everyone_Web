import { Flex } from '@everyone-web/ui/Common/Flex';
import { Card } from '../../ui/Card/Card';
import { Text, Title } from '@everyone-web/ui/Common/Typography';
import {
  GithubOutlined,
  InstagramOutlined,
  TwitchOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';

export const Footer = () => {
  return (
    <Card bgColor="var(--color-primary)" borderRadius={70}>
      <Flex style={{ width: '100%' }} justify="center">
        <Flex vertical gap={50} justify="center" align="center">
          <Title level={3} style={{ color: 'var(--color-bg)' }}>
            @everyone
          </Title>
          <Flex gap={96}>
            <InstagramOutlined style={{ fontSize: 32, color: 'var(--color-bg)' }} />
            <YoutubeOutlined style={{ fontSize: 32, color: 'var(--color-bg)' }} />
            <TwitchOutlined style={{ fontSize: 32, color: 'var(--color-bg)' }} />
            <GithubOutlined style={{ fontSize: 32, color: 'var(--color-bg)' }} />
          </Flex>
          <Flex vertical gap={8} justify="center" align="center">
            <Text style={{ color: 'var(--color-bg)' }}>Política de privacidad</Text>
            <Text style={{ color: 'var(--color-bg)' }}>Uso de cookies</Text>
            <Text style={{ color: 'var(--color-bg)', fontWeight: 'bold' }}>
              @everyone 2025 ©. Todos los derechos reservados
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
