import { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { Button } from '@everyone-web/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@everyone-web/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@everyone-web/ui/dropdown-menu';
import { cn } from '@everyone-web/libs/utils';
import { Link, useRouterState } from '@tanstack/react-router';
import { useSession } from '@everyone-web/hooks/useSession';
import { UserMenu } from './UserMenu';

interface NavItem {
  label: string;
  href: string;
}

// Top-level pills: the four primary destinations of the site.
const primaryItems: NavItem[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Ofertas', href: '/deals' },
  { label: '@everyone', href: '/' },
  { label: 'Contacto', href: '/contact' },
];

// Secondary items collapsed under "Más".
const moreItems: NavItem[] = [
  { label: 'Sobre nosotros', href: '/aboutUs' },
  { label: 'Proyectos', href: '/projects' },
];

const allNavItems: NavItem[] = [...primaryItems, ...moreItems];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });
  const session = useSession();

  const activeLabel = allNavItems.find(item => item.href === pathname)?.label ?? '@everyone';
  const isMoreActive = moreItems.some(item => item.href === pathname);

  const pillClass = (active: boolean) =>
    cn(
      'font-semibold text-sm tablet-lg:text-base transition-colors',
      'relative rounded-4xl lg:rounded-full',
      'py-3 px-6 tablet-lg:px-7 laptop:px-8',
      active ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-primary/10'
    );

  const renderPrimaryPills = () =>
    primaryItems.map(item => (
      <Link key={item.label} to={item.href} className={pillClass(activeLabel === item.label)}>
        {item.label}
      </Link>
    ));

  const renderMoreDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(pillClass(isMoreActive), 'flex items-center gap-1 cursor-pointer')}
          aria-label="Más opciones"
        >
          Más
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className={cn(
          'rounded-3xl bg-background border-primary/20 p-2',
          'min-w-[12rem] shadow-lg'
        )}
      >
        {moreItems.map(item => {
          const isActive = activeLabel === item.label;
          return (
            <DropdownMenuItem
              key={item.label}
              asChild
              className={cn(
                'rounded-full px-5 py-2.5 cursor-pointer text-sm font-semibold',
                'focus:bg-primary/10 focus:text-primary',
                isActive
                  ? 'bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground'
                  : 'text-primary'
              )}
            >
              <Link to={item.href} className="w-full">
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderMobileItems = () =>
    allNavItems.map(item => (
      <Link
        key={item.label}
        to={item.href}
        onClick={() => setIsOpen(false)}
        className={pillClass(activeLabel === item.label)}
      >
        {item.label}
      </Link>
    ));

  const renderAuthSection = () => {
    if (session) {
      return <UserMenu session={session} />;
    }
    return (
      <Link to="/login" className="font-semibold text-sm text-primary hover:underline px-3 py-2">
        Iniciar sesión
      </Link>
    );
  };

  return (
    <nav
      className={cn(
        'bg-background fixed left-0 right-0 z-1 mx-auto',
        'w-11/12 tablet-lg:w-10/12 lg:w-fit',
        'rounded-4xl lg:rounded-full',
        'top-6 tablet-lg:top-8 laptop:top-10'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-1">
        {/* Desktop Navigation */}
        <div
          className={cn(
            'hidden lg:flex items-center justify-center',
            'h-12 tablet-lg:h-13 laptop:h-14 laptop-lg:h-15',
            'gap-3 tablet-lg:gap-4 laptop:gap-5 laptop-lg:gap-6'
          )}
        >
          {renderPrimaryPills()}
          {renderMoreDropdown()}
          {renderAuthSection()}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between h-16">
          <div className="text-primary font-bold text-xl">{activeLabel}</div>

          <div className="flex items-center gap-2">
            {renderAuthSection()}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-background p-4 w-70">
                <div className="flex flex-col gap-4 mt-8">{renderMobileItems()}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
