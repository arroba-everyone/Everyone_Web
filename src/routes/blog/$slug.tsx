import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { MarkdownPreview } from '@everyone-web/components/markdown/MarkdownPreview';
import { getPostBySlugFn } from '@everyone-web/services/posts';
import { createFileRoute } from '@tanstack/react-router';
import { motion, useScroll } from 'motion/react';

function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~`>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 155);
}

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => getPostBySlugFn({ data: params.slug }),
  head: ({ loaderData }) => {
    const title = loaderData?.title ? `${loaderData.title} - @Everyone Blog` : 'Blog - @Everyone';
    const description = loaderData?.markdown
      ? stripMarkdown(loaderData.markdown)
      : 'Artículos sobre tecnología, desarrollo de apps y contenido tech.';
    const image = loaderData?.thumbnailUrl || 'https://arrobaeveryone.com/logo512.png';
    const url = `https://arrobaeveryone.com/blog/${loaderData?.slug || ''}`;

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:image', content: image },
        { property: 'og:type', content: 'article' },

        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
        {
          name: 'keywords',
          content:
            'blog tecnología, artículo tech, desarrollo, programación, @Everyone, contenido tecnológico',
        },
      ],
      links: [{ rel: 'canonical', href: url }],
      scripts: loaderData
        ? [
            {
              type: 'application/ld+json',
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: loaderData.title,
                description,
                image,
                url,
                author: {
                  '@type': 'Person',
                  name: loaderData.author,
                },
                datePublished: loaderData.publishedAt,
                publisher: {
                  '@type': 'Organization',
                  name: '@Everyone',
                },
              }),
            },
          ]
        : [],
    };
  },
  component: BlogPost,
});

function Progress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="bg-primary fixed top-0 left-0 right-0 origin-left h-1"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <MainLayout>
      <Progress />
      <div className="flex flex-col justify-center items-center px-4 py-12 md:py-20 mt-20 lg:mt-12">
        <div className="w-full max-w-4xl">
          <MarkdownPreview content={post.markdown} />
        </div>
      </div>
    </MainLayout>
  );
}
