import { useState } from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '@everyone-web/libs/utils';

interface DealImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

/**
 * Renders a deal image in a fixed 16:9 container.
 *
 * Falls back to a placeholder with a PackageOpen icon when:
 *  - src is null
 *  - the image fails to load (onError)
 *
 * Uses lazy loading and async decoding to avoid blocking initial render.
 */
export function DealImage({ src, alt, className }: DealImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        data-testid="deal-image-fallback"
        className={cn(
          'aspect-video w-full bg-[#0d0d0d] flex items-center justify-center',
          className
        )}
      >
        <PackageOpen className="h-12 w-12 text-foreground/30" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      className={cn('aspect-video w-full object-contain bg-[#0d0d0d]', className)}
    />
  );
}
