import styles from '@everyone-web/css/index.module.css';
import landingPhone from '@everyone-web/assets/landingPhone.webp';
import { Link } from '@tanstack/react-router';
import { cn } from '@everyone-web/libs/utils';
import { Button } from '@everyone-web/ui/button';
import { motion } from 'motion/react';
import { useParallax } from '@everyone-web/hooks/useParallax';

export const Landing = () => {
  const { ref, smoothY } = useParallax(80);

  return (
    <div className="w-full tablet-lg:h-[95vh] lg:h-screen py-10 tablet-lg:py-8 px-4">
      <div
        className={cn(
          'w-full h-full flex items-center justify-center',
          'rounded-4xl bg-cover',
          'flex-col gap-12 px-10 py-20 md:px-12 md:py-8 tablet-lg:px-8 tablet-lg:py-10',
          'laptop:p-12 laptop-lg:p-16 desktop:p-0',
          'lg:flex-row lg:gap-0',
          styles.landing
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-5 tablet-lg:gap-6 laptop:gap-7',
            'pt-8 lg:pt-0',
            'lg:px-16 laptop:px-18 laptop-lg:px-20 desktop:px-21',
            'xs:text-center items-center lg:items-start'
          )}
        >
          <h1
            className={cn(
              'font-bold w-fit',
              'text-xl md:text-3xl tablet-lg:text-4xl laptop:text-5xl laptop-lg:text-6xl desktop:text-8xl'
            )}
          >
            Innovar no es complicar. Es conectar.
          </h1>

          <h2
            className={cn(
              'text-md md:text-lg tablet-lg:text-xl laptop:text-2xl laptop-lg:text-3xl desktop:text-5xl'
            )}
          >
            En @Everyone hacemos apps y contenido tech para humanos normales. <br />
            Sin humo. Sin postureo. Con mucho corazón.
          </h2>

          <div className={cn('flex flex-col gap-3 w-full', 'lg:flex-row lg:gap-4')}>
            <Link to="/projects">
              <Button
                className="rounded-full transition-all hover:scale-110 cursor-pointer text-lg desktop:text-2xl"
                size={'lg'}
              >
                Explorar
              </Button>
            </Link>

            <Link to="/contact" className={true ? 'w-full' : undefined}>
              <Button
                className="rounded-full transition-all hover:scale-110 cursor-pointer border border-primary text-primary text-lg desktop:text-2xl"
                size={'lg'}
                variant="ghost"
              >
                Escríbenos
              </Button>
            </Link>
          </div>
        </div>

        <div ref={ref}>
          <motion.img
            style={{ y: smoothY }}
            src={landingPhone}
            alt="Móvil landing page"
            className={cn(
              'object-contain',
              'w-62.5 tablet-lg:w-70 laptop:w-75 laptop-lg:w-80 desktop:w-200',
              'h-125 tablet-lg:h-140 laptop:h-150 laptop-lg:h-160 desktop:h-250'
            )}
          />
        </div>
      </div>
    </div>
  );
};
