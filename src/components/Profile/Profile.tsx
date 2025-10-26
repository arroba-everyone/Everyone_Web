import type { IBaseComponent } from '@everyone-web/types/global';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Title } from '@everyone-web/ui/Common/Typography';
import { Icon, type IconNames } from '@everyone-web/ui/Icon/Icon';
import { Avatar } from 'antd';

interface IProfile {
  name: string;
  imageUrl: string;
  position: string;
  bio: string;
  links: Partial<Record<IconNames, string>>;
}

export const Profile: IBaseComponent<IProfile> = ({ name, imageUrl, position, bio, links }) => {
  const socials = Object.entries(links);

  return (
    <Flex gap={75} className="profile-component">
      <Avatar src={imageUrl} size={300} />
      <Flex vertical>
        <Title level={2}>{name}</Title>
        <Title color="var(--color-primary)" level={4}>
          {position}
        </Title>
        <Title level={5}>{bio}</Title>
        <Flex gap={20}>
          {socials.map(([iconName, url], index) => {
            return (
              <Icon
                key={index}
                name={iconName as IconNames}
                cursor={'pointer'}
                size={50}
                onClick={() => window.open(url, '_blank')}
              />
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};
