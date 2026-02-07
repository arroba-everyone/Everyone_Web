import { Button } from '@everyone-web/ui/button';
import { Card } from '@everyone-web/ui/card';

export const OurProjects = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center items-center gap-5 lg:gap-10 mx-6">
      <Card className="bg-primary rounded-[70px] col-span-1 aspect-2/1 lg:aspect-square w-full">
        <span className="font-bold text-background mt-auto ps-10 pb-12 text-5xl lg:text-7xl">
          YouTube
        </span>
      </Card>
      <div className="grid col-span-1 grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 w-full h-full">
        <div className="grid col-span-2 grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">
          <Card className="bg-secondary rounded-[70px] aspect-2/1 lg:aspect-square">
            <div className="flex flex-col h-full p-6 justify-between">
              <span className="text-foreground text-lg lg:text-4xl">
                Una idea en evolución. Pronto entenderás por qué se llama así. 🦦
              </span>
              <span className="font-bold mt-auto lg:ps-6 text-3xl lg:text-7xl">NutrIA</span>
            </div>
          </Card>
          <Card className="bg-primary rounded-[70px] col-span-1 aspect-2/1 lg:aspect-square">
            <div className="flex flex-col h-full p-6 justify-between">
              <div className="flex flex-col lg:gap-2">
                <span className="text-background text-lg lg:text-3xl">
                  Convierte lo cotidiano en juego.
                </span>
                <span className="text-background text-lg lg:text-3xl">
                  Porque competir también puede ser sano (y divertido).
                </span>
              </div>
              <span className="font-bold mt-auto lg:ps-6 text-3xl lg:text-7xl text-background">
                EveryLog
              </span>
            </div>
          </Card>
        </div>
        <Card className="bg-background rounded-[70px] col-span-2 aspect-square lg:aspect-2/1">
          <div className="flex flex-col h-full justify-between p-6">
            <div className="flex flex-col gap-4 lg:gap-15">
              <span className="font-bold text-xl lg:text-4xl">Y ahora... Toca crear</span>
              <span className="font-bold text-xl lg:text-4xl">
                De hablar de tecnología a diseñarla.
              </span>
            </div>
            <Button size={'lg'} className="rounded-full w-fit lg:p-8">
              <span className="text-xl">Descubre más</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
