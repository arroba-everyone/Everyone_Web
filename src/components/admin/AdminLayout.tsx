import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '@everyone-web/libs/utils';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';

interface AdminTab {
  label: string;
  href: string;
}

const adminTabs: AdminTab[] = [
  { label: 'Ofertas', href: '/deals/manage' },
  { label: 'Blog', href: '/blog/manage' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = useRouterState({ select: s => s.location.pathname });

  return (
    <MainLayout>
      <div
        className={cn(
          'min-h-screen w-full',
          'px-4 md:px-8 tablet-lg:px-10 laptop:px-14 laptop-lg:px-20 xl:px-30',
          'pt-28 md:pt-24 tablet-lg:pt-32 laptop:pt-34 laptop-lg:pt-36 desktop:pt-38',
          'pb-16'
        )}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-8 tablet-lg:gap-10 laptop:gap-12">
          {/* Admin tab pills — same language as Navbar */}
          <nav className="flex flex-wrap gap-2 tablet-lg:gap-3">
            {adminTabs.map(tab => {
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={cn(
                    'font-semibold text-sm tablet-lg:text-base transition-colors',
                    'rounded-full py-3 px-6 tablet-lg:px-7 laptop:px-8',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-primary hover:bg-primary/10'
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* Page content */}
          <div>{children}</div>
        </div>
      </div>
    </MainLayout>
  );
}
