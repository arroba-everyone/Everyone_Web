import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@everyone-web/libs/utils';
import { Icon } from '@everyone-web/ui/Icon/Icon';

const navLinks = [
  { label: 'Servicios', href: '/', hash: 'services' },
  { label: 'Proyectos', href: '/projects' },
  { label: 'Nosotros', href: '/aboutUs' },
  { label: 'Contacto', href: '/contact' },
];

export const Footer = () => {
  return (
    <footer className="px-4 pb-4 pt-10">
      <div
        className={cn(
          'mx-auto max-w-7xl rounded-[2.5rem] tablet-lg:rounded-[3rem]',
          'bg-ink text-cream overflow-hidden relative'
        )}
      >
        {/* Decorative glow */}
        <div
          aria-hidden
          className="absolute -top-24 -right-24 size-72 rounded-full bg-lime/15 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-20 size-80 rounded-full bg-grape/15 blur-3xl pointer-events-none"
        />

        <div className="relative px-8 py-12 tablet-lg:px-14 tablet-lg:py-16 flex flex-col gap-12">
          {/* Top: claim + CTA */}
          <div className="flex flex-col tablet-lg:flex-row tablet-lg:items-end justify-between gap-8">
            <div className="flex flex-col gap-4 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="grid place-items-center size-9 rounded-xl bg-lime text-ink-solid font-extrabold text-lg rotate-[-6deg]">
                  @
                </span>
                <span className="font-bold text-xl tracking-tight">everyone</span>
              </div>
              <p className="text-2xl tablet-lg:text-3xl font-bold tracking-tight text-balance">
                ¿Le damos forma a tu próximo proyecto?
              </p>
            </div>

            <a
              href="mailto:contacto@arrobaeveryone.com"
              className={cn(
                'group inline-flex items-center gap-2 self-start tablet-lg:self-auto',
                'rounded-full bg-lime text-ink-solid font-bold px-6 py-3.5',
                'transition-transform hover:-translate-y-0.5'
              )}
            >
              contacto@arrobaeveryone.com
              <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <hr className="border-cream/10" />

          {/* Middle: nav + socials */}
          <div className="flex flex-col tablet-lg:flex-row justify-between gap-8">
            <nav className="flex flex-wrap gap-x-8 gap-y-3">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  hash={link.hash}
                  className="text-sm font-semibold text-cream/70 hover:text-lime transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-5">
              <a
                href="https://www.instagram.com/arroba_everyone"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-cream/70 hover:text-lime transition-colors"
              >
                <Icon name="instagram" className="size-6" />
              </a>
              <a
                href="https://github.com/arroba-everyone"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-cream/70 hover:text-lime transition-colors"
              >
                <Icon name="github" className="size-6" />
              </a>
            </div>
          </div>

          {/* Bottom: legal */}
          <div className="flex flex-col tablet-lg:flex-row justify-between gap-3 text-xs text-cream/40">
            <p>© {new Date().getFullYear()} @everyone · Todos los derechos reservados</p>
            <Link to="/login" className="hover:text-cream/70 transition-colors">
              Acceso equipo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
