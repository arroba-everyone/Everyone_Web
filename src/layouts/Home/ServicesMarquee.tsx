import { cn } from '@everyone-web/libs/utils';

const services = [
  'Webs',
  'Apps móviles',
  'AR / VR',
  'UX / UI',
  'E-commerce',
  'Automatización',
  'Sistemas a medida',
  'Branding',
];

const MarqueeContent = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
  <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
    {services.map((service, i) => (
      <span key={service} className="flex items-center">
        <span
          className={cn(
            'px-6 text-2xl tablet-lg:text-3xl font-extrabold uppercase tracking-tight whitespace-nowrap',
            i % 2 === 0 ? 'text-cream' : 'text-transparent',
            i % 2 !== 0 && '[-webkit-text-stroke:1.5px_var(--color-cream)]'
          )}
        >
          {service}
        </span>
        <span className={cn('text-xl', i % 2 === 0 ? 'text-lime' : 'text-grape')}>✦</span>
      </span>
    ))}
  </div>
);

/** Slanted dark band with an infinite scroll of what we do.
 *  Transparent wrapper: it renders inside the Hero so the band sits on the
 *  textured hero background without a flat seam around the rotation. */
export const ServicesMarquee = () => (
  <div className="relative py-8">
    {/* No shadow here: it would get clipped at the section edge and show
        up as a straight line on the flat cream below. */}
    <div className="-rotate-1 scale-105 bg-ink py-5 overflow-hidden">
      <div className="flex w-max animate-marquee">
        <MarqueeContent />
        <MarqueeContent ariaHidden />
      </div>
    </div>
  </div>
);
