import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { AppShowcase } from '@everyone-web/components/projects/AppShowcase';
import { APPS } from '@everyone-web/constants/apps';
import { Reveal } from '@everyone-web/layouts/Home';
import { cn } from '@everyone-web/libs/utils';

const title = 'Proyectos · @everyone';
const description =
  'Spotter, Inédito y Loop: las apps propias que diseñamos, desarrollamos y lanzamos de principio a fin. Disponibles en App Store y Google Play.';

export const Route = createFileRoute('/projects')({
  component: Projects,
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: 'https://arrobaeveryone.com/projects' },
      { property: 'og:image', content: 'https://arrobaeveryone.com/logo512.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: 'https://arrobaeveryone.com/logo512.png' },
      {
        name: 'keywords',
        content:
          'proyectos @everyone, Spotter, Inédito, Loop, apps iOS, apps Android, App Store, Google Play, desarrollo de aplicaciones, productos digitales, porfolio',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://arrobaeveryone.com/projects' }],
  }),
});

function Projects() {
  return (
    <MainLayout tone="light">
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div
          aria-hidden
          className="absolute -top-32 left-1/4 size-[26rem] rounded-full bg-lime/20 blur-3xl pointer-events-none"
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-12 tablet-lg:pt-48 tablet-lg:pb-16 flex flex-col items-start gap-6">
          <Reveal className="flex flex-col items-start gap-5 max-w-3xl">
            <span className="rounded-full bg-paper ring-1 ring-ink/8 text-ink-soft px-4 py-1.5 text-sm font-bold">
              Proyectos
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink text-balance leading-[1.05]">
              Lo que construimos cuando nadie nos lo pide.
            </h1>
            <p className="text-lg tablet-lg:text-xl text-ink-soft leading-relaxed">
              Estos son nuestros productos propios: ideas que diseñamos, desarrollamos y lanzamos de
              principio a fin. La mejor prueba de cómo trabajaríamos en tu proyecto.
            </p>
            <nav aria-label="Ir a un proyecto" className="flex flex-wrap gap-2 pt-1">
              {APPS.map(app => (
                <a
                  key={app.id}
                  href={`#${app.id}`}
                  className={cn(
                    'rounded-full bg-paper ring-1 ring-ink/8 px-5 py-2.5 text-sm font-bold text-ink',
                    'transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-ink/10'
                  )}
                >
                  {app.name}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {/* Apps publicadas */}
      {APPS.map((app, index) => (
        <AppShowcase key={app.id} app={app} reverse={index % 2 === 1} />
      ))}

      {/* Tu proyecto */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-12 tablet-lg:py-20">
          <Reveal>
            <div
              className={cn(
                'relative overflow-hidden rounded-[2.5rem] tablet-lg:rounded-[3rem] bg-lime',
                'p-10 tablet-lg:p-14 flex flex-col gap-8',
                'tablet-lg:flex-row tablet-lg:items-end tablet-lg:justify-between'
              )}
            >
              <div
                aria-hidden
                className="absolute -top-16 -right-16 size-56 rounded-full bg-paper-solid/40 blur-2xl pointer-events-none"
              />
              <div className="relative flex flex-col gap-3 max-w-2xl">
                <span className="self-start rounded-full bg-ink-solid/10 text-ink-solid px-3.5 py-1.5 text-xs font-bold">
                  Hueco libre
                </span>
                <h2 className="text-3xl tablet-lg:text-5xl font-extrabold tracking-tight text-ink-solid text-balance">
                  ¿El siguiente proyecto? El tuyo.
                </h2>
                <p className="text-ink-solid/70 font-medium leading-relaxed">
                  Ponemos el mismo cariño en los proyectos de nuestros clientes que en los nuestros.
                  Cuéntanos qué necesitas y lo construimos juntos.
                </p>
              </div>
              <Link
                to="/contact"
                className={cn(
                  'group relative inline-flex shrink-0 items-center gap-2 self-start rounded-full',
                  'bg-ink-solid text-paper-solid px-6 py-3.5 font-bold transition-all',
                  'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink-solid/25'
                )}
              >
                Empezar un proyecto
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </MainLayout>
  );
}
