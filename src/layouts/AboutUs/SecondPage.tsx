import styles from '@everyone-web/css/index.module.css';
import ordenador from '@everyone-web/assets/ordenador.png';
import { cn } from '@everyone-web/libs/utils';

export const SecondPage = () => {
  return (
    <div className="w-full lg:h-screen py-10 lg:py-8 px-4">
      <div
        className={cn(
          'w-full h-full flex items-center justify-center',
          'rounded-4xl bg-cover',
          'flex-col gap-12 px-10 py-20 md:px-12 md:py-8 lg:p-0',
          'lg:flex-row lg:gap-0',
          styles.landing
        )}
      >
        <div
          className={cn(
            `flex flex-col gap-7 pt-8 lg:pt-0 lg:px-21 xs:text-center items-center lg:items-start`
          )}
        >
          <h1 className="text-5xl lg:text-7xl font-bold mt-8 lg:mt-0 mb-6">
            Comunicar también es crear 🎙️
          </h1>
          <p className="text-lg lg:text-4xl mb-4">
            Nuestro canal de YouTube es el espacio donde la tecnología se convierte en conversación.
            Allí analizamos, probamos y compartimos ideas que despiertan curiosidad.
          </p>
          <p className="text-lg lg:text-4xl">
            Hacemos apps, sí. Pero también encendemos la cámara. Nuestro canal de YouTube es donde
            la tecnología deja de ser un concepto y se convierte en charla, en reacción, en
            comunidad.
          </p>
        </div>
        <img src={ordenador} className="w-3/4 lg:w-auto h-auto" alt="" />
      </div>
    </div>
  );
};
