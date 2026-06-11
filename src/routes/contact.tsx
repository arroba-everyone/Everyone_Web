import { createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, CalendarClock, MailOpen, Send } from 'lucide-react';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Reveal } from '@everyone-web/layouts/Home';
import { ContactForm } from '@everyone-web/components/contact/ContactForm';
import { Icon } from '@everyone-web/ui/Icon/Icon';
import { cn } from '@everyone-web/libs/utils';

const title = 'Contacto · @everyone';
const description =
  'Cuéntanos tu proyecto sin compromiso. Rellena el formulario o escríbenos a contacto@arrobaeveryone.com y te respondemos en menos de 48 horas.';

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
    description: 'Con el formulario o por email, como prefieras.',
  },
  {
    icon: CalendarClock,
    title: 'Hablamos',
    description: 'Una llamada corta para entender bien lo que necesitas.',
  },
  {
    icon: MailOpen,
    title: 'Recibes una propuesta',
    description: 'En menos de 48 horas, con alcance, plazos y precio claros.',
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

        <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-20 tablet-lg:pt-44 tablet-lg:pb-28 flex flex-col gap-12">
          {/* Hero */}
          <Reveal className="flex flex-col items-center text-center gap-5">
            <span className="rounded-full bg-paper ring-1 ring-ink/8 text-ink-soft px-4 py-1.5 text-sm font-bold">
              Contacto
            </span>
            <h1 className="max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight text-ink text-balance leading-[1.05]">
              Hablemos de tu proyecto.
            </h1>
            <p className="max-w-xl text-lg tablet-lg:text-xl text-ink-soft leading-relaxed">
              Da igual si todavía es solo una idea en una servilleta o un sistema que ya se te
              ha quedado pequeño: nos encantará escucharte.
            </p>
          </Reveal>

          {/* Form + side info */}
          <div className="grid grid-cols-1 tablet-lg:grid-cols-5 gap-6 items-start">
            <Reveal delay={0.1} className="tablet-lg:col-span-3">
              <div
                className={cn(
                  'theme-light relative rounded-[2.5rem] bg-paper p-8 md:p-10',
                  'ring-1 ring-ink/5 shadow-xl shadow-ink/5'
                )}
              >
                <ContactForm />
              </div>
            </Reveal>

            <div className="tablet-lg:col-span-2 flex flex-col gap-5">
              <Reveal delay={0.15}>
                <a
                  href="mailto:contacto@arrobaeveryone.com"
                  className={cn(
                    'group relative flex items-center justify-between gap-3 overflow-hidden',
                    'rounded-[2rem] bg-lime px-7 py-6',
                    'transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-lime/40'
                  )}
                >
                  <div
                    aria-hidden
                    className="absolute -top-10 -right-8 size-32 rounded-full bg-paper/40 blur-2xl pointer-events-none"
                  />
                  <div className="relative flex flex-col">
                    <span className="text-xs font-bold text-ink-solid/60 uppercase tracking-wide">
                      ¿Prefieres el email de toda la vida?
                    </span>
                    <span className="text-base md:text-lg font-extrabold tracking-tight text-ink-solid break-all">
                      contacto@arrobaeveryone.com
                    </span>
                  </div>
                  <ArrowUpRight className="relative size-6 shrink-0 text-ink-solid transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Reveal>

              {steps.map((step, i) => (
                <Reveal key={step.title} delay={0.2 + i * 0.08}>
                  <div
                    className={cn(
                      'flex items-start gap-4 rounded-[2rem] bg-paper ring-1 ring-ink/5 p-6',
                      'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/8'
                    )}
                  >
                    <div className="grid place-items-center size-11 shrink-0 rounded-2xl bg-ink text-cream">
                      <step.icon className="size-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-bold text-ink">
                        <span className="text-ink-soft/50 mr-1.5">0{i + 1}</span>
                        {step.title}
                      </h3>
                      <p className="text-ink-soft leading-relaxed text-sm">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={0.45} className="flex items-center gap-3 px-2">
                <p className="text-sm font-semibold text-ink-soft">También estamos por aquí</p>
                <a
                  href="https://www.instagram.com/arroba_everyone"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={cn(
                    'grid place-items-center size-10 rounded-xl bg-paper ring-1 ring-ink/8 text-ink',
                    'transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream'
                  )}
                >
                  <Icon name="instagram" className="size-5" />
                </a>
                <a
                  href="https://github.com/arroba-everyone"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={cn(
                    'grid place-items-center size-10 rounded-xl bg-paper ring-1 ring-ink/8 text-ink',
                    'transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream'
                  )}
                >
                  <Icon name="github" className="size-5" />
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
