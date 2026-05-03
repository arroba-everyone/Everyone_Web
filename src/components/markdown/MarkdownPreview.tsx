import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@everyone-web/libs/utils';
import { markdownComponents } from './markdown-components';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content using the exact same pipeline as the public blog route.
 * Uses remark-gfm + rehype-raw + shared component overrides from markdown-components.tsx.
 *
 * This guarantees WYSIWYG: what you see in the editor preview is what appears on /blog/$slug.
 */
export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div className={cn('prose max-w-none', className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {content}
      </Markdown>
    </div>
  );
}
