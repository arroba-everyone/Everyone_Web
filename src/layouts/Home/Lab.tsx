import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '@everyone-web/libs/utils';
import loopMockup from '@everyone-web/assets/mockUpLoop.png';
import { Reveal } from './Reveal';

/** Purple card with the Loop mockup — tilts in 3D following the cursor,
 *  and the phone floats with extra depth of its own. */
const LoopShowcase = () => {
  // Normalized cursor position within the card (-0.5 … 0.5)
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const springCfg = { stiffness: 150, damping: 18 };
  const rotateX = useSpring(useTransform(posY, v => v * -10), springCfg);
  const rotateY = useSpring(useTransform(posX, v => v * 12), springCfg);
  const phoneX = useSpring(useTransform(posX, v => v * 26), springCfg);
  const phoneY = useSpring(useTransform(posY, v => v * 20), springCfg);
  // The phone overflows the card slightly at rest and pops out on hover
  const phoneScale = useSpring(1.08, { stiffness: 180, damping: 17 });

  return (
    <div className="[perspective:1200px]">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          posX.set((e.clientX - rect.left) / rect.width - 0.5);
          posY.set((e.clientY - rect.top) / rect.height - 0.5);
        }}
        onMouseEnter={() => phoneScale.set(1.25)}
        onMouseLeave={() => {
          posX.set(0);
          posY.set(0);
          phoneScale.set(1.08);
        }}
        className={cn(
          'relative rounded-[2.5rem] bg-gradient-to-br from-grape to-grape-deep',
          'p-6 tablet-lg:p-8 rotate-2'
        )}
      >
        <div
          aria-hidden
          className="absolute -top-10 -right-10 size-40 rounded-full bg-lime/30 blur-2xl pointer-events-none"
        />
        <motion.img
          src={loopMockup}
          alt="Loop, nuestra app de retos cotidianos"
          style={{ x: phoneX, y: phoneY, z: 50, scale: phoneScale }}
          className="relative w-full max-h-[32rem] object-contain drop-shadow-2xl pointer-events-none"
          loading="lazy"
        />
      </motion.div>
    </div>
  );
};

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
          Loop es nuestra app de retos cotidianos: la diseñamos, la desarrollamos y la
          lanzamos nosotros, de cero a la App Store. Es nuestra mejor carta de presentación.
          Sabemos lo que cuesta llevar un producto al mundo real porque lo hacemos también con
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
        <LoopShowcase />
      </Reveal>
    </div>
  </section>
);
