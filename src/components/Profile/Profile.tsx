import type { IBaseComponent } from '@everyone-web/types/global';
import { Avatar, AvatarImage } from '@everyone-web/ui/avatar';
import { Icon, type IconNames } from '@everyone-web/ui/Icon/Icon';

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
    <div
      className={`flex gap-8 md:gap-12 lg:gap-16 flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center md:items-center w-full max-w-6xl`}
    >
      <Avatar className="size-40 md:size-48 lg:size-64 shrink-0">
        <AvatarImage src={imageUrl} alt={name} />
      </Avatar>
      <div
        className={`flex flex-col gap-3 ${reverse ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} items-center text-center`}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{name}</h1>
        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-(--color-primary)">
          {position}
        </h3>
        <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl">
          {bio}
        </p>
        <div
          className={`flex gap-4 mt-2 ${reverse ? 'md:justify-end' : 'md:justify-start'} justify-center`}
        >
          {socials.map(([iconName, url], index) => {
            return (
              <div key={index} className="p-2 rounded-sm transition-colors cursor-pointer">
                <Icon
                  name={iconName as IconNames}
                  className="size-6 md:size-7 lg:size-8 transition-all duration-200 hover:text-primary hover:scale-110"
                  onClick={() => window.open(url, '_blank')}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
