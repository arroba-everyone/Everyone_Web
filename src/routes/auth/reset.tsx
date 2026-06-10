// Password reset completion route — /auth/reset
//
// The user arrives here after clicking the reset link from their email.
// The link goes to /auth/callback which exchanges the code and then
// redirects here (recovery flow, design confirmed default #4).
//
// On success: navigates to /login with a flash message.

import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
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
import { passwordResetCompleteSchema } from '@everyone-web/lib/validators/auth';
import { resetPassword } from '@everyone-web/libs/auth';
import type { PasswordResetCompleteInput } from '@everyone-web/lib/validators/auth';

export const Route = createFileRoute('/auth/reset')({
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordResetCompleteInput>({
    resolver: zodResolver(passwordResetCompleteSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleSubmit = async (data: PasswordResetCompleteInput) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await resetPassword(data.password);
      if (!result.ok) {
        setServerError(result.error.message);
        return;
      }
      void navigate({
        to: '/login',
        search: {
          message: 'Contraseña actualizada correctamente. Inicia sesión con tu nueva contraseña.',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="theme-light flex min-h-screen items-center justify-center px-4 bg-cream text-ink">
      <div className="w-full max-w-sm rounded-[2.5rem] bg-paper p-8 ring-1 ring-ink/5 shadow-xl shadow-ink/5">
        <h1 className="mb-6 text-center text-2xl font-extrabold tracking-tight">
          Nueva contraseña
        </h1>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          Introduce tu nueva contraseña para completar el restablecimiento.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reset-password">Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input
                      id="reset-password"
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
                  <FormLabel htmlFor="reset-confirm-password">Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input
                      id="reset-confirm-password"
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
              {isSubmitting ? 'Guardando...' : 'Guardar nueva contraseña'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
