import { NewsItem } from '@everyone-web/components/Blog/NewsItem';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { getFiles } from '@everyone-web/services/getFiles';
import { useGetPosts } from '@everyone-web/services/getPosts';
import { Skeleton } from '@everyone-web/ui/skeleton';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/blog/')({
  component: Blog,
  head: () => ({
    meta: [
      { title: 'Blog - @Everyone' },
      {
        name: 'description',
        content:
          'Artículos sobre tecnología, desarrollo de apps y contenido tech para humanos normales.',
      },
      { property: 'og:title', content: 'Blog - @Everyone' },
      {
        property: 'og:description',
        content:
          'Artículos sobre tecnología, desarrollo de apps y contenido tech para humanos normales.',
      },
      { property: 'og:url', content: 'https://arrobaeveryone.com/blog' },
      { property: 'og:image', content: 'https://arrobaeveryone.com/logo512.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: 'Blog - @Everyone' },
      {
        name: 'twitter:description',
        content:
          'Artículos sobre tecnología, desarrollo de apps y contenido tech para humanos normales.',
      },
      { name: 'twitter:image', content: 'https://arrobaeveryone.com/logo512.png' },
    ],
    links: [{ rel: 'canonical', href: 'https://arrobaeveryone.com/blog' }],
  }),
});

function Blog() {
  const { data, isLoading } = useGetPosts();

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <div className="flex justify-center w-full pt-32 md:pt-36 laptop:pt-40 px-4 pb-16">
          <div className="flex flex-col gap-12 md:gap-14 laptop:gap-16 max-w-7xl w-full">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-7 laptop:gap-8 w-full">
                <div className="w-full md:w-105 tablet-lg:w-110 laptop:w-115 laptop-lg:w-120 shrink-0">
                  <Skeleton className="w-full rounded-lg aspect-video" />
                </div>
                <div className="flex flex-col justify-between gap-4 md:gap-5 laptop:gap-6 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-8 md:h-10 laptop-lg:h-12 w-3/4" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center w-full pt-32 md:pt-36 laptop:pt-40 px-4 pb-16">
          <div className="flex flex-col gap-12 md:gap-14 laptop:gap-16 max-w-7xl w-full">
            {data?.map((news, index) => (
              <NewsItem key={index} {...news} />
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
