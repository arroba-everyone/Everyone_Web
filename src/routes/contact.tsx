import { createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, CalendarClock, MailOpen, Send } from 'lucide-react';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Reveal } from '@everyone-web/layouts/Home';
import { Icon } from '@everyone-web/ui/Icon/Icon';
import { cn } from '@everyone-web/libs/utils';

const title = 'Contacto — @everyone';
const description =
  'Cuéntanos tu proyecto sin compromiso. Escríbenos a contacto@arrobaeveryone.com y te respondemos en menos de 48 horas con una propuesta clara.';

export const Route = createFileRoute('/contact')({
  component: Contact,
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: 'https://arrobaeveryone.com/contact' },
      { property: 'og:image', content: 'https://arrobaeveryone.com/logo512.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: 'https://arrobaeveryone.com/logo512.png' },
      {
        name: 'keywords',
        content:
          'contacto @everyone, presupuesto web, presupuesto app, desarrollo a medida, estudio digital, contacto desarrollo apps',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://arrobaeveryone.com/contact' }],
  }),
});

const steps = [
  {
    icon: Send,
    title: 'Nos escribes',
    description: 'Un email contándonos tu idea, tu negocio o el problema que quieres resolver.',
  },
  {
    icon: CalendarClock,
    title: 'Hablamos',
    description: 'Una llamada corta para entender bien lo que necesitas. Sin compromiso.',
  },
  {
    icon: MailOpen,
    title: 'Recibes una propuesta',
    description: 'En menos de 48 horas, con alcance, plazos y precio claros desde el principio.',
  },
];

function Contact() {
  return (
    <MainLayout tone="light">
      <section className="relative overflow-hidden bg-cream min-h-screen">
        <div
          aria-hidden
          className="absolute -top-32 -left-32 size-[28rem] rounded-full bg-lime/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 -right-32 size-[26rem] rounded-full bg-grape/20 blur-3xl pointer-events-none"
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-20 tablet-lg:pt-48 tablet-lg:pb-28 flex flex-col gap-14">
          {/* Hero + email card */}
          <div className="flex flex-col items-center text-center gap-8">
            <Reveal className="flex flex-col items-center gap-5">
              <span className="rounded-full bg-paper ring-1 ring-ink/8 text-ink-soft px-4 py-1.5 text-sm font-bold">
                Contacto
              </span>
              <h1 className="max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight text-ink text-balance leading-[1.05]">
                Hablemos de tu proyecto.
              </h1>
              <p className="max-w-xl text-lg tablet-lg:text-xl text-ink-soft leading-relaxed">
                Da igual si todavía es solo una idea en una servilleta o un sistema que ya se
                te ha quedado pequeño: nos encantará escucharte.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="w-full max-w-3xl">
              <a
                href="mailto:contacto@arrobaeveryone.com"
                className={cn(
                  'group relative flex flex-col sm:flex-row items-center justify-center gap-3',
                  'rounded-[2rem] tablet-lg:rounded-full bg-lime px-8 py-8 tablet-lg:py-10 overflow-hidden',
                  'transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-lime/40'
                )}
              >
                <div
                  aria-hidden
                  className="absolute -top-12 -right-8 size-40 rounded-full bg-paper/40 blur-2xl pointer-events-none"
                />
                <span className="relative text-xl md:text-3xl font-extrabold tracking-tight text-ink break-all sm:break-normal">
                  contacto@arrobaeveryone.com
                </span>
                <ArrowUpRight className="relative size-7 text-ink transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Reveal>
          </div>

          {/* What to expect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div
                  className={cn(
                    'flex flex-col gap-4 rounded-[2rem] bg-paper ring-1 ring-ink/5 p-8 h-full',
                    'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/8'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center size-11 rounded-2xl bg-ink text-cream">
                      <step.icon className="size-5" />
                    </div>
                    <span className="text-xs font-extrabold text-ink-soft/60">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-ink">{step.title}</h3>
                  <p className="text-ink-soft leading-relaxed text-sm">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Socials */}
          <Reveal className="flex flex-col items-center gap-4">
            <p className="text-sm font-semibold text-ink-soft">También estamos por aquí</p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/arroba_everyone"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={cn(
                  'grid place-items-center size-12 rounded-2xl bg-paper ring-1 ring-ink/8 text-ink',
                  'transition-all hover:-translate-y-1 hover:bg-ink hover:text-cream'
                )}
              >
                <Icon name="instagram" className="size-6" />
              </a>
              <a
                href="https://github.com/arroba-everyone"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={cn(
                  'grid place-items-center size-12 rounded-2xl bg-paper ring-1 ring-ink/8 text-ink',
                  'transition-all hover:-translate-y-1 hover:bg-ink hover:text-cream'
                )}
              >
                <Icon name="github" className="size-6" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </MainLayout>
  );
}
