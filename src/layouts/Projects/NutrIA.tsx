import mysteryPhone from '@everyone-web/assets/mysteryPhone.png';
import { cn } from '@everyone-web/libs/utils';
import { Button } from '@everyone-web/ui/button';

export const NutrIA = () => {
  return (
    <div
      className={cn(
        'w-full min-h-screen grid',
        'grid-cols-1 lg:grid-cols-[1fr_auto_1fr]',
        'gap-8 tablet-lg:gap-10 laptop:gap-11 laptop-lg:gap-12',
        'items-center justify-items-center',
        'px-6 tablet-lg:px-8 laptop:px-10 laptop-lg:px-12',
        'pt-8 lg:py-16'
      )}
    >
      {/* Right text section - main info (first on mobile) */}
      <div
        className={cn(
          'flex flex-col text-left justify-self-start max-w-xl',
          'gap-5 tablet-lg:gap-6 laptop:gap-7 laptop-lg:gap-8',
          'order-1 lg:order-3'
        )}
      >
        <h1 className="text-3xl tablet-lg:text-4xl laptop:text-5xl laptop-lg:text-6xl font-bold">
          NutrIA
        </h1>
        <p className="text-base tablet-lg:text-lg laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl leading-relaxed">
          Estamos trabajando en algo nuevo 💡. Algo pequeño por fuera, pero con mucho detrás. Un
          proyecto que mezcla calma, curiosidad y tecnología con propósito.
        </p>
        <p className="text-base tablet-lg:text-lg laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl leading-relaxed">
          Aún no podemos contarte de qué va 🤫 (y créenos, nos cuesta guardar el secreto). Pero sí
          podemos decir que va de conectar, de simplificar y de disfrutar más, no de hacer más.
        </p>
      </div>

      {/* Center phone image (second on mobile) */}
      <div className="flex items-center justify-center order-2">
        <img
          src={mysteryPhone}
          alt="NutrIA app"
          className="w-75 tablet-lg:w-82 laptop:w-90 laptop-lg:w-100 desktop:w-112.5 object-contain"
        />
      </div>

      {/* Left text section - teaser (third on mobile) */}
      <div className="flex flex-col gap-5 tablet-lg:gap-6 laptop:gap-7 laptop-lg:gap-8 justify-self-end max-w-xl order-3 lg:order-1">
        <p className="text-base tablet-lg:text-lg laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl leading-relaxed">
          Por ahora solo diremos esto 🦦: el nombre no es casualidad. Y si te intriga… es buena
          señal.
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
