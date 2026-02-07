import movilLanding from '@everyone-web/assets/movilLanding.png';
import { Button } from '@everyone-web/ui/button';

export const EveryLog = () => {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-center justify-items-center px-6 lg:px-12 pt-28 pb-8 lg:py-16">
      {/* Left text section */}
      <div className="flex flex-col gap-6 lg:gap-8">
        <h1 className="text-4xl lg:text-6xl font-bold">EveryLog</h1>
        <p className="text-lg lg:text-4xl leading-relaxed">
          Hay cosas que hacemos todos los días sin pensarlo 📱: un paseo, una tarea, un logro
          pequeño. Everilog las convierte en algo más, en una forma nueva de mirar lo cotidiano.
        </p>
        <p className="text-lg lg:text-4xl leading-relaxed">
          No se trata de ganar, sino de compartir 💬. De disfrutar del progreso, de celebrar cada
          paso y descubrir que competir también puede ser sano, divertido y hasta motivador.
        </p>
      </div>

      {/* Center phone image */}
      <div className="flex items-center justify-center">
        <img src={movilLanding} alt="EveryLog app" className="w-75 object-contain lg:w-112.5" />
      </div>

      {/* Right text section */}
      <div className="flex flex-col gap-6 lg:gap-8 justify-self-start max-w-xl">
        <p className="text-lg lg:text-4xl leading-relaxed">
          Porque al final, las pequeñas cosas también cuentan. Y con Everylog, contarlas puede ser
          parte del juego. 🎯
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
