import { cn } from '@everyone-web/libs/utils';
import { Card } from '../../ui/card';
import { Icon } from '@everyone-web/ui/Icon/Icon';

export const Footer = () => {
  return (
    <footer className="mx-4 my-6 tablet-lg:my-7 laptop:my-8">
      <Card
        className={cn(
          'w-full h-full flex flex-col justify-between items-center',
          'gap-8 tablet-lg:gap-10 laptop:gap-11 laptop-lg:gap-12 desktop:gap-13',
          'bg-primary text-primary-foreground'
        )}
      >
        <p className="text-center font-bold text-lg tablet-lg:text-xl laptop:text-xl laptop-lg:text-2xl desktop:text-3xl">
          @everyone
        </p>

        <div className="flex items-center gap-10 tablet-lg:gap-12 laptop:gap-14 laptop-lg:gap-18 desktop:gap-24">
          <a href="https://www.youtube.com/@EveryoneChannel.oficial">
            <Icon
              name="youtube"
              className="size-6 tablet-lg:size-7 laptop:size-7 laptop-lg:size-8 desktop:size-10"
            />
          </a>
          <a href="https://www.twitch.tv/arrobaeveryone">
            <Icon
              name="twitch"
              className="size-6 tablet-lg:size-7 laptop:size-7 laptop-lg:size-8 desktop:size-10"
            />
          </a>
          <a href="https://github.com/arroba-everyone">
            <Icon
              name="github"
              className="size-6 tablet-lg:size-7 laptop:size-7 laptop-lg:size-8 desktop:size-10"
            />
          </a>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <p className="text-center font-bold text-sm tablet-lg:text-sm laptop:text-base desktop:text-lg">
            @everyone 2026 ©. Todos los derechos reservados
          </p>
        </div>
      </Card>
    </footer>
  );
};
