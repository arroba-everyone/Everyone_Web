import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Card } from '@everyone-web/ui/card';
import { createFileRoute } from '@tanstack/react-router';
import contactPhone from '@everyone-web/assets/contactPhone.webp';
import { cn } from '@everyone-web/libs/utils';
import { Icon } from '@everyone-web/ui/Icon/Icon';

export const Route = createFileRoute('/contact')({
  component: Contact,
  head: () => ({
    meta: [
      { title: 'Contacto - @Everyone' },
      {
        name: 'description',
        content:
          'Ponte en contacto con @Everyone. Escríbenos a contacto@everyone.com y hablemos de tu próximo proyecto.',
      },
      { property: 'og:title', content: 'Contacto - @Everyone' },
      {
        property: 'og:description',
        content:
          'Ponte en contacto con @Everyone. Escríbenos a contacto@everyone.com y hablemos de tu próximo proyecto.',
      },
      { property: 'og:url', content: 'https://arrobaeveryone.com/contact' },
      { property: 'og:image', content: 'https://arrobaeveryone.com/logo512.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: 'Contacto - @Everyone' },
      {
        name: 'twitter:description',
        content:
          'Ponte en contacto con @Everyone. Escríbenos a contacto@everyone.com y hablemos de tu próximo proyecto.',
      },
      { name: 'twitter:image', content: 'https://arrobaeveryone.com/logo512.png' },
    ],
    links: [{ rel: 'canonical', href: 'https://arrobaeveryone.com/contact' }],
  }),
});

function Contact() {
  return (
    <MainLayout>
      <div
        className={cn(
          'min-h-screen bg-background items-start',
          'grid grid-cols-1 lg:grid-cols-2',
          'gap-8 md:gap-10 tablet-lg:gap-12 laptop:gap-14 laptop-lg:gap-18 xl:gap-24',
          'p-6 md:p-10 tablet-lg:p-12 laptop:p-14 laptop-lg:p-20 xl:p-30',
          'pt-28 md:pt-24 tablet-lg:pt-32 laptop:pt-34 laptop-lg:pt-36 desktop:pt-38'
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'order-1 lg:order-2',
            'gap-8 md:gap-10 tablet-lg:gap-12 laptop:gap-14 laptop-lg:gap-16 xl:gap-20'
          )}
        >
          <Card
            className={cn(
              'bg-secondary w-full py-8 tablet-lg:py-10 laptop:py-12 laptop-lg:py-14 xl:py-17',
              'rounded-[2.5rem] md:rounded-[3rem] laptop:rounded-[3.5rem] xl:rounded-[4rem]'
            )}
          >
            <a href="mailto:contacto@arrobaeveryone.com">
              <h1
                className={cn(
                  'text-secondary-foreground transition-colors hover:text-background font-bold text-center',
                  'text-xl md:text-3xl laptop:text-4xl laptop-lg:text-5xl desktop:text-7xl'
                )}
              >
                contacto@arrobaeveryone.com
              </h1>
            </a>
          </Card>
          <div className="grid grid-cols-3 gap-6 md:gap-7 laptop:gap-9 laptop-lg:gap-10 xl:gap-12 desktop:gap-50 w-full max-w-md desktop:max-w-4xl">
            <a href="https://www.youtube.com/@EveryoneChannel.oficial">
              <Icon
                name="youtube"
                className="size-25 desktop:size-50 transition-all hover:scale-110 hover:text-primary"
              />
            </a>
            <a href="https://www.twitch.tv/arrobaeveryone">
              <Icon
                name="twitch"
                className="size-25 desktop:size-50 transition-all hover:scale-110 hover:text-primary"
              />
            </a>
            <a href="https://github.com/arroba-everyone">
              <Icon
                name="github"
                className="size-25 desktop:size-50 transition-all hover:scale-110 hover:text-primary"
              />
            </a>
          </div>
        </div>

        <Card
          className={cn(
            'bg-primary overflow-hidden w-full aspect-square',
            'rounded-[2.5rem] md:rounded-[3rem] laptop:rounded-[3.5rem] xl:rounded-[4rem]',
            'order-2 lg:order-1'
          )}
        >
          <img
            src={contactPhone}
            alt="Contact Us"
            className="w-full h-full object-contain p-8 md:p-10 laptop:p-12 laptop-lg:p-14 xl:p-16"
          />
        </Card>
      </div>
    </MainLayout>
  );
}
