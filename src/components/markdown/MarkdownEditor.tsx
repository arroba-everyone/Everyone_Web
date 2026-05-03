import { Textarea } from '@everyone-web/ui/textarea';
import { cn } from '@everyone-web/libs/utils';
import { MarkdownPreview } from './MarkdownPreview';

interface MarkdownEditorProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Controlled markdown editor with a live side-by-side preview.
 *
 * Layout: flex-col on mobile, flex-row on desktop (md+).
 * Left: monospace textarea for editing.
 * Right: sticky MarkdownPreview with the same pipeline as the public blog.
 */
export function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  return (
    <div className={cn('flex flex-col md:flex-row gap-4', className)}>
      {/* Editor pane */}
      <div className="md:flex-1">
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? 'Escribe el contenido en markdown...'}
          className="min-h-[60vh] font-mono text-sm resize-none"
          aria-label="Editor de markdown"
        />
      </div>

      {/* Preview pane */}
      <div className="md:flex-1 md:sticky md:top-4 md:max-h-[80vh] overflow-auto rounded-md border border-border bg-muted/20 p-4">
        <div data-testid="markdown-preview">
          <MarkdownPreview content={value} />
        </div>
      </div>
    </div>
  );
}
