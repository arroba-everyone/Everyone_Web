import * as React from 'react';

import { cn } from '@everyone-web/libs/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base — soft rounded square (pill textarea looks weird), app-aligned
        // tokens. No `--input` tint, no `--muted-foreground` placeholder.
        'flex field-sizing-content min-h-24 w-full rounded-2xl border border-foreground/15 bg-background px-5 py-3',
        'text-sm md:text-sm text-foreground placeholder:text-foreground/40',
        'transition-[color,border-color,box-shadow] outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-primary/50 focus-visible:ring-primary/30 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
