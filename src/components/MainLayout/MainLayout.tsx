import type { IBaseComponent } from '@everyone-web/types/global';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout: IBaseComponent = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
