import everyLog from '@everyone-web/assets/everyLog.webp';
import { cn } from '@everyone-web/libs/utils';
import { Button } from '@everyone-web/ui/button';

export const EveryLog = () => {
  return (
    <div
      className={cn(
        'w-full min-h-screen grid',
        'grid-cols-1 lg:grid-cols-[1fr_auto_1fr] desktop:grid-cols-[3fr_auto_2fr]',
        'gap-8 tablet-lg:gap-10 laptop:gap-11 laptop-lg:gap-12',
        'items-center justify-items-center',
        'px-6 tablet-lg:px-8 laptop:px-10 laptop-lg:px-12',
        'pt-28 pb-8 lg:py-16'
      )}
    >
      {/* Left text section */}
      <div className="flex flex-col gap-5 tablet-lg:gap-6 laptop:gap-7 laptop-lg:gap-8">
        <h1 className="text-3xl tablet-lg:text-4xl laptop:text-5xl laptop-lg:text-6xl font-bold">
          EveryLog
        </h1>
        <p className="text-base tablet-lg:text-lg laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl leading-relaxed">
          Hay cosas que hacemos todos los días sin pensarlo 📱: un paseo, una tarea, un logro
          pequeño. EveryLog las convierte en algo más, en una forma nueva de mirar lo cotidiano.
        </p>
        <p className="text-base tablet-lg:text-lg laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl leading-relaxed">
          No se trata de ganar, sino de compartir 💬. De disfrutar del progreso, de celebrar cada
          paso y descubrir que competir también puede ser sano, divertido y hasta motivador.
        </p>
      </div>

      {/* Center phone image */}
      <div className="flex items-center justify-center">
        <img
          src={everyLog}
          alt="EveryLog app"
          className="w-75 tablet-lg:w-82 laptop:w-90 laptop-lg:w-100 desktop:w-112.5 object-contain"
        />
      </div>

      {/* Right text section */}
      <div className="flex flex-col gap-5 tablet-lg:gap-6 laptop:gap-7 laptop-lg:gap-8 justify-self-start max-w-xl">
        <p className="text-base tablet-lg:text-lg laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl leading-relaxed">
          Porque al final, las pequeñas cosas también cuentan. Y con EveryLog, contarlas puede ser
          parte del juego. 🎯
        </p>
        <div className="flex gap-5 tablet-lg:gap-5 laptop:gap-6">
          <Button
            variant="outline"
            className="w-20 h-20 text-6xl tablet-lg:w-21 tablet-lg:h-21 laptop:w-22 laptop-lg:w-24 laptop-lg:h-24 border-none rounded-xl bg-card!"
            aria-label="Download on App Store"
          >
            ⚒️
          </Button>
          <Button
            variant="outline"
            className="w-20 h-20 text-6xl tablet-lg:w-21 tablet-lg:h-21 laptop:w-22 laptop-lg:w-24 laptop-lg:h-24 border-none rounded-xl bg-card!"
            aria-label="Download on App Store"
          >
            ⚒️
          </Button>
        </div>
      </div>
    </div>
  );
};
