import movilesSeccion2 from '@everyone-web/assets/movilesSeccion2.png';
import { cn } from '@everyone-web/libs/utils';
import { Button } from '@everyone-web/ui/button';

export const SecondStep = () => {
  return (
    <div
      className={cn(
        'w-full h-full grid grid-cols-1 lg:grid-cols-2',
        'xs:py-10 xs:px-5',
        'md:py-16 md:px-10',
        'lg:py-31 lg:px-0'
      )}
    >
      <img
        src={movilesSeccion2}
        alt="Móviles sección 2"
        className={cn('col-span-1 lg:col-span-1 order-2 lg:order-1 w-fit h-fit')}
      />

      <div
        className={`col-span-1 mx-8 items-center lg:items-start lg:me-20 flex flex-col gap-6 order-1 lg:order-2`}
      >
        <h2
          className={cn(
            'font-bold lg:me-25',
            'text-2xl md:text-4xl lg:text-7xl',
            'text-center lg:text-left'
          )}
        >
          Creamos tecnología que se siente humana.
        </h2>
        <p className={cn('text-base md:text-lg lg:text-4xl', 'leading-relaxed')}>
          En @Everyone creemos que la tecnología no tiene por qué ser complicada ni distante.
          Creemos en crear cosas que sumen, que inspiren, que mejoren el día a día sin distraerte
          del mundo real.
        </p>

        <p className={cn('text-base md:text-lg lg:text-4xl', 'leading-relaxed')}>
          Somos un equipo joven que diseña apps, proyectos y contenido con una idea clara: hacer que
          la innovación se sienta humana, honesta y accesible. Sin tecnicismos. Sin filtros. Sin
          postureo.
        </p>

        <Button size={'lg'} className="rounded-full w-fit">
          Descubre más
        </Button>
      </div>
    </div>
  );
};
