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
import { signupSchema } from '@everyone-web/lib/validators/auth';
import { signUpWithPassword, signInWithGoogle } from '@everyone-web/libs/auth';
import type { SignupInput } from '@everyone-web/lib/validators/auth';
import type { Session } from '@everyone-web/types/session';

interface SignupFormProps {
  onSuccess: (session: Session) => void;
  onEmailConfirmationRequired: () => void;
}

export function SignupForm({ onSuccess, onEmailConfirmationRequired }: SignupFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  const handleSubmit = async (data: SignupInput) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await signUpWithPassword(data.email, data.password, data.displayName);
      if (!result.ok) {
        setServerError(result.error.message);
        return;
      }
      if (result.data.session === null) {
        // Email confirmation required
        onEmailConfirmationRequired();
      } else {
        onSuccess(result.data.session);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setServerError(null);
    await signInWithGoogle();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4" noValidate>
        <GoogleButton onClick={handleGoogle} />
        <AuthDivider />

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="signup-name">Nombre</FormLabel>
              <FormControl>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Cómo quieres que te llamemos"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="signup-email">Email</FormLabel>
              <FormControl>
                <Input
                  id="signup-email"
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
              <FormLabel htmlFor="signup-password">Contraseña</FormLabel>
              <FormControl>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="signup-confirm-password">Confirmar contraseña</FormLabel>
              <FormControl>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>
    </Form>
  );
}
