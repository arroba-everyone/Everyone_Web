// Shared markdown component overrides used by both MarkdownPreview and blog/$slug.tsx.
// These must be identical in both consumers to guarantee WYSIWYG behavior.
//
// ESLint notes:
// - `_node` params are required by the react-markdown Components interface (destrucutred to
//   prevent unknown DOM prop spread). The underscore prefix signals intentional non-use.
// - jsx-a11y rules for heading-has-content / anchor-has-content / iframe-has-title are false
//   positives here: content and attributes arrive through the markdown AST at runtime.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/iframe-has-title */

import { Avatar, AvatarImage } from '@everyone-web/ui/avatar';
import type { Components } from 'react-markdown';

export const markdownComponents: Components = {
  h1: ({ node: _node, ...props }) => (
    <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-6" {...props} />
  ),
  h2: ({ node: _node, ...props }) => (
    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mt-8 mb-4" {...props} />
  ),
  h3: ({ node, ...props }) => {
    return node?.children.length === 1 ? (
      <h3 className="text-xl md:text-2xl font-medium text-foreground mt-6 mb-3" {...props} />
    ) : (
      <div className="flex justify-center items-center gap-4 mb-6" {...props}>
        {Array.isArray(props.children) &&
          props.children?.map((child, index) => {
            return typeof child === 'string' ? (
              <h3 key={index} className="text-lg text-foreground">
                {child}
              </h3>
            ) : (child as React.ReactElement).type === 'code' ? (
              <div key={index} className="flex items-center gap-2">
                {(child as React.ReactElement<{ children: string }>).props.children
                  .split(/(·)/)
                  .map((p: string) => p.trim())
                  .filter((p: string) => p !== '')
                  .map((c: string, i: number) => (
                    <span key={i} className="text-sm text-muted">
                      {c}
                    </span>
                  ))}
              </div>
            ) : (child as React.ReactElement<{ src?: string }>).props?.src ? (
              <Avatar key={index} size={'lg'}>
                <AvatarImage
                  {...((child as React.ReactElement<Record<string, unknown>>)
                    .props as React.ComponentPropsWithRef<typeof AvatarImage>)}
                />
              </Avatar>
            ) : (
              child
            );
          })}
      </div>
    );
  },
  h4: ({ node: _node, ...props }) => {
    const text = props.children?.toString() || '';
    if (text.includes('Timestamps:') || text.includes('Tags:')) {
      return (
        <h4 className="text-lg md:text-xl font-semibold text-foreground mt-8 mb-4" {...props} />
      );
    }
    return <h4 className="text-lg font-medium text-foreground mt-4 mb-2" {...props} />;
  },
  p: ({ node: _node, ...props }) => {
    const text = props.children?.toString() || '';
    if (/\d{2}:\d{2}/.test(text)) {
      return <p className="text-sm text-foreground leading-relaxed mb-1" {...props} />;
    }
    return <p className="text-base text-foreground leading-relaxed mb-4" {...props} />;
  },
  a: ({ node: _node, ...props }) => {
    const text = props.children?.toString() || '';
    if (text.startsWith('#')) {
      return <a className="text-sm text-primary font-medium mr-2 hover:underline" {...props} />;
    }
    return <a className="underline text-primary hover:no-underline" {...props} />;
  },
  ul: ({ node: _node, ...props }) => (
    <ul
      className="list-disc pl-6 space-y-1 mb-4 marker:text-primary"
      {...props}
    />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol
      className="list-decimal pl-6 space-y-1 mb-4 marker:text-primary marker:font-semibold"
      {...props}
    />
  ),
  li: ({ node: _node, ...props }) => <li className="text-base text-foreground" {...props} />,
  img: ({ node: _node, ...props }) => (
    <div className="my-8">
      <img
        className="w-full h-auto rounded-lg"
        style={{ maxWidth: '100%', objectFit: 'cover' }}
        {...props}
        alt={props.alt ?? ''}
      />
    </div>
  ),
  iframe: ({ node: _node, ...props }) => (
    <div className="my-8 w-full max-w-3xl mx-auto aspect-video">
      <iframe
        {...props}
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  ),
  hr: ({ node: _node, ...props }) => (
    <hr className="border-t border-foreground w-full my-8" {...props} />
  ),
};
