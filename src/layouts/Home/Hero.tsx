import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowDown, ArrowRight } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { cn } from '@everyone-web/libs/utils';
import { ServicesMarquee } from './ServicesMarquee';

const rotatingWords = [
  { label: 'webs', tint: 'bg-lime text-ink-solid' },
  { label: 'apps', tint: 'bg-grape text-ink-solid' },
  { label: 'e-commerce', tint: 'bg-peach text-ink-solid' },
  { label: 'realidad aumentada', tint: 'bg-ink text-cream' },
  { label: 'software a medida', tint: 'bg-lime text-ink-solid' },
];

const WORD_INTERVAL_MS = 2600;

/** Fine monochrome noise, tiled — gives the hero a tactile, printed feel. */
const GRAIN_URI = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

/** Word that cycles through what we build, flipping up inside a tinted pill. */
const RotatingWord = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % rotatingWords.length);
    }, WORD_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const word = rotatingWords[index];

  return (
    <span className="relative inline-grid overflow-hidden py-2 align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word.label}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'inline-block rounded-2xl px-4 pb-1 -rotate-1',
            // Clone the pill background on each line if the term wraps on small screens
            '[box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
            word.tint
          )}
        >
          {word.label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export const Hero = () => {
  // Normalized cursor position (-0.5 … 0.5) drives a soft parallax on the blobs.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const blobAx = useTransform(springX, v => v * 70);
  const blobAy = useTransform(springY, v => v * 50);
  const blobBx = useTransform(springX, v => v * -55);
  const blobBy = useTransform(springY, v => v * -35);
  const blobCx = useTransform(springX, v => v * 40);
  const blobCy = useTransform(springY, v => v * -60);

  return (
    <section
      className="relative overflow-hidden bg-cream"
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      {/* Mesh gradient — three layers per blob: entrance from the center,
          cursor parallax, then slow autonomous drift */}
      <motion.div
        aria-hidden
        initial={{ x: '42vw', y: '42vh', scale: 0.5, opacity: 0 }}
        animate={{ x: '0vw', y: '0vh', scale: 1, opacity: 1 }}
        transition={{
          opacity: { duration: 0.6 },
          default: { duration: 1.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] },
        }}
        className="absolute -top-44 -left-36 pointer-events-none"
      >
        <motion.div style={{ x: blobAx, y: blobAy }}>
          <div
            className="size-[40rem] rounded-full blur-3xl animate-blob-drift"
            style={{ backgroundColor: 'var(--v2-hero-blob-lime)' }}
          />
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden
        initial={{ x: '-42vw', y: '35vh', scale: 0.5, opacity: 0 }}
        animate={{ x: '0vw', y: '0vh', scale: 1, opacity: 1 }}
        transition={{
          opacity: { duration: 0.6 },
          default: { duration: 1.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] },
        }}
        className="absolute top-16 -right-44 pointer-events-none"
      >
        <motion.div style={{ x: blobBx, y: blobBy }}>
          <div
            className="size-[36rem] rounded-full blur-3xl animate-blob-drift-slow"
            style={{ backgroundColor: 'var(--v2-hero-blob-grape)' }}
          />
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden
        initial={{ x: '18vw', y: '-35vh', scale: 0.5, opacity: 0 }}
        animate={{ x: '0vw', y: '0vh', scale: 1, opacity: 1 }}
        transition={{
          opacity: { duration: 0.6 },
          default: { duration: 1.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] },
        }}
        className="absolute -bottom-24 left-1/4 pointer-events-none"
      >
        <motion.div style={{ x: blobCx, y: blobCy }}>
          <div
            className="size-[32rem] rounded-full blur-3xl animate-blob-drift"
            style={{ backgroundColor: 'var(--v2-hero-blob-peach)' }}
          />
        </motion.div>
      </motion.div>

      {/* Faint dot grid, fading out toward the edges */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(color-mix(in srgb, var(--v2-ink) 22%, transparent) 1.5px, transparent 1.5px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent 78%)',
        }}
      />

      {/* Film grain on top of everything */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: GRAIN_URI }}
      />

      {/* Fade the blobs and texture into flat cream well above the section
          edge — the bottom stretch must be 100% flat so there is no visible
          step against the next section. from-cream/0 (not `transparent`)
          keeps the interpolation inside the cream hue. */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-x-0 bottom-0 h-96 pointer-events-none',
          'bg-gradient-to-b from-cream/0 via-cream to-cream'
        )}
      />

      <div
        className={cn(
          'relative mx-auto max-w-6xl px-6',
          'min-h-[calc(100svh-12rem)] pt-32 pb-12 tablet-lg:pt-36 tablet-lg:pb-14',
          'flex flex-col items-center justify-center text-center gap-9'
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
            'max-w-5xl text-balance font-extrabold tracking-tight text-ink',
            'text-[2.6rem] md:text-6xl laptop:text-[5.5rem] leading-[1.04]'
          )}
        >
          Convertimos ideas
          <br />
          en <RotatingWord />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg tablet-lg:text-xl font-medium text-ink-soft leading-relaxed"
        >
          <span className="block">
            Diseño, código y lanzamiento, contigo de principio a fin.
          </span>
          <span className="block">Tú traes la idea; nosotros, el resto.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-2 flex flex-col sm:flex-row items-center gap-7"
        >
          <Link
            to="/contact"
            className={cn(
              'group inline-flex items-center gap-2.5 rounded-full bg-lime text-ink-solid',
              'px-9 py-5 font-extrabold text-lg transition-all',
              'shadow-lg shadow-lime/30 hover:shadow-xl hover:shadow-lime/50 hover:-translate-y-0.5'
            )}
          >
            Cuéntanos tu idea
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#services"
            className="group inline-flex items-center gap-3 font-bold text-base text-ink"
          >
            Ver qué hacemos
            <span
              className={cn(
                'grid place-items-center size-10 rounded-full ring-1 ring-ink/15 transition-all',
                'group-hover:bg-ink group-hover:text-paper group-hover:ring-ink'
              )}
            >
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </span>
          </a>
        </motion.div>
      </div>

      <ServicesMarquee />
    </section>
  );
};
