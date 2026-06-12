import { useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { CheckCircle2, CircleSlash } from 'lucide-react';
import { getSiteSettingsFn, updateSiteSettingsFn } from '@everyone-web/services/settings';
import { Button } from '@everyone-web/ui/button';
import { Input } from '@everyone-web/ui/input';
import { Label } from '@everyone-web/ui/label';
import { cn } from '@everyone-web/libs/utils';
import type { SiteSettingsRow } from '@everyone-web/types/supabase';

export const Route = createFileRoute('/_admin/availability/manage')({
  loader: () => (getSiteSettingsFn as unknown as () => Promise<SiteSettingsRow>)(),
  component: AvailabilityManagePageWrapper,
});

function AvailabilityManagePageWrapper() {
  const settings = Route.useLoaderData() as SiteSettingsRow;
  return <AvailabilityManagePage settings={settings} />;
}

const MESSAGE_MAX = 80;

function ModeCard({
  active,
  onClick,
  icon,
  title,
  description,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: 'open' | 'closed';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex flex-1 flex-col items-start gap-2 rounded-2xl p-6 text-left transition-all',
        'ring-1 ring-ink/10 hover:ring-ink/25',
        active && tone === 'open' && 'bg-lime-tint ring-2 ring-lime-deep',
        active && tone === 'closed' && 'bg-red-50 ring-2 ring-red-500'
      )}
    >
      <span
        className={cn(
          'grid place-items-center size-10 rounded-xl',
          tone === 'open' ? 'bg-lime text-ink-solid' : 'bg-red-500 text-white'
        )}
      >
        {icon}
      </span>
      <span className="font-bold text-lg">{title}</span>
      <span className="text-sm text-ink-soft leading-relaxed">{description}</span>
    </button>
  );
}

export function AvailabilityManagePage({ settings }: { settings: SiteSettingsRow }) {
  const router = useRouter();
  const [accepting, setAccepting] = useState(settings.accepting_projects);
  const [message, setMessage] = useState(settings.closed_message);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty =
    accepting !== settings.accepting_projects || message !== settings.closed_message;

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await updateSiteSettingsFn({
        data: { accepting_projects: accepting, closed_message: message.trim() },
      });
      await router.invalidate();
      setSaved(true);
    } catch (err) {
      console.error('Error al guardar la disponibilidad:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl md:text-4xl tablet-lg:text-5xl">Disponibilidad</h1>
        <p className="text-base md:text-lg text-ink-soft">
          Controla el aviso de la portada: en verde cuando aceptáis proyectos nuevos, en rojo
          con tu mensaje cuando estéis a tope.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <ModeCard
          active={accepting}
          onClick={() => setAccepting(true)}
          icon={<CheckCircle2 className="size-5" />}
          title="Aceptamos proyectos"
          description='La portada muestra el punto verde parpadeando con "Aceptamos nuevos proyectos".'
          tone="open"
        />
        <ModeCard
          active={!accepting}
          onClick={() => setAccepting(false)}
          icon={<CircleSlash className="size-5" />}
          title="Cerrado temporalmente"
          description="La portada muestra un punto rojo con el mensaje que escribas abajo."
          tone="closed"
        />
      </div>

      <div className={cn('flex flex-col gap-2', accepting && 'opacity-50')}>
        <Label htmlFor="closed-message">Mensaje cuando está cerrado</Label>
        <Input
          id="closed-message"
          value={message}
          maxLength={MESSAGE_MAX}
          disabled={accepting}
          onChange={e => {
            setMessage(e.target.value);
            setSaved(false);
          }}
          placeholder="Ahora mismo no aceptamos nuevos proyectos"
        />
        <span className="text-xs text-ink-soft/70">
          {message.length}/{MESSAGE_MAX} caracteres
        </span>
      </div>

      {/* Live preview of the hero badge */}
      <div className="flex flex-col gap-3 rounded-2xl bg-card ring-1 ring-ink/8 p-6">
        <span className="text-sm font-semibold text-ink-soft">Así se verá en la portada:</span>
        <span
          className={cn(
            'self-start inline-flex items-center gap-2 rounded-full bg-cream',
            'ring-1 ring-ink/8 px-4 py-2 text-sm font-semibold text-ink-soft'
          )}
        >
          {accepting ? (
            <>
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full rounded-full bg-lime opacity-75 animate-ping" />
                <span className="relative inline-flex size-2.5 rounded-full bg-lime-deep" />
              </span>
              Aceptamos nuevos proyectos
            </>
          ) : (
            <>
              <span className="inline-flex size-2.5 rounded-full bg-red-500" />
              <span className="text-red-600">
                {message.trim() || 'Ahora mismo no aceptamos nuevos proyectos'}
              </span>
            </>
          )}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={isSaving || !dirty || (!accepting && message.trim().length === 0)}
        >
          {isSaving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
        {saved && !dirty && (
          <span className="text-sm font-semibold text-lime-deep">Guardado ✓</span>
        )}
      </div>
    </div>
  );
}
