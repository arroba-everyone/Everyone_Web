import { Button } from '@everyone-web/ui/Common/Button';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { useLocation, useNavigate } from '@tanstack/react-router';
import styles from './MainLayout.module.css';

export const Navbar = (): React.JSX.Element => {
  const items = [
    {
      key: '/aboutUs',
      label: 'Sobre nosotros',
    },
    {
      key: '/blog',
      label: 'Blog',
    },
    {
      key: '/',
      label: '@everyone',
    },
    {
      key: '/projects',
      label: 'Proyectos',
    },
    {
      key: '/contact',
      label: 'Contacto',
    },
  ];

  const navigate = useNavigate();

  const onClick = (key: string): void => {
    navigate({ to: key });
  };

  const location = useLocation();

  return (
    <Flex className={styles.menu} justify="space-between" align="center">
      {items.map(({ key, label }) => (
        <Button
          color="primary"
          shape="round"
          className={styles.menuButton}
          type={location.pathname === key ? 'primary' : 'link'}
          key={key}
          onClick={() => onClick(key)}
        >
          {label}
        </Button>
      ))}
    </Flex>
  );
};
