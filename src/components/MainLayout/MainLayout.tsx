import type { IBaseComponent, IBaseComponentProps } from '@everyone-web/types/global';
import { cn } from '@everyone-web/libs/utils';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface IMainLayout extends IBaseComponentProps {
  /**
   * 'light' — public/redesigned pages (cream background).
   * 'dark' — legacy areas (deals, blog, auth, settings) keep the dark theme.
   */
  tone?: 'light' | 'dark';
}

export const MainLayout: IBaseComponent<IMainLayout> = ({ children, tone = 'dark' }) => {
  return (
    <div className={cn(tone === 'light' ? 'bg-cream text-ink' : 'bg-background')}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
