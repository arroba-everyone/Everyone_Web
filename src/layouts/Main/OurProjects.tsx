import { Button } from '@everyone-web/ui/button';
import { Card } from '@everyone-web/ui/card';

export const OurProjects = () => {
  return (
    <div className="grid grid-cols-1 tablet-lg:grid-cols-2 justify-items-center items-center gap-5 tablet-lg:gap-6 laptop:gap-8 laptop-lg:gap-9 desktop:gap-10 mx-6">
      <Card className="bg-primary rounded-[70px] col-span-1 aspect-2/1 tablet-lg:aspect-square w-full">
        <span className="font-bold text-background mt-auto ps-8 tablet-lg:ps-9 laptop:ps-10 pb-10 tablet-lg:pb-11 laptop:pb-12 text-4xl tablet-lg:text-5xl laptop:text-6xl laptop-lg:text-6xl desktop:text-7xl">
          YouTube
        </span>
      </Card>
      <div className="grid col-span-1 grid-cols-1 tablet-lg:grid-cols-2 gap-5 tablet-lg:gap-6 laptop:gap-8 laptop-lg:gap-9 desktop:gap-10 w-full h-full">
        <div className="grid col-span-2 grid-cols-1 tablet-lg:grid-cols-2 gap-5 tablet-lg:gap-6 laptop:gap-8 laptop-lg:gap-9 desktop:gap-10">
          <Card className="bg-secondary rounded-[70px] aspect-2/1 tablet-lg:aspect-square">
            <div className="flex flex-col h-full p-5 tablet-lg:p-5 laptop:p-6 justify-between">
              <span className="text-foreground text-base tablet-lg:text-lg laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl">
                Una idea en evolución. Pronto entenderás por qué se llama así. 🦦
              </span>
              <span className="font-bold mt-auto tablet-lg:ps-4 laptop:ps-5 laptop-lg:ps-5 desktop:ps-6 text-2xl tablet-lg:text-3xl laptop:text-5xl laptop-lg:text-6xl desktop:text-7xl">NutrIA</span>
            </div>
          </Card>
          <Card className="bg-primary rounded-[70px] col-span-1 aspect-2/1 tablet-lg:aspect-square">
            <div className="flex flex-col h-full p-5 tablet-lg:p-5 laptop:p-6 justify-between">
              <div className="flex flex-col tablet-lg:gap-1 laptop:gap-1 laptop-lg:gap-1.5 desktop:gap-2">
                <span className="text-background text-base tablet-lg:text-lg laptop:text-xl laptop-lg:text-2xl desktop:text-3xl">
                  Convierte lo cotidiano en juego.
                </span>
                <span className="text-background text-base tablet-lg:text-lg laptop:text-xl laptop-lg:text-2xl desktop:text-3xl">
                  Porque competir también puede ser sano (y divertido).
                </span>
              </div>
              <span className="font-bold mt-auto tablet-lg:ps-4 laptop:ps-5 laptop-lg:ps-5 desktop:ps-6 text-2xl tablet-lg:text-3xl laptop:text-5xl laptop-lg:text-6xl desktop:text-7xl text-background">
                EveryLog
              </span>
            </div>
          </Card>
        </div>
        <Card className="bg-background rounded-[70px] col-span-2 aspect-square tablet-lg:aspect-2/1">
          <div className="flex flex-col h-full justify-between p-5 tablet-lg:p-5 laptop:p-6">
            <div className="flex flex-col gap-3 tablet-lg:gap-4 laptop:gap-8 laptop-lg:gap-12 desktop:gap-15">
              <span className="font-bold text-lg tablet-lg:text-xl laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl">Y ahora... Toca crear</span>
              <span className="font-bold text-lg tablet-lg:text-xl laptop:text-2xl laptop-lg:text-3xl desktop:text-4xl">
                De hablar de tecnología a diseñarla.
              </span>
            </div>
            <Button size={'lg'} className="rounded-full w-fit tablet-lg:p-6 laptop:p-7 laptop-lg:p-7 desktop:p-8">
              <span className="text-base tablet-lg:text-lg laptop:text-xl">Descubre más</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
