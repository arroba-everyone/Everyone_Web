import { FALLBACK_VIDEOS, useGetLatestVideos } from '@everyone-web/queries/useGetLatestVideos';
import { Card } from '@everyone-web/ui/card';
import ReactPlayer from 'react-player';
import { Button } from '@everyone-web/ui/button';
import { cn } from '@everyone-web/libs/utils';
import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useParallax } from '@everyone-web/hooks/useParallax';

export const YouTube = () => {
  const { data = FALLBACK_VIDEOS } = useGetLatestVideos();
  const { ref, smoothY } = useParallax(150, 10);

  return (
    <div className="h-screen">
      <Card className="h-full bg-secondary text-background mx-4 tablet-lg:mx-5">
        <div
          className={cn(
            'grid h-full align-middle',
            'grid-cols-4 lg:grid-cols-24',
            'gap-4 tablet-lg:gap-5',
            'p-6 tablet-lg:p-7 laptop:p-8'
          )}
        >
          <div
            className={cn(
              'grid grid-rows-2 col-span-4',
              'order-3 lg:order-1 lg:px-5',
              'gap-6 tablet-lg:gap-7 laptop:gap-8'
            )}
          >
            {data.map(videoId => (
              <div key={videoId} className="row-span-1">
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
          <motion.div
            ref={ref}
            style={{ y: smoothY }}
            className={cn(
              'col-span-12 flex flex-col justify-center',
              'order-1 lg:order-3',
              'gap-6 tablet-lg:gap-7 laptop:gap-8'
            )}
          >
            <p
              className={cn(
                'font-bold',
                'text-4xl tablet-lg:text-5xl laptop:text-6xl laptop-lg:text-6xl desktop:text-7xl'
              )}
            >
              Mantente al día con lo que hacemos
            </p>
            <p className="text-lg tablet-lg:text-xl laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl lg:me-50">
              Nos gusta construir, probar, contar y volver a empezar.
              <br />
              Si quieres saber en qué estamos metidos ahora, este es tu sitio.
            </p>
            <Link to="/blog">
              <Button
                size={'lg'}
                className="rounded-full transition-all hover:scale-110 cursor-pointer w-fit p-6 tablet-lg:p-7 laptop:p-8"
              >
                <span className="text-base tablet-lg:text-lg font-bold">Descubre más</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </Card>
    </div>
  );
};
