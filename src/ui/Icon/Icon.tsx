import type { IBaseComponent } from '@everyone-web/types/global';
import {
  AiFillBug,
  AiOutlineGithub,
  AiOutlineInstagram,
  AiOutlineTwitch,
  AiOutlineYoutube,
} from 'react-icons/ai';
import type { IconBaseProps, IconType } from 'react-icons/lib';

export type IconNames = 'youtube' | 'instagram' | 'twitch' | 'github';

interface IIcon extends IconBaseProps {
  name: IconNames;
}

const icons: Record<IconNames, IconType> = {
  youtube: AiOutlineYoutube,
  instagram: AiOutlineInstagram,
  twitch: AiOutlineTwitch,
  github: AiOutlineGithub,
};

export const Icon: IBaseComponent<IIcon> = ({ name, cursor = 'currentColor', style, ...props }) => {
  const IconComponent = icons[name];

  return (
    <>
      {IconComponent
        ? IconComponent({ ...props, cursor, style: { ...style, margin: 'auto 0' } })
        : AiFillBug({ color: 'red' })}
    </>
  );
};
