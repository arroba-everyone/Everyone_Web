import { FALLBACK_VIDEOS, useGetLatestVideos } from '@everyone-web/queries/useGetLatestVideos';
import { Card } from '@everyone-web/ui/card';
import ReactPlayer from 'react-player';
import { Button } from '@everyone-web/ui/button';

export const YouTube = () => {
  const { data = FALLBACK_VIDEOS } = useGetLatestVideos();

  return (
    <div className="h-screen">
      <Card className="h-full bg-secondary mx-5">
        <div className="h-full grid grid-cols-4 lg:grid-cols-24 gap-5 align-middle p-8">
          <div className="grid order-3 lg:order-1 grid-rows-2 gap-8 col-span-4 lg:px-5">
            {data.map((videoId, index) => (
              <div key={index} className="row-span-1">
                <ReactPlayer
                  src={`https://www.youtube.com/watch?v=${videoId}`}
                  className="aspect-video"
                  width={'100%'}
                  height={'100%'}
                  style={{ borderRadius: '12px', overflow: 'hidden' }}
                />
              </div>
            ))}
          </div>

          <span className="hidden lg:block order-2 col-span-8"></span>
          <div className="col-span-12 order-1 lg:order-3 flex flex-col justify-center gap-8">
            <p className="text-5xl lg:text-7xl font-bold">Mantente al día con lo que hacemos</p>
            <p className="text-xl lg:text-4xl lg:me-50">
              Nos gusta construir, probar, contar y volver a empezar.
              <br />
              Si quieres saber en qué estamos metidos ahora, este es tu sitio.
            </p>
            <Button size={'lg'} className="rounded-full w-fit p-8">
              <span className="text-lg font-bold">Descubre más</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
