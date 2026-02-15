import { cn } from '@everyone-web/libs/utils';
import type { IBaseComponent } from '@everyone-web/types/global';
import { Avatar, AvatarImage } from '@everyone-web/ui/avatar';
import { Icon, type IconNames } from '@everyone-web/ui/Icon/Icon';
import { motion } from 'motion/react';

interface IProfile {
  name: string;
  imageUrl: string;
  position: string;
  bio: string;
  links: Partial<Record<IconNames, string>>;
  reverse?: boolean;
}

export const Profile: IBaseComponent<IProfile> = ({
  name,
  imageUrl,
  position,
  bio,
  links,
  reverse = false,
}) => {
  const socials = Object.entries(links);

  return (
    <motion.div
      initial={{ scale: 1 }}
      whileInView={{ scale: 1.05 }}
      viewport={{ amount: 0.9, margin: '-25% 0px -25% 0px' }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex',
        'flex-col md:flex-row items-center',
        reverse ? 'md:flex-row-reverse' : 'md:flex-row',
        'gap-8 md:gap-10 tablet-lg:gap-12 laptop:gap-14 laptop-lg:gap-16',
        'w-full max-w-6xl'
      )}
    >
      <Avatar className="size-40 md:size-48 tablet-lg:size-52 laptop:size-56 laptop-lg:size-60 desktop:size-64 shrink-0">
        <AvatarImage src={imageUrl} alt={name} />
      </Avatar>
      <div
        className={`flex flex-col gap-3 ${reverse ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} items-center text-center`}
      >
        <h1 className="text-3xl md:text-4xl laptop:text-4xl laptop-lg:text-5xl font-bold text-foreground">
          {name}
        </h1>
        <h3 className="text-lg md:text-xl laptop:text-xl laptop-lg:text-2xl font-semibold text-primary">
          {position}
        </h3>
        <p className="text-base md:text-lg laptop:text-lg laptop-lg:text-xl text-foreground leading-relaxed max-w-2xl">
          {bio}
        </p>
        <div
          className={cn(
            'flex gap-4 mt-2',
            reverse ? 'md:justify-end' : 'md:justify-start',
            'justify-center'
          )}
        >
          {socials.map(([iconName, url], index) => {
            return (
              <div key={index} className="p-2 rounded-sm transition-colors cursor-pointer">
                <Icon
                  name={iconName as IconNames}
                  className={cn(
                    'transition-all duration-200',
                    'hover:text-primary hover:scale-110',
                    'size-6 md:size-7 laptop-lg:size-8'
                  )}
                  onClick={() => window.open(url, '_blank')}
                />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
