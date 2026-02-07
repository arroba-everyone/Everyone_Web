import { cn } from '@everyone-web/libs/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@everyone-web/ui/avatar';
import type { JSX, ReactNode } from 'react';

interface IMessageProps {
  children: ReactNode;
  sender: ReactNode;
  sent?: boolean;
}

export const Message = ({ children, sender, sent = false }: IMessageProps): JSX.Element => {
  return (
    <div className={cn('flex w-full items-end gap-3', sent ? 'flex-row-reverse' : 'flex-row')}>
      <Avatar className="size-10">
        <AvatarImage src="" />
        <AvatarFallback>{sender?.toString().at(0)}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'rounded-lg flex p-5 text-foreground',
          sent ? 'bg-primary text-primary-foreground' : 'bg-secondary'
        )}
      >
        <div className="text-base font-normal">
          <p className="font-bold">{sender}</p>
          <p>&nbsp;</p>
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
};
