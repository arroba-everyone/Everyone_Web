import { createFileRoute } from '@tanstack/react-router';
import { Ear, Sparkles, HeartHandshake, type LucideIcon } from 'lucide-react';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { FinalCTA, Reveal } from '@everyone-web/layouts/Home';
import { Icon } from '@everyone-web/ui/Icon/Icon';
import { cn } from '@everyone-web/libs/utils';
import juanAvatar from '@everyone-web/assets/juanAvatar.webp';
import pabloAvatar from '@everyone-web/assets/pabloAvatar.webp';
import ireneAvatar from '@everyone-web/assets/ireneAvatar.webp';
import juanWorking from '@everyone-web/assets/juanWorking.webp';

const title = 'Sobre nosotros · @everyone';
const description =
  'Somos un equipo multidisciplinar de diseño, desarrollo y comunicación. Pequeño a propósito: hablas directamente con quien construye tu producto.';

export const Route = createFileRoute('/aboutUs')({
  component: AboutUs,
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: 'https://arrobaeveryone.com/aboutUs' },
      { property: 'og:image', content: 'https://arrobaeveryone.com/logo512.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: 'https://arrobaeveryone.com/logo512.png' },
      {
        name: 'keywords',
        content:
          'equipo @everyone, estudio digital, diseño UX/UI, desarrollo iOS, desarrollo web, desarrollo Android, marketing digital, equipo multidisciplinar',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://arrobaeveryone.com/aboutUs' }],
  }),
});

interface IValue {
  icon: LucideIcon;
  title: string;
  description: string;
  tint: string;
  /** Keeps the card's accent visible in dark mode, where the tinted
   *  backgrounds flatten — see the same pattern in Services. */
  iconAccent: string;
}

const values: IValue[] = [
  {
    icon: Ear,
    title: 'Claridad ante todo',
    description:
      'Te hablamos en tu idioma, no en jerga técnica. Sabrás en todo momento qué estamos haciendo, por qué y cuánto cuesta.',
    tint: 'bg-lime-tint dark:bg-paper dark:ring-lime/30',
    iconAccent: 'dark:bg-lime dark:text-ink-solid',
  },
  {
    icon: Sparkles,
    title: 'Diseño que se nota',
    description:
      'Cuidamos cada detalle, desde la primera pantalla hasta el último píxel. Lo bonito también tiene que funcionar.',
    tint: 'bg-grape-tint dark:bg-paper dark:ring-grape/30',
    iconAccent: 'dark:bg-grape dark:text-ink-solid',
  },
  {
    icon: HeartHandshake,
    title: 'Cerca de verdad',
    description:
      'Sin intermediarios ni gestores de cuenta: tratas directamente con las personas que diseñan y programan tu proyecto.',
    tint: 'bg-peach-tint dark:bg-paper dark:ring-peach/30',
    iconAccent: 'dark:bg-peach dark:text-ink-solid',
  },
];

const team = [
  {
    name: 'Juan Ferrera Sala',
    role: 'Diseño de producto · Desarrollo iOS',
    chip: 'bg-lime-tint text-lime-deep',
    bio: 'Diseña cómo se ve y cómo se siente cada proyecto: interfaces, experiencia de usuario y desarrollo para el ecosistema Apple. Coordina el rumbo del equipo y cree que la tecnología debe ser útil, bonita y, sobre todo, humana.',
    avatar: juanAvatar,
    links: [
      { icon: 'github' as const, href: 'https://github.com/Tostyfis360', label: 'GitHub de Juan' },
      {
        icon: 'linkedin' as const,
        href: 'https://www.linkedin.com/in/juan-ferrera-sala-6264401a7/',
        label: 'LinkedIn de Juan',
      },
    ],
  },
  {
    name: 'Pablo Enguix Llopis',
    role: 'Desarrollo web · Backend & Android',
    chip: 'bg-grape-tint text-grape-deep',
    bio: 'El guardián del «que todo funcione». Construye la base tecnológica de cada proyecto: backend sólido, webs rápidas y apps Android estables. Convierte las ideas en sistemas que aguantan el mundo real.',
    avatar: pabloAvatar,
    links: [
      {
        icon: 'github' as const,
        href: 'https://github.com/PabloEnguix09',
        label: 'GitHub de Pablo',
      },
      {
        icon: 'linkedin' as const,
        href: 'https://www.linkedin.com/in/pablo-enguix-llopis-1b2986193/',
        label: 'LinkedIn de Pablo',
      },
    ],
  },
  {
    name: 'Irene Correll Canchal',
    role: 'Comunicación · Diseño visual & Marketing',
    chip: 'bg-peach-tint text-ink',
    bio: 'La voz y la mirada del estudio. Se encarga de la identidad visual, el contenido y las campañas que hacen que cada proyecto respire coherencia. Convierte ideas técnicas en historias que cualquiera entiende.',
    avatar: ireneAvatar,
    links: [
      {
        icon: 'instagram' as const,
        href: 'https://instagram.com/orden.studio',
        label: 'Instagram de Irene',
      },
      {
        icon: 'linkedin' as const,
        href: 'https://www.linkedin.com/in/lrene-corell-323996279/',
        label: 'LinkedIn de Irene',
      },
    ],
  },
];

