import type { IBaseComponent } from '@everyone-web/types/global';
import { Layout } from 'antd';
import styles from './MainLayout.module.css';
import { Navbar } from './Navbar';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Footer } from './Footer';

export const MainLayout: IBaseComponent = ({ children }) => {
  const { Header, Content, Footer: LayoutFooter } = Layout;

  // TODO: Añadir consentimiento de cookies
  return (
    <Layout className={styles.layout}>
      <Header className={styles.navbar}>
        <Flex fullWidth justify="center">
          <Navbar />
        </Flex>
      </Header>
      <Content>{children}</Content>
      <LayoutFooter>
        <Footer />
      </LayoutFooter>
    </Layout>
  );
};
