import type { IBaseComponent } from '@everyone-web/types/global';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout: IBaseComponent = ({ children }) => {
  // TODO: Añadir consentimiento de cookies
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
