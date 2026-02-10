import { NewsItem } from '@everyone-web/components/Blog/NewsItem';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { getFiles } from '@everyone-web/services/getFiles';
import { useGetPosts } from '@everyone-web/services/getPosts';
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
      { property: 'og:url', content: 'https://everyone.com/blog' },
      { property: 'og:image', content: 'https://everyone.com/logo512.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: 'Blog - @Everyone' },
      {
        name: 'twitter:description',
        content:
          'Artículos sobre tecnología, desarrollo de apps y contenido tech para humanos normales.',
      },
      { name: 'twitter:image', content: 'https://everyone.com/logo512.png' },
    ],
    links: [{ rel: 'canonical', href: 'https://everyone.com/blog' }],
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
        <div className="pt-32 md:pt-36 laptop:pt-40 px-4">Loading...</div>
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
