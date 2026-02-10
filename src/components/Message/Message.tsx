import { cn } from '@everyone-web/libs/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@everyone-web/ui/avatar';
import type { JSX, ReactNode } from 'react';

interface IMessageProps {
  children: ReactNode;
  sender: ReactNode;
  sent?: boolean;
}
// TODO un piquito?
export const Message = ({ children, sender, sent = false }: IMessageProps): JSX.Element => {
  return (
    <div className={cn('flex w-full items-start gap-3', sent ? 'flex-row-reverse' : 'flex-row')}>
      <Avatar className="size-10 mt-3">
        <AvatarImage src="" />
        <AvatarFallback>{sender?.toString().at(0)}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'rounded-lg flex p-5 text-foreground w-10/12',
          sent ? 'bg-primary text-primary-foreground' : 'bg-secondary'
        )}
      >
        <div className="text-base font-normal">
          <p className={cn('font-bold', sent ? 'text-end' : 'text-start')}>{sender}</p>
          <p>&nbsp;</p>
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
};
