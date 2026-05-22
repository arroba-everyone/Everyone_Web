import * as React from 'react';

import { cn } from '@everyone-web/libs/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base — pill shape, app-aligned tokens (no `--input` tint, no
        // `--muted-foreground` placeholder which is full white in this theme).
        'h-11 w-full min-w-0 rounded-full border border-foreground/15 bg-background px-5 py-2',
        'text-sm md:text-sm text-foreground placeholder:text-foreground/40',
        'transition-[color,border-color,box-shadow] outline-none',
        'selection:bg-primary selection:text-primary-foreground',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-primary/50 focus-visible:ring-primary/30 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  );
}

export { Input };
