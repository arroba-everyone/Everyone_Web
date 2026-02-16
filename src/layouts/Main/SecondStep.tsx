import creating from '@everyone-web/assets/creating.webp';
import { cn } from '@everyone-web/libs/utils';
import { Button } from '@everyone-web/ui/button';
import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useParallax } from '@everyone-web/hooks/useParallax';

export const SecondStep = () => {
  const { ref, smoothY } = useParallax(150, 70);

  return (
    <div className={cn('w-full h-screen grid grid-cols-1 lg:grid-cols-2', 'xs:py-10 px-5')}>
      <div className="col-span-1 order-1 my-auto rounded-4xl laptop:rounded-[50px]">
        <img
          src={creating}
          alt="Creamos tecnología que se siente humana"
          className="max-w-full max-h-full rounded-4xl object-contain mx-auto"
        />
      </div>

      <motion.div
        ref={ref}
        style={{ y: smoothY }}
        className={cn(
          'col-span-1 mx-8 tablet-lg:mx-8 laptop:mx-10',
          'justify-center items-center lg:items-start',
          'lg:me-14 laptop:me-16 laptop-lg:me-18 desktop:me-20',
          'flex flex-col gap-4 tablet-lg:gap-5 laptop:gap-5 laptop-lg:gap-6',
          'order-2'
        )}
      >
        <h2
          className={cn(
            'font-bold desktop:me-25',
            'text-2xl md:text-4xl tablet-lg:text-4xl laptop:text-5xl laptop-lg:text-6xl desktop:text-7xl',
            'text-center lg:text-left'
          )}
        >
          Creamos tecnología que se siente humana.
        </h2>
        <p
          className={cn(
            'text-base md:text-lg tablet-lg:text-xl laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl',
            'leading-relaxed'
          )}
        >
          En @Everyone creemos que la tecnología no tiene por qué ser complicada ni distante.
          Creemos en crear cosas que sumen, que inspiren, que mejoren el día a día sin distraerte
          del mundo real.
        </p>

        <p
          className={cn(
            'text-base md:text-lg tablet-lg:text-xl laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl',
            'leading-relaxed'
          )}
        >
          Somos un equipo joven que diseña apps, proyectos y contenido con una idea clara: hacer que
          la innovación se sienta humana, honesta y accesible. Sin tecnicismos. Sin filtros. Sin
          postureo.
        </p>

        <Link to="/aboutUs">
          <Button
            size={'lg'}
            className="rounded-full transition-all hover:scale-110 cursor-pointer w-fit"
          >
            Descubre más
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
