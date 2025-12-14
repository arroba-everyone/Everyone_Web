import type { IPost } from '@everyone-web/services/getPosts';
import type { IBaseComponent } from '@everyone-web/types/global';
import { Button } from '@everyone-web/ui/Common/Button';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { Title } from '@everyone-web/ui/Common/Typography';
import { Link } from '@tanstack/react-router';
import { Image, Space } from 'antd';

export const NewsItem: IBaseComponent<IPost> = ({
  slug,
  thumbnailUrl,
  author,
  publishedAt,
  title,
}) => {
  return (
    <Flex gap={20}>
      <Image src={thumbnailUrl} style={{ width: 480, height: 272 }} alt={title} preview={false} />
      <Flex vertical gap={36}>
        <Title level={4} style={{ margin: 0 }} color="var(--color-primary)">
          {author} - {new Date(publishedAt).toLocaleDateString()}
        </Title>
        <Link to={`/blog/$slug`} params={{ slug }}>
          <Title level={2}>{title}</Title>
        </Link>
        <Space>
          <Link to={`/blog/$slug`} params={{ slug }}>
            <Button type="link">{'Ver más ->'}</Button>
          </Link>
        </Space>
      </Flex>
    </Flex>
  );
};
