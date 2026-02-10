import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { getPostBySlugFn } from '@everyone-web/services/getPostBySlug';
import { Avatar, AvatarImage } from '@everyone-web/ui/avatar';
import { createFileRoute } from '@tanstack/react-router';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    const image = loaderData?.thumbnailUrl || 'https://everyone.com/logo512.png';
    const url = `https://everyone.com/blog/${loaderData?.slug || ''}`;

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

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <MainLayout>
      <div className="flex flex-col justify-center items-center px-4 py-12 md:py-20 mt-20 lg:mt-12">
        <div className="w-full max-w-4xl">
          <Markdown
            remarkPlugins={[[remarkGfm]]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-4xl md:text-5xl font-bold text-foreground text-center mb-6"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl md:text-3xl font-semibold text-foreground mt-8 mb-4"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => {
                return node?.children.length === 1 ? (
                  <h3
                    className="text-xl md:text-2xl font-medium text-foreground mt-6 mb-3"
                    {...props}
                  />
                ) : (
                  <div className="flex justify-center items-center gap-4 mb-6" {...props}>
                    {Array.isArray(props.children) &&
                      props.children?.map((child, index) => {
                        return typeof child === 'string' ? (
                          <h3 key={index} className="text-lg text-foreground">
                            {child}
                          </h3>
                        ) : child.type === 'code' ? (
                          <div key={index} className="flex items-center gap-2">
                            {child.props.children
                              .split(/(·)/)
                              .map((p: string) => p.trim())
                              .filter((p: string) => p !== '')
                              .map((c: string, i: number) => (
                                <span key={i} className="text-sm text-muted">
                                  {c}
                                </span>
                              ))}
                          </div>
                        ) : child.props.src ? (
                          <Avatar key={index} size={'lg'}>
                            <AvatarImage {...child.props} />
                          </Avatar>
                        ) : (
                          child
                        );
                      })}
                  </div>
                );
              },
              h4: ({ node, ...props }) => {
                const text = props.children?.toString() || '';
                if (text.includes('Timestamps:') || text.includes('Tags:')) {
                  return (
                    <h4
                      className="text-lg md:text-xl font-semibold text-foreground mt-8 mb-4"
                      {...props}
                    />
                  );
                }
                return <h4 className="text-lg font-medium text-foreground mt-4 mb-2" {...props} />;
              },
              p: ({ node, ...props }) => {
                const text = props.children?.toString() || '';
                if (/\d{2}:\d{2}/.test(text)) {
                  return <p className="text-sm text-foreground leading-relaxed mb-1" {...props} />;
                }
                return <p className="text-base text-foreground leading-relaxed mb-4" {...props} />;
              },
              a: ({ node, ...props }) => {
                const text = props.children?.toString() || '';
                if (text.startsWith('#')) {
                  return (
                    <a
                      className="text-sm text-primary font-medium mr-2 hover:underline"
                      {...props}
                    />
                  );
                }
                return <a className="underline text-primary hover:no-underline" {...props} />;
              },
              ul: ({ node, ...props }) => <ul className="list-none space-y-1 mb-4" {...props} />,
              li: ({ node, ...props }) => <li className="text-sm text-foreground" {...props} />,
              img: ({ node, ...props }) => (
                <div className="my-8">
                  <img
                    className="w-full h-auto rounded-lg"
                    style={{ maxWidth: '100%', objectFit: 'cover' }}
                    {...props}
                  />
                </div>
              ),
              hr: ({ node, ...props }) => (
                <hr className="border-t border-foreground w-full my-8" {...props} />
              ),
            }}
          >
            {post.markdown}
          </Markdown>
        </div>
      </div>
    </MainLayout>
  );
}
