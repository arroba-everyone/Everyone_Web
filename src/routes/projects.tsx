import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Reveal } from '@everyone-web/layouts/Home';
import { cn } from '@everyone-web/libs/utils';
import loopMockup from '@everyone-web/assets/mockUpLoop.png';
import mysteryPhone from '@everyone-web/assets/mysteryPhone.webp';
import { TiltShowcase } from '@everyone-web/components/TiltShowcase';

const title = 'Proyectos · @everyone';
const description =
  'Productos que diseñamos, desarrollamos y lanzamos de principio a fin. Loop, NutrIA y los proyectos que están por venir. Quizá el tuyo.';

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
          'proyectos @everyone, Loop, NutrIA, desarrollo de aplicaciones, apps móviles, productos digitales, porfolio',
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
              Estos son nuestros productos propios: ideas que diseñamos, desarrollamos y
              lanzamos de principio a fin. La mejor prueba de cómo trabajaríamos en tu
              proyecto.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Loop */}
      <section className="bg-cream">
        <div
          className={cn(
            'mx-auto max-w-6xl px-6 py-12 tablet-lg:py-16',
            'grid grid-cols-1 tablet-lg:grid-cols-2 items-center gap-12'
          )}
        >
          <Reveal>
            <TiltShowcase
              className={cn(
                'rounded-[2.5rem] bg-gradient-to-br from-grape to-grape-deep',
                'p-6 tablet-lg:p-10 -rotate-2'
              )}
              imgSrc={loopMockup}
              imgAlt="Loop, app de retos cotidianos"
              imgClassName="max-h-[28rem] drop-shadow-2xl"
              decor={
                <div
                  aria-hidden
                  className="absolute -top-10 -right-10 size-40 rounded-full bg-lime/30 blur-2xl pointer-events-none"
                />
              }
            />
          </Reveal>

          <Reveal delay={0.15} className="flex flex-col items-start gap-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-grape-tint text-grape-deep px-3.5 py-1.5 text-xs font-bold">
                Producto propio
              </span>
              <span className="rounded-full bg-lime-tint text-lime-deep px-3.5 py-1.5 text-xs font-bold">
                App móvil
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink">
              Loop
            </h2>
            <p className="text-lg text-ink-soft leading-relaxed">
              Hay cosas que hacemos todos los días sin pensarlo: un paseo, una tarea, un logro
              pequeño. Loop las convierte en juego, con retos cotidianos para compartir,
              celebrar el progreso y descubrir que competir también puede ser sano y divertido.
            </p>
            <p className="text-base text-ink-soft leading-relaxed">
              Diseño, desarrollo, backend y lanzamiento: todo hecho en casa.
            </p>
          </Reveal>
        </div>
      </section>

      {/* NutrIA + tu proyecto */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-12 tablet-lg:py-16 grid grid-cols-1 tablet-lg:grid-cols-2 gap-6">
          <Reveal>
            <TiltShowcase
              className={cn(
                'flex flex-col gap-5 rounded-[2.5rem] bg-ink text-cream',
                'dark:bg-paper dark:text-ink dark:ring-1 dark:ring-ink/10',
                'p-10 tablet-lg:p-12 h-full overflow-hidden'
              )}
              imgSrc={mysteryPhone}
              imgAlt="NutrIA, próximamente"
              imgClassName="max-h-60 drop-shadow-xl"
              decor={
                <div
                  aria-hidden
                  className="absolute -bottom-20 -right-16 size-64 rounded-full bg-grape/25 blur-3xl pointer-events-none"
                />
              }
            >
              <div className="relative flex flex-col gap-3">
                <span className="self-start rounded-full bg-cream/10 text-lime dark:bg-lime/10 px-3.5 py-1.5 text-xs font-bold">
                  En el horno 🤫
                </span>
                <h3 className="text-2xl font-bold">NutrIA</h3>
                <p className="text-cream/70 dark:text-ink-soft leading-relaxed">
                  Lo siguiente que sale de nuestro laboratorio. Aún no podemos contar mucho,
                  pero el nombre no es casualidad… y si te intriga, es buena señal.
                </p>
              </div>
            </TiltShowcase>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              className={cn(
                'relative flex flex-col justify-between gap-8 rounded-[2.5rem] bg-lime',
                'p-10 tablet-lg:p-12 h-full overflow-hidden'
              )}
            >
              <div
                aria-hidden
                className="absolute -top-16 -right-16 size-56 rounded-full bg-paper/40 blur-2xl pointer-events-none"
              />
              <div className="relative flex flex-col gap-3">
                <span className="self-start rounded-full bg-ink-solid/10 text-ink-solid px-3.5 py-1.5 text-xs font-bold">
                  Hueco libre
                </span>
                <h3 className="text-3xl tablet-lg:text-4xl font-extrabold tracking-tight text-ink-solid text-balance">
                  ¿El siguiente proyecto? El tuyo.
                </h3>
                <p className="text-ink-solid/70 font-medium leading-relaxed">
                  Ponemos el mismo cariño en los proyectos de nuestros clientes que en los
                  nuestros. Cuéntanos qué necesitas y lo construimos juntos.
                </p>
              </div>
              <Link
                to="/contact"
                className={cn(
                  'group relative inline-flex items-center gap-2 self-start rounded-full',
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
