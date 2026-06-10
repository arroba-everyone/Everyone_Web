import { useEffect } from 'react';
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

  // Radix dialogs/dropdowns render in portals attached to <body>, outside this
  // tree. Toggling the light-token scope on <body> keeps them in sync.
  useEffect(() => {
    document.body.classList.add('theme-light');
    return () => document.body.classList.remove('theme-light');
  }, []);

  return (
    <MainLayout tone="light">
      <div
        className={cn(
          'theme-light min-h-screen w-full bg-cream text-ink',
          'px-4 md:px-8 tablet-lg:px-10 laptop:px-14 laptop-lg:px-20 xl:px-30',
          'pt-28 md:pt-24 tablet-lg:pt-32 laptop:pt-34 laptop-lg:pt-36 desktop:pt-38',
          'pb-16'
        )}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-6 tablet-lg:gap-8">
          {/* Branding header */}
          <div className="flex items-center gap-3">
            <span className="grid place-items-center size-9 rounded-xl bg-lime text-ink font-extrabold text-lg rotate-[-6deg]">
              @
            </span>
            <span className="font-bold text-xl tracking-tight">Panel de equipo</span>
          </div>

          <hr className="border-ink/10" />

          {/* Admin tab pills */}
          <nav className="flex flex-wrap gap-2">
            {adminTabs.map(tab => {
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={cn(
                    'rounded-full px-6 py-2.5 text-sm font-semibold transition-colors',
                    isActive ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink hover:bg-ink/5'
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
