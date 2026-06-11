import { useState } from 'react';
import { createFileRoute, redirect, useNavigate, useRouter, Link } from '@tanstack/react-router';
import { MailCheck } from 'lucide-react';
import { SignupForm } from '@everyone-web/components/auth/SignupForm';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { cn } from '@everyone-web/libs/utils';

export const Route = createFileRoute('/signup')({
  beforeLoad: ({ context }) => {
    if (context.session !== null && context.session !== undefined) {
      throw redirect({ to: '/' });
    }
  },

  component: SignupPage,
});

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout tone="light">
      <div className="theme-light relative overflow-hidden bg-cream min-h-screen">
        <div
          aria-hidden
          className="absolute -top-32 -left-32 size-[26rem] rounded-full bg-grape/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 -right-32 size-[24rem] rounded-full bg-lime/20 blur-3xl pointer-events-none"
        />

        <div className="relative mx-auto max-w-md px-6 pt-36 pb-20 tablet-lg:pt-44">
          <div
            className={cn(
              'flex flex-col gap-6 rounded-[2.5rem] bg-paper p-8 md:p-10',
              'ring-1 ring-ink/5 shadow-xl shadow-ink/5'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

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

  if (emailConfirmRequired) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="grid place-items-center size-14 rounded-3xl bg-lime text-ink rotate-[-6deg]">
            <MailCheck className="size-7" />
          </div>
          <h1 className="font-extrabold tracking-tight text-2xl md:text-3xl text-ink">
            Revisa tu email
          </h1>
          <p className="text-sm text-ink-soft leading-relaxed">
            Te hemos enviado un enlace de confirmación. Haz clic en él para activar tu cuenta y
            poder iniciar sesión.
          </p>
          <Link
            to="/login"
            className="mt-2 text-sm font-semibold text-lime-deep hover:underline"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
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
          Crear cuenta
        </h1>
      </div>

      <SignupForm
        onSuccess={handleSuccess}
        onEmailConfirmationRequired={handleEmailConfirmationRequired}
      />

      <p className="text-center text-sm text-ink-soft">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-lime-deep font-semibold hover:underline transition-all">
          Iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}
