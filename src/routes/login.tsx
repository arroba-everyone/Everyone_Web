import {
  createFileRoute,
  redirect,
  useNavigate,
  useSearch,
  useRouter,
  Link,
} from '@tanstack/react-router';
import { LoginForm } from '@everyone-web/components/auth/LoginForm';
import { sanitiseRedirect } from '@everyone-web/server/redirect-sanitiser';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { cn } from '@everyone-web/libs/utils';

type LoginSearch = {
  redirect?: string;
  error?: string;
  message?: string;
};

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search['redirect'] === 'string' ? search['redirect'] : undefined,
    error: typeof search['error'] === 'string' ? search['error'] : undefined,
    message: typeof search['message'] === 'string' ? search['message'] : undefined,
  }),

  beforeLoad: ({ context }) => {
    if (context.session !== null && context.session !== undefined) {
      throw redirect({ to: '/' });
    }
  },

  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const search = useSearch({ from: '/login' });

  const handleSuccess = async () => {
    await router.invalidate();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const safe = sanitiseRedirect(search.redirect, origin);
    await navigate({ to: safe ?? '/' });
  };

  return (
    <MainLayout tone="light">
      <div className="theme-light relative overflow-hidden bg-cream min-h-screen">
        {/* Soft gradient blobs */}
        <div
          aria-hidden
          className="absolute -top-32 -left-32 size-[26rem] rounded-full bg-lime/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 -right-32 size-[24rem] rounded-full bg-grape/20 blur-3xl pointer-events-none"
        />

        <div className="relative mx-auto max-w-md px-6 pt-36 pb-20 tablet-lg:pt-44">
          <div
            className={cn(
              'flex flex-col gap-6 rounded-[2.5rem] bg-paper p-8 md:p-10',
              'ring-1 ring-ink/5 shadow-xl shadow-ink/5'
            )}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <span
                className={cn(
                  'grid place-items-center size-12 rounded-2xl bg-lime text-ink',
                  'font-extrabold text-2xl leading-none rotate-[-6deg]'
                )}
              >
                @
              </span>
              <h1 className="font-extrabold tracking-tight text-2xl md:text-3xl text-ink">
                Acceso equipo
              </h1>
              <p className="text-sm text-ink-soft leading-relaxed">
                Zona privada de @everyone para gestionar las ofertas y el contenido.
              </p>
            </div>

            {search.message && (
              <div
                role="status"
                className="rounded-2xl bg-lime-tint ring-1 ring-lime-deep/20 p-4 text-sm text-ink"
              >
                {search.message}
              </div>
            )}

            {search.error === 'oauth' && (
              <div
                role="alert"
                className="rounded-2xl bg-destructive/10 ring-1 ring-destructive/30 p-4 text-sm text-destructive"
              >
                Ha ocurrido un error al iniciar sesión con Google. Inténtalo de nuevo.
              </div>
            )}

            <LoginForm onSuccess={handleSuccess} />
          </div>

          <p className="mt-6 text-center text-xs text-ink-soft/80">
            ¿Has llegado aquí por error?{' '}
            <Link to="/" className="font-semibold underline underline-offset-2 hover:text-ink">
              Volver a la web
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
