import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface IReveal {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Fade-up on scroll, used across the redesigned public pages. */
export const Reveal = ({ children, delay = 0, className }: IReveal) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.21, 0.6, 0.35, 1] }}
  >
    {children}
  </motion.div>
);
