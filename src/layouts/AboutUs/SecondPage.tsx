import styles from '@everyone-web/css/index.module.css';
import aboutUsPhone from '@everyone-web/assets/aboutUsPhone.webp';
import { cn } from '@everyone-web/libs/utils';
import { motion } from 'motion/react';
import { useParallax } from '@everyone-web/hooks/useParallax';

export const SecondPage = () => {
  const { ref, smoothY } = useParallax(150, 40);

  return (
    <div className="rotate-180 w-full tablet-lg:h-[95vh] lg:h-screen py-10 lg:py-8 px-4">
      <div className={cn(styles.landing, 'w-full h-full rounded-4xl bg-cover')}>
        <div
          className={cn(
            'w-full h-full flex items-center justify-center',
            'rounded-4xl bg-cover',
            'flex-col gap-12 px-10 py-20 md:px-12 md:py-8',
            'tablet-lg:px-10 tablet-lg:py-12',
            'laptop:px-14 laptop:py-16',
            'laptop-lg:p-0',
            'lg:flex-row lg:gap-0 rotate-180'
          )}
        >
          <motion.div
            ref={ref}
            style={{ y: smoothY }}
            className={cn(
              'flex flex-col gap-5 tablet-lg:gap-6 laptop:gap-6 laptop-lg:gap-7',
              'pt-8 lg:pt-0',
              'lg:px-14 laptop:px-16 laptop-lg:px-18 desktop:px-21',
              'xs:text-center items-center lg:items-start'
            )}
          >
            <h1 className="text-4xl tablet-lg:text-5xl laptop:text-6xl desktop:text-7xl font-bold mt-8 lg:mt-0 mb-5 tablet-lg:mb-6">
              Comunicar también es crear 🎙️
            </h1>
            <p className="text-base tablet-lg:text-lg laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl mb-4">
              Nuestro canal de YouTube es el espacio donde la tecnología se convierte en
              conversación. Allí analizamos, probamos y compartimos ideas que despiertan curiosidad.
            </p>
            <p className="text-base tablet-lg:text-lg laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl">
              Hacemos apps, sí. Pero también encendemos la cámara. Nuestro canal de YouTube es donde
              la tecnología deja de ser un concepto y se convierte en charla, en reacción, en
              comunidad.
            </p>
          </motion.div>
          <div className="w-1/2 tablet-lg:w-1/3 laptop:w-1/4 laptop-lg:w-1/5 desktop:w-[15%]">
            <img
              src={aboutUsPhone}
              className="w-full h-auto"
              alt="Canal de YouTube de @Everyone - contenido tech y tecnología"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
