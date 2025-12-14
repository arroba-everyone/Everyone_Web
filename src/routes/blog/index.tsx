import { NewsItem } from '@everyone-web/components/Blog/NewsItem';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { getFiles } from '@everyone-web/services/getFiles';
import { useGetPosts } from '@everyone-web/services/getPosts';
import { Flex } from '@everyone-web/ui/Common/Flex';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/blog/')({
  component: Blog,
});

function Blog() {
  const { data, isLoading } = useGetPosts();

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Flex justify="center" fullWidth>
          <Flex
            vertical
            gap={16}
            style={{ width: '95dvw', minHeight: '100dvh', paddingTop: '130px' }}
          >
            {data?.map((news, index) => (
              <NewsItem key={index} {...news} />
            ))}
          </Flex>
        </Flex>
      )}
    </MainLayout>
  );
}
