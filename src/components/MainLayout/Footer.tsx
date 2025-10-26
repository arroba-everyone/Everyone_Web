import { Flex } from '@everyone-web/ui/Common/Flex';
import { Card } from '../../ui/Card/Card';
import { Text, Title } from '@everyone-web/ui/Common/Typography';
import {
  GithubOutlined,
  InstagramOutlined,
  TwitchOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import styles from './MainLayout.module.css';

export const Footer = () => {
  return (
    <Card bgColor="var(--color-primary)" borderRadius={70} className={styles.footer}>
      <Flex style={{ width: '100%' }} justify="center">
        <Flex vertical gap={50} justify="center" align="center">
          <Title level={3} color="var(--color-bg)">
            @everyone
          </Title>
          <Flex gap={96}>
            <InstagramOutlined className={styles.socialIcon} />
            <YoutubeOutlined className={styles.socialIcon} />
            <TwitchOutlined className={styles.socialIcon} />
            <GithubOutlined className={styles.socialIcon} />
          </Flex>
          <Flex vertical gap={8} justify="center" align="center">
            <Text color="var(--color-bg)">Política de privacidad</Text>
            <Text color="var(--color-bg)">Uso de cookies</Text>
            <Text strong color="var(--color-bg)">
              @everyone 2025 ©. Todos los derechos reservados
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
