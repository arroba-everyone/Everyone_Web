import { Card } from '../../ui/card';
import { Icon } from '@everyone-web/ui/Icon/Icon';

export const Footer = () => {
  return (
    <footer className="mx-4 my-6 tablet-lg:my-7 laptop:my-8">
      <Card className="bg-primary text-primary-foreground w-full flex flex-col gap-8 tablet-lg:gap-10 laptop:gap-11 laptop-lg:gap-12 desktop:gap-13 justify-between items-center">
        <p className="text-center font-bold text-lg tablet-lg:text-xl laptop:text-xl laptop-lg:text-2xl">@everyone</p>

        <div className="flex items-center gap-10 tablet-lg:gap-12 laptop:gap-14 laptop-lg:gap-18 desktop:gap-24">
          <Icon name="instagram" className="size-6 tablet-lg:size-7 laptop:size-7 laptop-lg:size-8" />
          <Icon name="youtube" className="size-6 tablet-lg:size-7 laptop:size-7 laptop-lg:size-8" />
          <Icon name="twitch" className="size-6 tablet-lg:size-7 laptop:size-7 laptop-lg:size-8" />
          <Icon name="github" className="size-6 tablet-lg:size-7 laptop:size-7 laptop-lg:size-8" />
        </div>

        <div className="flex flex-col gap-2 items-center">
          <p className="text-center text-sm tablet-lg:text-sm laptop:text-base">Política de privacidad</p>
          <p className="text-center text-sm tablet-lg:text-sm laptop:text-base">Uso de cookies</p>
          <p className="text-center font-bold text-sm tablet-lg:text-sm laptop:text-base">@everyone 2025 ©. Todos los derechos reservados</p>
        </div>
      </Card>
    </footer>
  );
};
