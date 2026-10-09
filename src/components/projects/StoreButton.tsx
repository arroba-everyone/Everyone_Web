import { ArrowUpRight } from 'lucide-react';
import { cn } from '@everyone-web/libs/utils';

export type StoreKind = 'ios' | 'android';

interface IStoreButton {
  store: StoreKind;
  href: string;
  /** Nombre de la app, solo para el nombre accesible del enlace. */
  appName: string;
}

const STORE_LABELS: Record<StoreKind, { eyebrow: string; name: string }> = {
  ios: { eyebrow: 'Descargar en', name: 'App Store' },
  android: { eyebrow: 'Disponible en', name: 'Google Play' },
};

/**
 * Enlace a la ficha de una app en su tienda. Es un botón propio con el nombre
 * de la tienda en texto; no usa los distintivos oficiales «Download on the App
 * Store» / «Get it on Google Play», que tienen sus propias normas de uso.
 */
export const StoreButton = ({ store, href, appName }: IStoreButton) => {
  const { eyebrow, name } = STORE_LABELS[store];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${eyebrow} ${name}: ${appName}`}
      className={cn(
        'group inline-flex items-center gap-4 rounded-2xl bg-ink text-paper',
        'pl-5 pr-4 py-3 transition-all',
        'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/20'
      )}
    >
      <span className="flex flex-col text-left leading-tight">
        <span className="text-xs font-semibold opacity-70">{eyebrow}</span>
        <span className="text-lg font-extrabold tracking-tight">{name}</span>
      </span>
      <ArrowUpRight
        aria-hidden
        className="size-5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
};
