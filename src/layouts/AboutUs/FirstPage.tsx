import juanWorking from '@everyone-web/assets/juanWorking.webp';
import { cn } from '@everyone-web/libs/utils';
import { motion } from 'motion/react';
import { useParallax } from '@everyone-web/hooks/useParallax';

export const FirstPage = () => {
  const { ref, smoothY } = useParallax();

  return (
    <div className={cn('flex justify-center items-center')}>
      <div className="h-screen grid grid-cols-1 md:grid-cols-2 gap-4 px-10">
        <div
          ref={ref}
          className="order-2 m-auto rounded-4xl laptop:rounded-[50px] lg:order-1 desktop:scale-150"
        >
          <img
            src={juanWorking}
            className="rounded-4xl"
            alt="Equipo @Everyone trabajando en el estudio"
          />
        </div>
        <motion.div
          ref={ref}
          style={{ y: smoothY }}
          className="flex flex-col justify-center order-1 lg:order-2 px-4"
        >
          <h1
            className={cn(
              'text-foreground font-bold',
              'text-4xl tablet-lg:text-5xl laptop:text-6xl laptop-lg:text-6xl desktop:text-7xl',
              'mt-8 lg:mt-0 mb-5 tablet-lg:mb-6'
            )}
          >
            Creamos experiencias que conectan personas
          </h1>
          <p className="text-xl tablet-lg:text-2xl laptop:text-3xl laptop-lg:text-3xl desktop:text-4xl mb-4">
            Somos un estudio donde la creatividad y la tecnología trabajan codo con codo. Creamos
            apps, experiencias digitales y contenido que reflejan cómo entendemos el futuro:
            funcional, humano y con diseño en cada línea de código.
          </p>
          <p className="text-xl tablet-lg:text-2xl laptop:text-3xl laptop-lg:text-3xl desktop:text-4xl">
            Nos gusta pensar que lo que hacemos va más allá de lo técnico. Queremos demostrar que
            detrás de cada proyecto hay personas con ideas, valores y una buena playlist de fondo.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
