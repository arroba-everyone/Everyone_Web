import { cn } from '@everyone-web/libs/utils';

const services = [
  'Webs',
  'Apps móviles',
  'AR / VR',
  'UX / UI',
  'E-commerce',
  'Reservas online',
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

/** Slanted dark band with an infinite scroll of what we do. */
export const ServicesMarquee = () => (
  <section className="relative bg-cream py-10 overflow-hidden">
    <div className="-rotate-1 scale-105 bg-ink py-5 shadow-xl shadow-ink/10 overflow-hidden">
      <div className="flex w-max animate-marquee">
        <MarqueeContent />
        <MarqueeContent ariaHidden />
      </div>
    </div>
  </section>
);