function AboutUs() {
  return (
    <MainLayout tone="light">
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div
          aria-hidden
          className="absolute -top-32 -right-32 size-[28rem] rounded-full bg-grape/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute top-40 -left-32 size-[24rem] rounded-full bg-lime/20 blur-3xl pointer-events-none"
        />

        <div
          className={cn(
            'relative mx-auto max-w-6xl px-6 pt-36 pb-16 tablet-lg:pt-48 tablet-lg:pb-24',
            'grid grid-cols-1 tablet-lg:grid-cols-2 items-center gap-12'
          )}
        >
          <Reveal className="flex flex-col items-start gap-6">
            <span className="rounded-full bg-paper ring-1 ring-ink/8 text-ink-soft px-4 py-1.5 text-sm font-bold">
              Sobre nosotros
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink text-balance leading-[1.05]">
              Un equipo pequeño. Un estándar muy alto.
            </h1>
            <p className="text-lg tablet-lg:text-xl text-ink-soft leading-relaxed">
              Somos un equipo multidisciplinar: diseño, desarrollo y comunicación bajo el mismo
              techo. Pequeño a propósito, para que cada proyecto lo lleven las mismas manos de
              principio a fin, sin intermediarios.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-[2.5rem] overflow-hidden rotate-2 transition-transform duration-500 hover:rotate-0 ring-1 ring-ink/5 shadow-xl shadow-ink/10">
              <img
                src={juanWorking}
                alt="El equipo de @everyone trabajando"
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 tablet-lg:py-20 flex flex-col gap-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
              Cómo entendemos el trabajo
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.1}>
                <div
                  className={cn(
                    'flex flex-col gap-4 rounded-[2rem] p-8 h-full ring-1 ring-ink/5',
                    'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/8',
                    value.tint
                  )}
                >
                  <div
                    className={cn(
                      'grid place-items-center size-12 rounded-2xl bg-ink text-cream',
                      value.iconAccent
                    )}
                  >
                    <value.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold text-ink">{value.title}</h3>
                  <p className="text-ink-soft leading-relaxed">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 tablet-lg:py-24 flex flex-col gap-10">
          <Reveal className="flex flex-col gap-4 max-w-2xl">
            <span className="self-start rounded-full bg-lime-tint text-lime-deep px-4 py-1.5 text-sm font-bold">
              Las personas
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink">
              Quién hace qué
            </h2>
          </Reveal>

          <div className="flex flex-col gap-6">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.05}>
                <div
                  className={cn(
                    'group flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10',
                    'rounded-[2.5rem] bg-paper ring-1 ring-ink/5 p-8 tablet-lg:p-10',
                    'transition-all duration-300 hover:shadow-xl hover:shadow-ink/8'
                  )}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    loading="lazy"
                    className={cn(
                      'size-28 tablet-lg:size-36 shrink-0 rounded-[2rem] object-cover ring-4 ring-cream',
                      'transition-transform duration-300 group-hover:rotate-[-3deg] group-hover:scale-105'
                    )}
                  />
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold text-ink">{member.name}</h3>
                      <span
                        className={cn('rounded-full px-3.5 py-1.5 text-xs font-bold', member.chip)}
                      >
                        {member.role}
                      </span>
                    </div>
                    <p className="text-ink-soft leading-relaxed max-w-3xl">{member.bio}</p>
                    <div className="flex items-center gap-4 pt-1">
                      {member.links.map(link => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.label}
                          className="text-ink-soft hover:text-ink transition-colors"
                        >
                          <Icon name={link.icon} className="size-6" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </MainLayout>
  );
}
