import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Card } from '@everyone-web/ui/card';
import { createFileRoute } from '@tanstack/react-router';
import movilesContacto from '@everyone-web/assets/movilesContacto.png';
import { cn } from '@everyone-web/libs/utils';

export const Route = createFileRoute('/contact')({
  component: Contact,
});

function Contact() {
  return (
    <MainLayout>
      <div
        className={cn(
          'min-h-screen bg-background items-start',
          'grid grid-cols-1 lg:grid-cols-2',
          'gap-8 md:gap-12 lg:gap-16 xl:gap-24',
          'p-6 md:p-12 lg:p-16 xl:p-30',
          'pt-28 lg:pt-32'
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'order-1 lg:order-2',
            'gap-8 md:gap-12 lg:gap-16 xl:gap-20'
          )}
        >
          <Card
            className={cn(
              'bg-secondary w-full py-8 lg:py-17',
              'rounded-[2.5rem] md:rounded-[3rem] xl:rounded-[4rem]'
            )}
          >
            <h1
              className={cn(
                'text-secondary-foreground font-bold text-center',
                'text-3xl md:text-4xl lg:text-6xl'
              )}
            >
              contacto@everyone.com
            </h1>
          </Card>
          <div className="grid grid-cols-3 gap-6 md:gap-8 xl:gap-12 w-full max-w-md">
            <div className="aspect-square bg-foreground rounded-lg md:rounded-xl" />
            <div className="aspect-square bg-foreground rounded-lg md:rounded-xl" />
            <div className="aspect-square bg-foreground rounded-lg md:rounded-xl" />
          </div>
        </div>

        <Card className="bg-primary rounded-[2.5rem] md:rounded-[3rem] xl:rounded-[4rem] overflow-hidden w-full aspect-square order-2 lg:order-1">
          <img
            src={movilesContacto}
            alt="Contact Us"
            className="w-full h-full object-contain p-8 md:p-12 xl:p-16"
          />
        </Card>
      </div>
    </MainLayout>
  );
}
