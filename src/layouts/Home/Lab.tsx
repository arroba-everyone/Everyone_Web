import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { cn } from '@everyone-web/libs/utils';
import everyLog from '@everyone-web/assets/everyLog.webp';
import { Reveal } from './Reveal';

/** Featured own product — proof that we ship real products end to end. */
export const Lab = () => (
  <section className="bg-cream overflow-hidden">
    <div
      className={cn(
        'mx-auto max-w-6xl px-6 py-20 tablet-lg:py-28',
        'grid grid-cols-1 tablet-lg:grid-cols-2 items-center gap-12 tablet-lg:gap-16'
      )}
    >
      <Reveal className="flex flex-col items-start gap-5">
        <span className="rounded-full bg-grape-tint text-grape-deep px-4 py-1.5 text-sm font-bold">
          Nuestro laboratorio
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink text-balance">
          También construimos productos propios.
        </h2>
        <p className="text-lg text-ink-soft leading-relaxed">
          EveryLog es nuestra app de retos cotidianos: la diseñamos, la desarrollamos y la
          lanzamos nosotros, de cero a la App Store. Es nuestra mejor carta de presentación —
          sabemos lo que cuesta llevar un producto al mundo real porque lo hacemos también con
          los nuestros.
        </p>
        <Link
          to="/projects"
          className={cn(
            'group inline-flex items-center gap-2 rounded-full bg-ink text-paper',
            'px-6 py-3.5 font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/20'
          )}
        >
          Ver proyectos
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>

      <Reveal delay={0.15}>
        <div
          className={cn(
            'relative rounded-[2.5rem] bg-gradient-to-br from-grape to-grape-deep',
            'p-10 tablet-lg:p-14 rotate-2 transition-transform duration-500 hover:rotate-0'
          )}
        >
          <div
            aria-hidden
            className="absolute -top-10 -right-10 size-40 rounded-full bg-lime/30 blur-2xl pointer-events-none"
          />
          <img
            src={everyLog}
            alt="EveryLog, nuestra app de retos cotidianos"
            className="relative w-full max-h-[26rem] object-contain drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </Reveal>
    </div>
  </section>
);
