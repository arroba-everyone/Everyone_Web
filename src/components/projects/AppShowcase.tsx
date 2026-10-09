import { Check } from 'lucide-react';
import { Reveal } from '@everyone-web/layouts/Home';
import { cn } from '@everyone-web/libs/utils';
import type { AppId, IAppProject } from '@everyone-web/constants/apps';
import { ScreenshotStrip } from './ScreenshotStrip';
import { StoreButton } from './StoreButton';

/** Degradado de marca del escenario de cada app (tokens en styles.css). */
const STAGE_BACKGROUND: Record<AppId, string> = {
  spotter: 'from-spotter to-spotter-deep',
  inedito: 'from-inedito to-inedito-deep',
  loop: 'from-grape to-grape-deep',
};

interface IAppShowcase {
  app: IAppProject;
  /** Escenario a la izquierda y texto a la derecha (solo en escritorio). */
  reverse?: boolean;
}

/** Ficha de una app propia: texto de venta, botones de tienda y capturas. */
export const AppShowcase = ({ app, reverse = false }: IAppShowcase) => {
  const titleId = `${app.id}-title`;

  return (
    <section id={app.id} aria-labelledby={titleId} className="scroll-mt-28 bg-cream">
      <div
        className={cn(
          'mx-auto max-w-6xl px-6 py-12 tablet-lg:py-20',
          'grid grid-cols-1 tablet-lg:grid-cols-12 items-center gap-10 tablet-lg:gap-14'
        )}
      >
        <Reveal
          className={cn(
            'tablet-lg:col-span-5 flex flex-col items-start gap-5',
            reverse && 'tablet-lg:order-2'
          )}
        >
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-grape-tint text-grape-deep px-3.5 py-1.5 text-xs font-bold">
              Producto propio
            </span>
            {['iOS', 'Android'].map(platform => (
              <span
                key={platform}
                className="rounded-full bg-lime-tint text-lime-deep px-3.5 py-1.5 text-xs font-bold"
              >
                {platform}
              </span>
            ))}
          </div>

          <h2 id={titleId} className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink">
            {app.name}
          </h2>
          <p className="text-xl md:text-2xl font-bold leading-snug text-ink text-balance">
            {app.tagline}
          </p>

          {app.description.map(paragraph => (
            <p key={paragraph} className="text-lg text-ink-soft leading-relaxed">
              {paragraph}
            </p>
          ))}

          <ul className="flex flex-col gap-3">
            {app.highlights.map(highlight => (
              <li key={highlight} className="flex items-start gap-3 text-ink-soft">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-lime-tint text-lime-deep">
                  <Check aria-hidden className="size-3.5" strokeWidth={3} />
                </span>
                {highlight}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <StoreButton store="ios" href={app.stores.ios} appName={app.name} />
            <StoreButton store="android" href={app.stores.android} appName={app.name} />
          </div>

          <div className="flex flex-col items-start gap-1.5 text-sm text-ink-soft">
            {app.note && <p>{app.note}</p>}
            <a
              href={app.privacyHref}
              className="font-bold text-ink underline underline-offset-4 decoration-2 hover:opacity-70 transition-opacity"
            >
              Política de privacidad
            </a>
          </div>
        </Reveal>

        {/* En móvil el escenario va primero: se ve la app antes de leer. */}
        <Reveal
          delay={0.15}
          className={cn(
            'order-first min-w-0 tablet-lg:col-span-7',
            reverse ? 'tablet-lg:order-1' : 'tablet-lg:order-none'
          )}
        >
          <div
            className={cn(
              'relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br',
              STAGE_BACKGROUND[app.id]
            )}
          >
            <div
              aria-hidden
              className="absolute -top-16 -right-16 size-64 rounded-full bg-paper-solid/25 blur-3xl pointer-events-none"
            />
            <div
              aria-hidden
              className="absolute -bottom-20 -left-12 size-64 rounded-full bg-ink-solid/20 blur-3xl pointer-events-none"
            />
            <ScreenshotStrip appName={app.name} screenshots={app.screenshots} />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
