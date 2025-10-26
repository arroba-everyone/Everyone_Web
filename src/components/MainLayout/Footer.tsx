import { Flex } from '@everyone-web/ui/Common/Flex';
import { Card } from '../../ui/Card/Card';
import { Text, Title } from '@everyone-web/ui/Common/Typography';
import styles from './MainLayout.module.css';
import { Icon } from '@everyone-web/ui/Icon/Icon';

export const Footer = () => {
  return (
    <Card bgColor="var(--color-primary)" borderRadius={70} className={styles.footer}>
      <Flex fullWidth justify="center">
        <Flex vertical gap={50} justify="center" align="center">
          <Title level={3} color="var(--color-bg)">
            @everyone
          </Title>
          <Flex gap={96}>
            <Icon name="instagram" className={styles.socialIcon} />
            <Icon name="youtube" className={styles.socialIcon} />
            <Icon name="twitch" className={styles.socialIcon} />
            <Icon name="github" className={styles.socialIcon} />
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
