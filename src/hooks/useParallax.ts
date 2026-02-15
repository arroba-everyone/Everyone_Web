import { useRef } from 'react';
import { useScroll, useSpring, useTransform } from 'motion/react';

export const useParallax = (range: number = 80) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return { ref, smoothY };
};
