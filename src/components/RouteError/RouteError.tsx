import { useEffect } from 'react';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { RotateCw } from 'lucide-react';
import { cn } from '@everyone-web/libs/utils';

/**
 * Pantalla que se muestra cuando una ruta lanza una excepción al cargar o al
 * pintarse. Sustituye a la de TanStack («Something went wrong! Show Error»),
 * que es la que Google llegó a indexar como título de la home.
 *
 * Decisiones:
 * - Es autónoma: no usa MainLayout ni `<Link>`, porque el fallo puede venir
 *   precisamente del router o de la navegación, y la pantalla de error no puede
 *   depender de lo que se ha roto.
 * - «Volver a intentarlo» recarga la página entera en lugar de llamar a
 *   `reset()`: así se recupera tanto de un loader que falló como de un chunk de
 *   JavaScript que no llegó a descargarse, que `reset()` no vuelve a pedir.
 * - No muestra el mensaje técnico del error: no aporta nada al visitante y
 *   puede filtrar detalles internos. Queda en la consola.
 * - No añade `noindex`: los errores son transitorios y un `noindex` pintado en
 *   un mal momento sacaría la página de Google hasta el siguiente rastreo.
 */
export const RouteError = ({ error }: ErrorComponentProps) => {
  useEffect(() => {
    console.error('[RouteError] Error al cargar la ruta:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-cream text-ink flex items-center justify-center px-4 py-16">
      <div className="max-w-xl flex flex-col items-center text-center gap-6">
        <a href="/" className="text-xl font-extrabold tracking-tight text-ink-solid">
          @everyone
        </a>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink-solid text-balance">
          Algo ha fallado al cargar la página
        </h1>
        <p className="text-lg text-ink-solid/70 font-medium leading-relaxed">
          No es culpa tuya. Vuelve a intentarlo en unos segundos y, si sigue fallando, escríbenos a{' '}
          <a
            href="mailto:contacto@arrobaeveryone.com"
            className="font-bold underline underline-offset-4 decoration-2 hover:opacity-70 transition-opacity"
          >
            contacto@arrobaeveryone.com
          </a>
          .
        </p>
        <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={cn(
              'group inline-flex items-center gap-2 rounded-full bg-ink-solid text-paper-solid',
              'px-7 py-4 font-bold text-base transition-all',
              'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink-solid/25'
            )}
          >
            <RotateCw className="size-5 transition-transform group-hover:rotate-45" />
            Volver a intentarlo
          </button>
          <a
            href="/"
            className="font-bold text-ink-solid underline underline-offset-4 decoration-2 hover:opacity-70 transition-opacity"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </main>
  );
};
