import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '@everyone-web/libs/utils';

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'group/tabs flex gap-4 data-[orientation=horizontal]:flex-col',
        className
      )}
      {...props}
    />
  );
}

// Pill list — same language as the navbar pills and the action buttons.
const tabsListVariants = cva(
  cn(
    'group/tabs-list inline-flex w-fit items-center justify-center',
    'rounded-full bg-foreground/[.04] border border-foreground/10 p-1',
    'group-data-[orientation=horizontal]/tabs:h-11',
    'group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
    'data-[variant=line]:bg-transparent data-[variant=line]:border-0 data-[variant=line]:p-0 data-[variant=line]:rounded-none data-[variant=line]:gap-1'
  ),
  {
    variants: {
      variant: {
        default: '',
        line: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Pill button-style trigger.
        'inline-flex items-center justify-center gap-2 whitespace-nowrap',
        'rounded-full px-5 h-9 text-sm font-semibold cursor-pointer transition-colors',
        'text-foreground/60 hover:text-foreground hover:bg-foreground/5',
        // Active = primary fill, just like the navbar active pill and the
        // default Button.
        'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:hover:bg-primary',
        // Vertical orientation tweaks.
        'group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start',
        // Line variant: text underline only, no pill bg.
        'group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:px-3',
        'group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:text-primary',
        'group-data-[variant=line]/tabs-list:relative group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:inset-x-2 group-data-[variant=line]/tabs-list:after:bottom-0 group-data-[variant=line]/tabs-list:after:h-0.5 group-data-[variant=line]/tabs-list:after:bg-primary group-data-[variant=line]/tabs-list:after:opacity-0 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
        // Focus + disabled.
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30',
        'disabled:pointer-events-none disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
