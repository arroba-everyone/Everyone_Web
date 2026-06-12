import { cn } from '@everyone-web/libs/utils';
import { Reveal } from './Reveal';

const steps = [
  {
    number: '01',
    title: 'Escuchamos',
    description:
      'Una primera conversación para entender tu proyecto y lo que necesitas de verdad. Sin compromiso y sin jerga técnica.',
  },
  {
    number: '02',
    title: 'Diseñamos',
    description:
      'Te enseñamos propuestas visuales reales de tu producto antes de escribir una sola línea de código.',
  },
  {
    number: '03',
    title: 'Construimos',
    description:
      'Desarrollo por fases con entregas que puedes ver y probar desde el primer momento. Nada de cajas negras.',
  },
  {
    number: '04',
    title: 'Lanzamos y seguimos',
    description:
      'Publicamos, medimos y nos quedamos cerca para que todo siga funcionando como el primer día.',
  },
];

export const Process = () => (
  <section className="bg-cream px-4 py-10">
    <div
      className={cn(
        'relative mx-auto max-w-7xl overflow-hidden',
        'rounded-[2.5rem] tablet-lg:rounded-[3rem] bg-ink text-cream',
        // In dark mode bg-ink would flip to a glaring light panel; use the
        // dark card surface with light text instead.
        'dark:bg-paper dark:text-ink dark:ring-1 dark:ring-ink/10'
      )}
    >
      <div
        aria-hidden
        className="absolute -top-32 right-1/4 size-80 rounded-full bg-grape/20 blur-3xl pointer-events-none"
      />

      <div className="relative px-8 py-16 tablet-lg:px-14 tablet-lg:py-24 flex flex-col gap-14">
        <Reveal className="flex flex-col gap-4 max-w-2xl">
          <span className="self-start rounded-full bg-cream/10 text-lime dark:bg-lime/10 px-4 py-1.5 text-sm font-bold">
            Cómo trabajamos
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-balance">
            Un proceso claro, por fases y sin sorpresas.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 laptop:grid-cols-4 gap-10 tablet-lg:gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1} className="flex flex-col gap-3">
              <span className="text-5xl font-extrabold text-lime tracking-tight">
                {step.number}
              </span>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-cream/65 dark:text-ink-soft leading-relaxed text-base">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
