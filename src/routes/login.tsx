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
import { Card } from '@everyone-web/ui/card';
import { cn } from '@everyone-web/libs/utils';
import everyLog from '@everyone-web/assets/everyLog.webp';

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
    <MainLayout>
      <div
        className={cn(
          'min-h-screen bg-background items-stretch',
          'grid grid-cols-1 lg:grid-cols-2',
          'gap-8 md:gap-10 tablet-lg:gap-12 laptop:gap-14 laptop-lg:gap-18 xl:gap-24',
          'p-6 md:p-10 tablet-lg:p-12 laptop:p-14 laptop-lg:p-20 xl:p-30',
          'pt-28 md:pt-24 tablet-lg:pt-32 laptop:pt-34 laptop-lg:pt-36 desktop:pt-38'
        )}
      >
        {/* Brand panel — desktop left, mobile hidden */}
        <Card
          className={cn(
            'bg-primary overflow-hidden hidden lg:flex flex-col items-center justify-center gap-8',
            'rounded-[2.5rem] md:rounded-[3rem] laptop:rounded-[3.5rem] xl:rounded-[4rem]',
            'p-10 laptop:p-14 laptop-lg:p-18 xl:p-20',
            'order-1'
          )}
        >
          <img
            src={everyLog}
            alt="@everyone"
            className="w-2/3 max-w-md object-contain"
          />
          <div className="text-center text-primary-foreground">
            <p className="font-bold text-3xl laptop:text-4xl laptop-lg:text-5xl">
              Bienvenido de vuelta.
            </p>
            <p className="mt-4 text-lg laptop:text-xl laptop-lg:text-2xl opacity-90">
              Entra para acceder a las ofertas y al blog.
            </p>
          </div>
        </Card>

        {/* Form panel */}
        <Card
          className={cn(
            'bg-card w-full flex flex-col justify-center gap-8',
            'rounded-[2.5rem] md:rounded-[3rem] laptop:rounded-[3.5rem] xl:rounded-[4rem]',
            'p-8 md:p-10 tablet-lg:p-12 laptop:p-14 xl:p-16',
            'order-2'
          )}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="font-bold text-3xl tablet-lg:text-4xl text-primary lg:hidden">
              @everyone
            </p>
            <h1 className="font-bold text-2xl md:text-3xl laptop:text-4xl laptop-lg:text-5xl">
              Iniciar sesión
            </h1>
          </div>

          {search.message && (
            <div
              role="status"
              className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground"
            >
              {search.message}
            </div>
          )}

          {search.error === 'oauth' && (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
            >
              Ha ocurrido un error al iniciar sesión con Google. Inténtalo de nuevo.
            </div>
          )}

          <LoginForm onSuccess={handleSuccess} />

          <p className="text-center text-base text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline transition-all"
            >
              Crear cuenta
            </Link>
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
