import { Card } from '../../ui/card';
import { Icon } from '@everyone-web/ui/Icon/Icon';

export const Footer = () => {
  return (
    <footer className="mx-4 my-8">
      <Card className="bg-primary text-primary-foreground w-full flex flex-col gap-13 justify-between items-center">
        <p className="text-center font-bold text-2xl">@everyone</p>

        <div className="flex items-center gap-16 lg:gap-24">
          <Icon name="instagram" className={'size-8'} />
          <Icon name="youtube" className={'size-8'} />
          <Icon name="twitch" className={'size-8'} />
          <Icon name="github" className={'size-8'} />
        </div>

        <div className="flex flex-col gap-2 items-center">
          <p className="text-center">Política de privacidad</p>
          <p className="text-center">Uso de cookies</p>
          <p className="text-center font-bold">@everyone 2025 ©. Todos los derechos reservados</p>
        </div>
      </Card>
    </footer>
  );
};
