import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@everyone-web/ui/form';
import { Input } from '@everyone-web/ui/input';
import { Button } from '@everyone-web/ui/button';
import { GoogleButton } from '@everyone-web/components/auth/GoogleButton';
import { AuthDivider } from '@everyone-web/components/auth/AuthDivider';
import { loginSchema } from '@everyone-web/lib/validators/auth';
import {
  signInWithPassword,
  signInWithGoogle,
  requestPasswordReset,
} from '@everyone-web/libs/auth';
import type { LoginInput } from '@everyone-web/lib/validators/auth';
import type { Session } from '@everyone-web/types/session';

interface LoginFormProps {
  onSuccess: (session: Session) => void;
}

/**
 * Login form with email + password and Google OAuth.
 * Decision: inline password-reset request (shows a small sub-form on the page
 * rather than navigating away) — simpler UX for a single-page flow.
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSubmit = async (data: LoginInput) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await signInWithPassword(data.email, data.password);
      if (!result.ok) {
        setServerError(result.error.message);
        return;
      }
      onSuccess(result.data.session);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setServerError(null);
    await signInWithGoogle();
  };

  const handleResetRequest = async () => {
    if (!resetEmail) return;
    const result = await requestPasswordReset(resetEmail);
    if (result.ok) {
      setResetSent(true);
    } else {
      setServerError(result.error.message);
    }
  };

  if (showResetForm) {
    return (
      <div className="flex flex-col gap-4">
        {resetSent ? (
          <p className="text-sm text-green-600">
            Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Introduce tu email para recibir un enlace de restablecimiento.
            </p>
            <label htmlFor="reset-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="reset-email"
              type="email"
              placeholder="tu@email.com"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
            />
            <Button type="button" onClick={handleResetRequest} className="w-full">
              Enviar enlace
            </Button>
          </>
        )}
        <button
          type="button"
          onClick={() => setShowResetForm(false)}
          className="text-sm text-primary hover:underline self-start"
        >
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4" noValidate>
        <GoogleButton onClick={handleGoogle} />
        <AuthDivider />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="login-email">Email</FormLabel>
              <FormControl>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="login-password">Contraseña</FormLabel>
              <FormControl>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowResetForm(true)}
          className="text-sm text-primary hover:underline self-start"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </Form>
  );
}
