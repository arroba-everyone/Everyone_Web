import type { ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '@everyone-web/libs/utils';

interface ITiltShowcase {
  /** Card surface classes: background, padding, radius, base rotation… */
  className?: string;
  /** Mockup image, rendered with parallax depth and hover pop. */
  imgSrc: string;
  imgAlt: string;
  imgClassName?: string;
  /** Decorative layers (blurred blobs…) rendered behind the image. */
  decor?: ReactNode;
  /** Extra content rendered inside the card, below the image. */
  children?: ReactNode;
}

/** Card that tilts in 3D following the cursor while the mockup inside
 *  floats with extra depth: slightly overflowing at rest, popping out
 *  on hover. Inert on touch devices (mouse events only). */
export const TiltShowcase = ({
  className,
  imgSrc,
  imgAlt,
  imgClassName,
  decor,
  children,
}: ITiltShowcase) => {
  // Normalized cursor position within the card (-0.5 … 0.5)
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const springCfg = { stiffness: 150, damping: 18 };
  const rotateX = useSpring(useTransform(posY, v => v * -10), springCfg);
  const rotateY = useSpring(useTransform(posX, v => v * 12), springCfg);
  const phoneX = useSpring(useTransform(posX, v => v * 26), springCfg);
  const phoneY = useSpring(useTransform(posY, v => v * 20), springCfg);
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
        className={cn('relative', className)}
      >
        {decor}
        <motion.img
          src={imgSrc}
          alt={imgAlt}
          style={{ x: phoneX, y: phoneY, z: 50, scale: phoneScale }}
          className={cn('relative w-full object-contain pointer-events-none', imgClassName)}
          loading="lazy"
        />
        {children}
      </motion.div>
    </div>
  );
};
