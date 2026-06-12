import {
  CalendarCheck2,
  Glasses,
  Globe,
  Palette,
  Smartphone,
  Store,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@everyone-web/libs/utils';
import { Reveal } from './Reveal';

interface IServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
  tags?: string[];
  className?: string;
  dark?: boolean;
  /** Extra classes for the icon chip — used to keep the card's accent
   *  color visible in dark mode, where the tinted backgrounds flatten. */
  iconAccent?: string;
}

const ServiceCard = ({
  icon: IconCmp,
  title,
  description,
  tags,
  className,
  dark = false,
  iconAccent,
}: IServiceCard) => (
  <div
    className={cn(
      'group relative flex flex-col gap-4 rounded-[2rem] p-8 tablet-lg:p-10',
      'ring-1 ring-ink/5 transition-all duration-300',
      'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/8',
      dark ? 'bg-ink text-cream' : 'text-ink',
      className
    )}
  >
    <div
      className={cn(
        'grid place-items-center size-12 rounded-2xl transition-transform duration-300 group-hover:rotate-[-8deg]',
        dark ? 'bg-lime text-ink-solid' : 'bg-ink text-cream',
        iconAccent
      )}
    >
      <IconCmp className="size-6" />
    </div>
    <h3 className="text-xl tablet-lg:text-2xl font-bold tracking-tight">{title}</h3>
    <p className={cn('text-base leading-relaxed', dark ? 'text-cream/70' : 'text-ink-soft')}>
      {description}
    </p>
    {tags && (
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {tags.map(tag => (
          <span
            key={tag}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-bold',
              dark ? 'bg-cream/10 text-cream' : 'bg-ink/5 text-ink'
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

export const Services = () => (
  <section id="services" className="bg-cream scroll-mt-28">
    <div className="mx-auto max-w-6xl px-6 py-20 tablet-lg:py-28 flex flex-col gap-12">
      <Reveal className="flex flex-col items-start gap-4 max-w-2xl">
        <span className="rounded-full bg-lime-tint text-lime-deep px-4 py-1.5 text-sm font-bold">
          Servicios
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink text-balance">
          Todo lo que tu proyecto necesita para vivir en digital.
        </h2>
        <p className="text-lg text-ink-soft leading-relaxed">
          Sin paquetes cerrados ni soluciones de plantilla: escuchamos lo que necesitas y lo
          construimos a medida.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 tablet-lg:grid-cols-12 gap-5">
        <Reveal className="tablet-lg:col-span-7">
          <ServiceCard
            icon={Globe}
            title="Webs que convierten"
            description="Páginas rápidas, bonitas y pensadas para que las visitas se conviertan en clientes. Desde tu primera web corporativa hasta una tienda online completa."
            tags={['Landing pages', 'Webs corporativas', 'E-commerce']}
            className="bg-lime-tint dark:bg-paper dark:ring-lime/30 h-full"
            iconAccent="dark:bg-lime dark:text-ink-solid"
          />
        </Reveal>
        <Reveal delay={0.1} className="tablet-lg:col-span-5">
          <ServiceCard
            icon={Smartphone}
            title="Apps móviles"
            description="Aplicaciones nativas para iOS y Android con diseño cuidado, rendimiento real y publicación en las stores."
            tags={['iOS', 'Android']}
            className="h-full"
            dark
          />
        </Reveal>

        <Reveal className="tablet-lg:col-span-5">
          <ServiceCard
            icon={Glasses}
            title="Realidad aumentada y virtual"
            description="Experiencias inmersivas para marcas, eventos y formación que tus clientes no van a olvidar."
            tags={['AR', 'VR', 'Experiencias 3D']}
            className="bg-grape-tint dark:bg-paper dark:ring-grape/30 h-full"
            iconAccent="dark:bg-grape dark:text-ink-solid"
          />
        </Reveal>
        <Reveal delay={0.1} className="tablet-lg:col-span-7">
          <ServiceCard
            icon={CalendarCheck2}
            title="Sistemas a medida"
            description="Reservas para tu restaurante, gestión interna, paneles de control… Si tu proyecto lo necesita, lo diseñamos y lo construimos para ti."
            tags={['Reservas', 'Paneles de gestión', 'Automatización']}
            className="bg-paper h-full"
          />
        </Reveal>

        <Reveal className="tablet-lg:col-span-7">
          <ServiceCard
            icon={Store}
            title="Soluciones para pymes e instituciones"
            description="Comercios, ayuntamientos, museos, proyectos personales… Te ayudamos a dar el salto a lo digital con un trato cercano y sin tecnicismos."
            tags={['Digitalización', 'Trato cercano']}
            className="bg-peach-tint dark:bg-paper dark:ring-peach/30 h-full"
            iconAccent="dark:bg-peach dark:text-ink-solid"
          />
        </Reveal>
        <Reveal delay={0.1} className="tablet-lg:col-span-5">
          <ServiceCard
            icon={Palette}
            title="Diseño UX/UI y marca"
            description="Interfaces que se entienden a la primera y una identidad visual que se reconoce de lejos."
            tags={['UX/UI', 'Identidad visual']}
            className="bg-paper h-full"
          />
        </Reveal>
      </div>
    </div>
  </section>
);
