import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { cn } from '@everyone-web/libs/utils';
import juanAvatar from '@everyone-web/assets/juanAvatar.webp';
import pabloAvatar from '@everyone-web/assets/pabloAvatar.webp';
import ireneAvatar from '@everyone-web/assets/ireneAvatar.webp';
import { Reveal } from './Reveal';

const team = [
  {
    name: 'Juan Ferrera',
    role: 'Diseño & iOS',
    chip: 'bg-lime-tint text-lime-deep',
    bio: 'Diseña cada interfaz y desarrolla para el ecosistema Apple. Obsesionado con que todo se sienta sencillo.',
    avatar: juanAvatar,
  },
  {
    name: 'Pablo Enguix',
    role: 'Web, Android & Backend',
    chip: 'bg-grape-tint text-grape-deep',
    bio: 'La base técnica de cada proyecto: backend sólido, web rápida y apps Android que no fallan.',
    avatar: pabloAvatar,
  },
  {
    name: 'Irene Correll',
    role: 'Marca & Comunicación',
    chip: 'bg-peach-tint text-ink',
    bio: 'Identidad visual, contenido y campañas. Hace que cada proyecto se vea y suene como debe.',
    avatar: ireneAvatar,
  },
];

export const Team = () => (
  <section className="bg-cream">
    <div className="mx-auto max-w-6xl px-6 py-20 tablet-lg:py-28 flex flex-col gap-12">
      <Reveal className="flex flex-col tablet-lg:flex-row tablet-lg:items-end justify-between gap-6">
        <div className="flex flex-col items-start gap-4 max-w-2xl">
          <span className="rounded-full bg-lime-tint text-lime-deep px-4 py-1.5 text-sm font-bold">
            El equipo
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink text-balance">
            Tres personas, todas las piezas.
          </h2>
          <p className="text-lg text-ink-soft leading-relaxed">
            Diseño, desarrollo y comunicación bajo el mismo techo. Hablas directamente con
            quien construye tu producto.
          </p>
        </div>
        <Link
          to="/aboutUs"
          className={cn(
            'group inline-flex items-center gap-2 shrink-0 rounded-full',
            'ring-1 ring-ink/15 text-ink px-6 py-3.5 font-bold transition-all',
            'hover:bg-ink hover:text-paper'
          )}
        >
          Conócenos mejor
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {team.map((member, i) => (
          <Reveal key={member.name} delay={i * 0.1}>
            <div
              className={cn(
                'group flex flex-col items-start gap-4 rounded-[2rem] bg-paper p-8',
                'ring-1 ring-ink/5 transition-all duration-300 h-full',
                'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/8',
                i === 1 && 'tablet-lg:translate-y-6'
              )}
            >
              <img
                src={member.avatar}
                alt={member.name}
                loading="lazy"
                width={80}
                height={80}
                className={cn(
                  'size-20 rounded-3xl object-cover ring-4 ring-cream',
                  'transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-105'
                )}
              />
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-ink">{member.name}</h3>
                <span
                  className={cn(
                    'self-start rounded-full px-3 py-1 text-xs font-bold',
                    member.chip
                  )}
                >
                  {member.role}
                </span>
              </div>
              <p className="text-ink-soft leading-relaxed">{member.bio}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
