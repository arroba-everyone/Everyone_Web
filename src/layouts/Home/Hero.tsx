import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@everyone-web/libs/utils';

const floatingChips = [
  { label: 'Webs & e-commerce', tint: 'bg-lime-tint text-lime-deep', delay: 0 },
  { label: 'Apps iOS & Android', tint: 'bg-grape-tint text-grape-deep', delay: 0.12 },
  { label: 'Realidad aumentada', tint: 'bg-peach-tint text-ink', delay: 0.24 },
  { label: 'Sistemas de reservas', tint: 'bg-paper text-ink', delay: 0.36 },
];

/** Circular rotating sticker — pure decoration, hidden on small screens. */
const Sticker = () => (
  <div
    aria-hidden
    className="hidden laptop:block absolute right-10 top-36 size-36 animate-spin-slow opacity-90"
  >
    <svg viewBox="0 0 200 200" className="size-full">
      <defs>
        <path id="sticker-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="98" className="fill-lime" />
      <text className="fill-ink font-bold uppercase" style={{ fontSize: '20.5px', letterSpacing: '2.5px' }}>
        <textPath href="#sticker-circle">diseño · código · producto · @everyone ·</textPath>
      </text>
      <text
        x="100"
        y="112"
        textAnchor="middle"
        className="fill-ink font-extrabold"
        style={{ fontSize: '38px' }}
      >
        @
      </text>
    </svg>
  </div>
);

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Soft gradient blobs */}
      <div
        aria-hidden
        className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-lime/25 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute top-24 -right-40 size-[30rem] rounded-full bg-grape/25 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/3 size-[26rem] rounded-full bg-peach/30 blur-3xl pointer-events-none"
      />

      <Sticker />

      <div
        className={cn(
          'relative mx-auto max-w-6xl px-6',
          'pt-36 pb-20 tablet-lg:pt-44 tablet-lg:pb-28 laptop:pt-52 laptop:pb-32',
          'flex flex-col items-center text-center gap-8'
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'inline-flex items-center gap-2 rounded-full bg-paper/80 backdrop-blur',
            'ring-1 ring-ink/8 px-4 py-2 text-sm font-semibold text-ink-soft'
          )}
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full rounded-full bg-lime opacity-75 animate-ping" />
            <span className="relative inline-flex size-2.5 rounded-full bg-lime-deep" />
          </span>
          Aceptamos nuevos proyectos
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            'max-w-4xl text-balance font-extrabold tracking-tight text-ink',
            'text-4xl md:text-6xl laptop:text-7xl leading-[1.05]'
          )}
        >
          Diseñamos y construimos{' '}
          <span className="relative inline-block whitespace-nowrap">
            <span
              aria-hidden
              className="absolute inset-x-[-2%] bottom-[6%] h-[42%] -rotate-1 rounded-md bg-lime/50"
            />
            <span className="relative">productos digitales</span>
          </span>{' '}
          que hacen crecer tu negocio.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg tablet-lg:text-xl text-ink-soft text-balance leading-relaxed"
        >
          Webs, apps móviles, realidad aumentada y sistemas a medida. Somos un equipo
          multidisciplinar que convierte tu idea en algo real — de la primera conversación al
          lanzamiento.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/contact"
            className={cn(
              'group inline-flex items-center gap-2 rounded-full bg-ink text-paper',
              'px-7 py-4 font-bold text-base transition-all',
              'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink/20'
            )}
          >
            Cuéntanos tu proyecto
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#servicios"
            className={cn(
              'inline-flex items-center gap-2 rounded-full bg-transparent text-ink',
              'ring-1 ring-ink/15 px-7 py-4 font-bold text-base transition-all',
              'hover:bg-ink/5 hover:ring-ink/30'
            )}
          >
            Ver servicios
          </a>
        </motion.div>

        {/* Floating service chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 tablet-lg:gap-4">
          {floatingChips.map(chip => (
            <motion.span
              key={chip.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.45 + chip.delay }}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-bold ring-1 ring-ink/5 shadow-sm',
                chip.delay % 0.24 === 0 ? 'animate-float-slow' : 'animate-float-slower',
                chip.tint
              )}
            >
              {chip.label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};
