import { useState } from 'react';
import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
  Link,
} from '@tanstack/react-router';
import { SignupForm } from '@everyone-web/components/auth/SignupForm';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Card } from '@everyone-web/ui/card';
import { cn } from '@everyone-web/libs/utils';
import everyLog from '@everyone-web/assets/everyLog.webp';

export const Route = createFileRoute('/signup')({
  beforeLoad: ({ context }) => {
    if (context.session !== null && context.session !== undefined) {
      throw redirect({ to: '/' });
    }
  },

  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [emailConfirmRequired, setEmailConfirmRequired] = useState(false);

  const handleSuccess = async () => {
    await router.invalidate();
    await navigate({ to: '/' });
  };

  const handleEmailConfirmationRequired = () => {
    setEmailConfirmRequired(true);
  };

  const containerClass = cn(
    'min-h-screen bg-background items-stretch',
    'grid grid-cols-1 lg:grid-cols-2',
    'gap-8 md:gap-10 tablet-lg:gap-12 laptop:gap-14 laptop-lg:gap-18 xl:gap-24',
    'p-6 md:p-10 tablet-lg:p-12 laptop:p-14 laptop-lg:p-20 xl:p-30',
    'pt-28 md:pt-24 tablet-lg:pt-32 laptop:pt-34 laptop-lg:pt-36 desktop:pt-38'
  );

  const brandPanelClass = cn(
    'bg-primary overflow-hidden hidden lg:flex flex-col items-center justify-center gap-8',
    'rounded-[2.5rem] md:rounded-[3rem] laptop:rounded-[3.5rem] xl:rounded-[4rem]',
    'p-10 laptop:p-14 laptop-lg:p-18 xl:p-20',
    'order-1'
  );

  const formCardClass = cn(
    'bg-card w-full flex flex-col justify-center gap-8',
    'rounded-[2.5rem] md:rounded-[3rem] laptop:rounded-[3.5rem] xl:rounded-[4rem]',
    'p-8 md:p-10 tablet-lg:p-12 laptop:p-14 xl:p-16',
    'order-2'
  );

  if (emailConfirmRequired) {
    return (
      <MainLayout>
        <div className={containerClass}>
          <Card className={brandPanelClass}>
            <img src={everyLog} alt="@everyone" className="w-2/3 max-w-md object-contain" />
            <div className="text-center text-primary-foreground">
              <p className="font-bold text-3xl laptop:text-4xl laptop-lg:text-5xl">
                Casi estás dentro.
              </p>
            </div>
          </Card>

          <Card className={cn(formCardClass, 'text-center')}>
            <p className="font-bold text-3xl tablet-lg:text-4xl text-primary lg:hidden">
              @everyone
            </p>
            <h1 className="font-bold text-2xl md:text-3xl laptop:text-4xl laptop-lg:text-5xl">
              Revisa tu email
            </h1>
            <p className="text-base md:text-lg laptop:text-xl text-muted-foreground leading-relaxed">
              Te hemos enviado un enlace de confirmación. Haz clic en él para activar tu cuenta y
              poder iniciar sesión.
            </p>
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline self-center mt-4 text-base"
            >
              Volver a iniciar sesión
            </Link>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={containerClass}>
        <Card className={brandPanelClass}>
          <img src={everyLog} alt="@everyone" className="w-2/3 max-w-md object-contain" />
          <div className="text-center text-primary-foreground">
            <p className="font-bold text-3xl laptop:text-4xl laptop-lg:text-5xl">
              Únete al equipo.
            </p>
            <p className="mt-4 text-lg laptop:text-xl laptop-lg:text-2xl opacity-90">
              Crea tu cuenta y no te pierdas ninguna oferta.
            </p>
          </div>
        </Card>

        <Card className={formCardClass}>
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="font-bold text-3xl tablet-lg:text-4xl text-primary lg:hidden">
              @everyone
            </p>
            <h1 className="font-bold text-2xl md:text-3xl laptop:text-4xl laptop-lg:text-5xl">
              Crear cuenta
            </h1>
          </div>

          <SignupForm
            onSuccess={handleSuccess}
            onEmailConfirmationRequired={handleEmailConfirmationRequired}
          />

          <p className="text-center text-base text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline transition-all"
            >
              Iniciar sesión
            </Link>
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
