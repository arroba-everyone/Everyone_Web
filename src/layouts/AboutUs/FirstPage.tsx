import movilesContacto from '@everyone-web/assets/movilesContacto.png';

export const FirstPage = () => {
  return (
    <div className="flex justify-center items-center mt-18">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <img src={movilesContacto} className="order-2 lg:order-1" alt="" />
        <div className="flex flex-col justify-center order-1 lg:order-2 px-4">
          <h1 className="text-5xl lg:text-7xl font-bold mt-8 lg:mt-0 mb-6">
            Creamos experiencias que conectan personas
          </h1>
          <p className="text-2xl lg:text-4xl mb-4">
            Somos un estudio donde la creatividad y la tecnología trabajan codo con codo. Creamos
            apps, experiencias digitales y contenido que reflejan cómo entendemos el futuro:
            funcional, humano y con diseño en cada línea de código.
          </p>
          <p className="text-2xl lg:text-4xl">
            Nos gusta pensar que lo que hacemos va más allá de lo técnico. Queremos demostrar que
            detrás de cada proyecto hay personas con ideas, valores y una buena playlist de fondo.
          </p>
        </div>
      </div>
    </div>
  );
};
