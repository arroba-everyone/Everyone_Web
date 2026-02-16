import { useRef } from 'react';
import { useScroll, useSpring, useTransform } from 'motion/react';
import { useIsMobile } from './useIsMobile';

export const useParallax = (range: number = 150, mobileRange?: number) => {
  const isMobile = useIsMobile();
  const ref = useRef(null);

  const activeRange = mobileRange !== undefined && isMobile ? mobileRange : range;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-activeRange, activeRange]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return { ref, smoothY };
};
