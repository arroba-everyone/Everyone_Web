import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@everyone-web/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@everyone-web/ui/sheet';
import { cn } from '@everyone-web/libs/utils';
import { Link, useRouterState } from '@tanstack/react-router';
import { useSession } from '@everyone-web/hooks/useSession';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  label: string;
  href: string;
  hash?: string;
}

const navItems: NavItem[] = [
  { label: 'Servicios', href: '/', hash: 'services' },
  { label: 'Proyectos', href: '/projects' },
  { label: 'Nosotros', href: '/aboutUs' },
  { label: 'Contacto', href: '/contact' },
];

const Wordmark = () => (
  <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Ir al inicio">
    <span
      className={cn(
        'grid place-items-center size-9 rounded-xl bg-lime text-ink',
        'font-extrabold text-lg leading-none rotate-[-6deg]',
        'transition-transform duration-300 hover:rotate-6'
      )}
    >
      @
    </span>
    <span className="font-bold text-lg tracking-tight text-ink">everyone</span>
  </Link>
);

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });
  const session = useSession();

  const isActive = (item: NavItem) => !item.hash && item.href === pathname;

  const desktopLink = (item: NavItem) => (
    <Link
      key={item.label}
      to={item.href}
      hash={item.hash}
      className={cn(
        'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
        isActive(item) ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink hover:bg-ink/5'
      )}
    >
      {item.label}
    </Link>
  );

  return (
    <header className="fixed inset-x-0 top-4 tablet-lg:top-6 z-50 px-4">
      <nav
        className={cn(
          'mx-auto max-w-5xl rounded-full',
          'bg-paper/85 backdrop-blur-xl',
          'ring-1 ring-ink/8 shadow-lg shadow-ink/5'
        )}
      >
        {/* Desktop */}
        <div className="hidden lg:flex items-center justify-between gap-6 h-16 pl-5 pr-3">
          <Wordmark />

          <div className="flex items-center gap-1">{navItems.map(desktopLink)}</div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Login is intentionally NOT in the navbar: this site is not meant
                for visitors to sign in. Team access lives in the footer. */}
            {session && <UserMenu session={session} />}
            <Button
              asChild
              className={cn(
                'bg-lime text-ink hover:bg-lime/85 rounded-full h-11 px-5',
                'font-bold text-sm shadow-md shadow-lime/30'
              )}
            >
              <Link to="/contact">
                Empezar un proyecto
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center justify-between h-14 pl-4 pr-2">
          <Wordmark />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session && <UserMenu session={session} />}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-ink hover:bg-ink/5 rounded-full">
                  {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-cream border-none p-6 w-[19rem]">
                <div className="flex flex-col gap-2 mt-10">
                  {navItems.map(item => (
                    <Link
                      key={item.label}
                      to={item.href}
                      hash={item.hash}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'rounded-2xl px-5 py-3.5 text-lg font-bold transition-colors',
                        isActive(item) ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/5'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <Button
                    asChild
                    className={cn(
                      'mt-4 bg-lime text-ink hover:bg-lime/85 rounded-2xl h-13',
                      'font-bold text-base'
                    )}
                  >
                    <Link to="/contact" onClick={() => setIsOpen(false)}>
                      Empezar un proyecto
                      <ArrowUpRight className="size-5" />
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
