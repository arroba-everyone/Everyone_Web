import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@everyone-web/libs/utils';
import type { IAppScreenshot } from '@everyone-web/constants/apps';

// Tamaño real de los WebP de src/assets/projects. Se declara en el <img> para
// que el navegador reserve el hueco antes de descargar y la página no salte.
const SCREENSHOT_WIDTH = 720;
const SCREENSHOT_HEIGHT = 1558;

/** Tolerancia en px al comparar posiciones de scroll (subpíxeles al hacer zoom). */
const SCROLL_EDGE_TOLERANCE = 4;

/** Qué parte del ancho visible avanza cada pulsación de las flechas. */
const SCROLL_STEP_RATIO = 0.8;

interface IScreenshotStrip {
  appName: string;
  screenshots: readonly IAppScreenshot[];
}

/**
 * Tira horizontal de capturas con scroll nativo y encaje (scroll-snap).
 * En móvil se desliza con el dedo; en escritorio aparecen flechas, y la tira
 * es enfocable con teclado para poder moverla con las flechas del teclado.
 */
export const ScreenshotStrip = ({ appName, screenshots }: IScreenshotStrip) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateEdges = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;
    setCanScrollPrev(strip.scrollLeft > SCROLL_EDGE_TOLERANCE);
    setCanScrollNext(
      strip.scrollLeft + strip.clientWidth < strip.scrollWidth - SCROLL_EDGE_TOLERANCE
    );
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [updateEdges]);

  const scrollByStep = (direction: -1 | 1) => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.scrollBy({
      left: direction * strip.clientWidth * SCROLL_STEP_RATIO,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      <div
        ref={stripRef}
        onScroll={updateEdges}
        role="region"
        aria-label={`Capturas de ${appName}`}
        // Una región con scroll debe poder enfocarse para moverla con las flechas
        // del teclado (WCAG 2.1.1). Los botones de flecha no bastan: se ocultan en móvil.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className={cn(
          'flex items-start gap-4 overflow-x-auto px-6 py-8 snap-x snap-mandatory scroll-px-6',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-paper-solid'
        )}
      >
        {screenshots.map(({ src, alt }) => (
          <figure
            key={src}
            className="shrink-0 snap-start w-44 md:w-52 tablet-lg:w-56 even:mt-6 m-0"
          >
            <img
              src={src}
              alt={alt}
              width={SCREENSHOT_WIDTH}
              height={SCREENSHOT_HEIGHT}
              loading="lazy"
              decoding="async"
              className="block w-full h-auto rounded-[1.75rem] ring-1 ring-white/15 shadow-2xl shadow-black/30"
            />
          </figure>
        ))}
      </div>

      {(['prev', 'next'] as const).map(direction => {
        const isPrev = direction === 'prev';
        const Icon = isPrev ? ChevronLeft : ChevronRight;
        return (
          <button
            key={direction}
            type="button"
            onClick={() => scrollByStep(isPrev ? -1 : 1)}
            disabled={isPrev ? !canScrollPrev : !canScrollNext}
            aria-label={isPrev ? 'Capturas anteriores' : 'Capturas siguientes'}
            className={cn(
              'hidden tablet-lg:grid absolute top-1/2 -translate-y-1/2 size-11 place-items-center',
              'rounded-full bg-paper-solid text-ink-solid shadow-lg transition-all',
              'hover:scale-105 disabled:opacity-0 disabled:pointer-events-none',
              isPrev ? 'left-3' : 'right-3'
            )}
          >
            <Icon aria-hidden className="size-5" />
          </button>
        );
      })}
    </div>
  );
};
