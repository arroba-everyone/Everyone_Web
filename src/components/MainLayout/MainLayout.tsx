import type { IBaseComponent } from '@everyone-web/types/global';
import { Layout } from 'antd';
import styles from './MainLayout.module.css';
import { Navbar } from './Navbar';
import { Flex } from '@everyone-web/ui/Common/Flex';

export const MainLayout: IBaseComponent = ({ children }) => {
  const { Header, Content, Footer } = Layout;

  return (
    <Layout className={styles.layout}>
      <Header className={styles.navbar}>
        <Flex justify="center">
          <Navbar />
        </Flex>
      </Header>
      <Content>{children}</Content>
      <Footer></Footer>
    </Layout>
  );
};
