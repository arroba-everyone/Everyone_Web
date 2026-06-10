import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { cn } from '@everyone-web/libs/utils';
import { Reveal } from './Reveal';

export const FinalCTA = () => (
  <section className="bg-cream px-4 pb-10">
    <Reveal>
      <div
        className={cn(
          'relative mx-auto max-w-7xl overflow-hidden',
          'rounded-[2.5rem] tablet-lg:rounded-[3rem] bg-lime'
        )}
      >
        <div
          aria-hidden
          className="absolute -top-24 -right-16 size-80 rounded-full bg-grape/30 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-28 left-10 size-72 rounded-full bg-paper/40 blur-3xl pointer-events-none"
        />

        <div
          className={cn(
            'relative px-8 py-16 tablet-lg:px-14 tablet-lg:py-24',
            'flex flex-col items-center text-center gap-6'
          )}
        >
          <h2 className="max-w-3xl text-3xl md:text-5xl laptop:text-6xl font-extrabold tracking-tight text-ink text-balance">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="max-w-xl text-lg text-ink/70 font-medium leading-relaxed">
            Cuéntanoslo sin compromiso. Te respondemos en menos de 48 horas con una propuesta
            clara y un precio honesto.
          </p>
          <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/contact"
              className={cn(
                'group inline-flex items-center gap-2 rounded-full bg-ink text-paper',
                'px-7 py-4 font-bold text-base transition-all',
                'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink/25'
              )}
            >
              Escríbenos
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="mailto:contacto@arrobaeveryone.com"
              className="font-bold text-ink underline underline-offset-4 decoration-2 hover:opacity-70 transition-opacity"
            >
              contacto@arrobaeveryone.com
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);
