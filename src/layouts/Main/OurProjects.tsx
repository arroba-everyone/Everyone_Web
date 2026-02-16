import { cn } from '@everyone-web/libs/utils';
import { Button } from '@everyone-web/ui/button';
import { Card } from '@everyone-web/ui/card';
import { Link } from '@tanstack/react-router';
import youtubePhone from '@everyone-web/assets/youtubePhone.webp';

export const OurProjects = () => {
  return (
    <div
      className={cn(
        'grid justify-items-center items-center',
        'grid-cols-1 laptop:grid-cols-2',
        'gap-5 md:gap-6 laptop:gap-8 laptop-lg:gap-9 desktop:gap-10',
        'm-6 laptop:my-0'
      )}
    >
      <Card
        className={cn(
          'bg-primary w-full col-span-1 rounded-4xl laptop:rounded-[50px]',
          'aspect-2/1 md:aspect-video laptop:aspect-square'
        )}
      >
        <img
          src={youtubePhone}
          className="z-0 tablet-lg:w-160 mx-auto mt-auto laptop:w-11/12 hidden md:block"
          alt="YouTube phone"
        />
        <div
          className={cn(
            'flex flex-col items-start gap-4 mt-6 md:mt-0',
            'ps-8 md:ps-9 laptop:ps-10',
            'pb-4 md:pb-12'
          )}
        >
          <span className={cn('text-background font-bold', 'text-4xl md:text-7xl laptop:text-9xl')}>
            YouTube
          </span>
          <span className={cn('text-background text-base md:text-3xl laptop-lg:text-4xl')}>
            Contenido tech para todos
          </span>
        </div>
      </Card>
      <div
        className={cn(
          'grid col-span-1 size-full',
          'grid-cols-1 md:grid-cols-2 laptop:grid-rows-2',
          'gap-5 md:gap-6 laptop:gap-8 laptop-lg:gap-9 desktop:gap-10'
        )}
      >
        <Card className="bg-secondary text-background rounded-4xl laptop:rounded-[50px] col-span-1 laptop:col-span-2 aspect-2/1 laptop:aspect-auto">
          <div className="flex flex-col h-full p-5 md:p-5 laptop:p-6 gap-2 sm:gap-4 laptop:gap-8">
            <span className={cn('font-bold', 'text-4xl md:text-7xl laptop:text-9xl')}>
              EveryLog
            </span>
            <div className="flex flex-col md:gap-1 laptop:gap-1 laptop-lg:gap-1.5 desktop:gap-2">
              <span className={cn('text-base md:text-3xl laptop-lg:text-4xl')}>
                Convierte lo cotidiano en juego.
              </span>
              <span className={cn('text-base md:text-xl laptop-lg:text-2xl')}>
                Porque competir también puede ser sano y divertido.
              </span>
            </div>
          </div>
        </Card>
        <Card className="bg-card rounded-4xl laptop:rounded-[50px] col-span-1 laptop:col-span-2 aspect-square md:aspect-2/1 laptop:aspect-auto">
          <div className="flex flex-col h-full justify-between p-5 md:p-5 laptop:p-6">
            <div className="flex flex-col gap-3 md:gap-4 laptop:gap-8 laptop-lg:gap-12 desktop:gap-15">
              <span className="font-bold text-3xl md:text-5xl laptop:text-7xl">
                Y ahora... Toca crear
              </span>
              <span className="text-base md:text-3xl laptop-lg:text-4xl">
                De hablar de tecnología a diseñarla.
              </span>
            </div>
            <Link to="/projects">
              <Button
                size={'lg'}
                className="rounded-full transition-all hover:scale-110 cursor-pointer w-fit md:p-6 laptop:p-7 laptop-lg:p-7 desktop:p-8"
              >
                <span className="text-base md:text-lg laptop:text-xl">Descubre más</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
