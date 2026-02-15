import { cn } from '@everyone-web/libs/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@everyone-web/ui/avatar';
import { motion } from 'motion/react';
import type { JSX, ReactNode } from 'react';

interface IMessageProps {
  imageUrl?: string;
  children: ReactNode;
  sender: ReactNode;
  sent?: boolean;
}

export const Message = ({
  children,
  sender,
  sent = false,
  imageUrl,
}: IMessageProps): JSX.Element => {
  const xOffset = sent ? 50 : -50;

  return (
    <motion.div
      className={cn('flex w-full items-start gap-3', sent ? 'flex-row-reverse' : 'flex-row')}
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.1, margin: '0px 0px -50px 0px' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <Avatar className="size-10 mt-3">
        <AvatarImage src={imageUrl} />
        <AvatarFallback>{sender?.toString().at(0)}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'rounded-lg flex p-5 text-foreground w-10/12',
          sent ? 'bg-primary text-primary-foreground' : 'bg-secondary text-background'
        )}
      >
        <div className="text-base font-normal">
          <p className={cn('font-bold', sent ? 'text-end' : 'text-start')}>{sender}</p>
          <p>&nbsp;</p>
          <p>{children}</p>
        </div>
      </div>
    </motion.div>
  );
};
