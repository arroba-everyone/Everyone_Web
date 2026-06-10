import { NewsItem } from '@everyone-web/components/Blog/NewsItem';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { getPublishedPostsFn } from '@everyone-web/services/posts';
import { Skeleton } from '@everyone-web/ui/skeleton';
import { createFileRoute } from '@tanstack/react-router';
import type { IPost } from '@everyone-web/components/Blog/NewsItem';

export const Route = createFileRoute('/blog/')({
  loader: async () => {
    const posts = await getPublishedPostsFn();
    // Map Supabase snake_case Post rows to IPost camelCase shape
    return posts.map(
      (p): IPost => ({
        id: p.id,
        author: p.author,
        publishedAt: p.published_at ?? '',
        title: p.title,
        slug: p.slug,
        thumbnailUrl: p.thumbnail_url ?? '',
      })
    );
  },
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
      {
        name: 'keywords',
        content:
          'blog tecnología, artículos tech, desarrollo de apps, contenido tecnológico, noticias tech, programación, diseño digital, @Everyone blog',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://arrobaeveryone.com/blog' }],
  }),
  component: Blog,
});

function Blog() {
  const posts = Route.useLoaderData();

  return (
    <MainLayout tone="light">
      <div className="theme-light bg-cream flex justify-center w-full pt-32 md:pt-36 laptop:pt-40 px-4 pb-16 min-h-screen">
        <div className="flex flex-col gap-12 md:gap-14 laptop:gap-16 max-w-7xl w-full">
          <div className="flex flex-col items-start gap-3">
            <span className="rounded-full bg-grape-tint text-grape-deep px-4 py-1.5 text-sm font-bold">
              Blog
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink">
              Lo que contamos
            </h1>
          </div>
          {posts.length === 0 ? (
            // Skeleton placeholder while posts load (SSR provides them immediately,
            // this only shows during client-side navigation before data resolves)
            <div className="flex flex-col gap-12 md:gap-14 laptop:gap-16">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-6 md:gap-7 laptop:gap-8 w-full"
                >
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
          ) : (
            posts.map((post, index) => <NewsItem key={index} {...post} />)
          )}
        </div>
      </div>
    </MainLayout>
  );
}

