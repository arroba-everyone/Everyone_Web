import movilLanding from '@everyone-web/assets/movilLanding.png';
import { Button } from '@everyone-web/ui/button';

export const NutrIA = () => {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-center justify-items-center px-6 lg:px-12 pt-8 lg:py-16">
      {/* Right text section - main info (first on mobile) */}
      <div className="flex flex-col gap-6 lg:gap-8 text-left justify-self-start max-w-xl order-1 lg:order-3">
        <h1 className="text-4xl lg:text-6xl font-bold">NutrIA</h1>
        <p className="text-lg lg:text-4xl leading-relaxed">
          Estamos trabajando en algo nuevo 💡. Algo pequeño por fuera, pero con mucho detrás. Un
          proyecto que mezcla calma, curiosidad y tecnología con propósito.
        </p>
        <p className="text-lg lg:text-4xl leading-relaxed">
          Aún no podemos contarte de qué va 🤫 (y créenos, nos cuesta guardar el secreto). Pero sí
          podemos decir que va de conectar, de simplificar y de disfrutar más, no de hacer más.
        </p>
      </div>

      {/* Center phone image (second on mobile) */}
      <div className="flex items-center justify-center order-2">
        <img src={movilLanding} alt="NutrIA app" className="w-75 object-contain lg:w-112.5" />
      </div>

      {/* Left text section - teaser (third on mobile) */}
      <div className="flex flex-col gap-6 lg:gap-8 justify-self-end max-w-xl order-3 lg:order-1">
        <p className="text-lg lg:text-4xl leading-relaxed">
          Por ahora solo diremos esto 🦦: el nombre no es casualidad. Y si te intriga… es buena
          señal.
        </p>
        <div className="flex gap-6">
          <Button
            variant="outline"
            className="w-20 h-20 lg:w-24 lg:h-24 bg-white hover:bg-gray-100 border-none rounded-xl"
            aria-label="Download on App Store"
          />
          <Button
            variant="outline"
            className="w-20 h-20 lg:w-24 lg:h-24 bg-white hover:bg-gray-100 border-none rounded-xl"
            aria-label="Get it on Google Play"
          />
        </div>
      </div>
    </div>
  );
};
