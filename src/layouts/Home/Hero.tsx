import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { cn } from '@everyone-web/libs/utils';

const rotatingWords = [
  { label: 'webs', tint: 'bg-lime text-ink-solid' },
  { label: 'apps', tint: 'bg-grape text-ink-solid' },
  { label: 'e-commerce', tint: 'bg-peach text-ink-solid' },
  { label: 'realidad aumentada', tint: 'bg-ink text-cream' },
  { label: 'software a medida', tint: 'bg-lime text-ink-solid' },
];

const stickerChips = [
  { label: 'Webs', tint: 'bg-lime-tint text-lime-deep', rotate: -4 },
  { label: 'E-commerce', tint: 'bg-paper text-ink', rotate: 3 },
  { label: 'Apps iOS & Android', tint: 'bg-grape-tint text-grape-deep', rotate: -2 },
  { label: 'Realidad aumentada', tint: 'bg-peach-tint text-ink', rotate: 4 },
  { label: 'Sistemas a medida', tint: 'bg-ink text-cream', rotate: -3 },
];

const WORD_INTERVAL_MS = 2600;

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

  const blobAx = useTransform(springX, v => v * 60);
  const blobAy = useTransform(springY, v => v * 40);
  const blobBx = useTransform(springX, v => v * -45);
  const blobBy = useTransform(springY, v => v * -30);
  const blobCx = useTransform(springX, v => v * 30);
  const blobCy = useTransform(springY, v => v * -50);

  return (
    <section
      className="relative overflow-hidden bg-cream"
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      {/* Soft gradient blobs with cursor parallax */}
      <motion.div
        aria-hidden
        style={{ x: blobAx, y: blobAy }}
        className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-lime/25 blur-3xl pointer-events-none"
      />
      <motion.div
        aria-hidden
        style={{ x: blobBx, y: blobBy }}
        className="absolute top-24 -right-40 size-[30rem] rounded-full bg-grape/25 blur-3xl pointer-events-none"
      />
      <motion.div
        aria-hidden
        style={{ x: blobCx, y: blobCy }}
        className="absolute bottom-0 left-1/3 size-[26rem] rounded-full bg-peach/30 blur-3xl pointer-events-none"
      />

      <div
        className={cn(
          'relative mx-auto max-w-6xl px-6',
          'pt-36 pb-20 tablet-lg:pt-44 tablet-lg:pb-28 laptop:pt-48 laptop:pb-32',
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
            'max-w-5xl text-balance font-extrabold tracking-tight text-ink',
            'text-[2.6rem] md:text-6xl laptop:text-[5rem] leading-[1.04]'
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
          className="max-w-2xl text-lg tablet-lg:text-xl text-ink-soft text-balance leading-relaxed"
        >
          Nos cuentas la idea y nosotros diseñamos, construimos y lanzamos la solución. Sin
          jerga, sin complicaciones y contigo en cada paso.
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
            Cuéntanos tu idea
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#services"
            className={cn(
              'inline-flex items-center gap-2 rounded-full bg-transparent text-ink',
              'ring-1 ring-ink/15 px-7 py-4 font-bold text-base transition-all',
              'hover:bg-ink/5 hover:ring-ink/30'
            )}
          >
            Ver qué hacemos
          </a>
        </motion.div>

        {/* Sticker-style service chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 tablet-lg:gap-4">
          {stickerChips.map((chip, i) => (
            <motion.span
              key={chip.label}
              initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: chip.rotate }}
              whileHover={{ scale: 1.1, rotate: 0, y: -4 }}
              transition={{
                duration: 0.45,
                delay: 0.45 + i * 0.1,
                scale: { type: 'spring', stiffness: 300, damping: 18 },
                rotate: { type: 'spring', stiffness: 300, damping: 18 },
              }}
              className={cn(
                'cursor-default rounded-full px-5 py-2.5 text-sm font-bold ring-1 ring-ink/5 shadow-md',
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
