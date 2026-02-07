import { NewsItem } from '@everyone-web/components/Blog/NewsItem';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { getFiles } from '@everyone-web/services/getFiles';
import { useGetPosts } from '@everyone-web/services/getPosts';
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
        <div className="pt-32 md:pt-40 px-4">Loading...</div>
      ) : (
        <div className="flex justify-center w-full pt-32 md:pt-40 px-4 pb-16">
          <div className="flex flex-col gap-12 md:gap-16 max-w-7xl w-full">
            {data?.map((news, index) => (
              <NewsItem key={index} {...news} />
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
