import { useState } from 'react';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MainLayout } from '@everyone-web/components/MainLayout/MainLayout';
import { Card } from '@everyone-web/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@everyone-web/ui/avatar';
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
import { profileSchema, type ProfileInput } from '@everyone-web/lib/validators/auth';
import { updateMyProfileFn } from '@everyone-web/services/users';
import { cn } from '@everyone-web/libs/utils';
import type { Session } from '@everyone-web/types/session';
import type { UserRecord } from '@everyone-web/types/supabase';

export const Route = createFileRoute('/settings')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/login', search: { redirect: '/settings' } });
    }
  },
  component: SettingsPage,
});

function SettingsPage() {
  const session = Route.useRouteContext().session as Session;
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: session.displayName,
      avatarUrl: session.avatarUrl ?? '',
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    setServerError(null);
    try {
      await (
        updateMyProfileFn as unknown as (input: {
          data: { displayName: string; avatarUrl: string };
        }) => Promise<UserRecord>
      )({
        data: {
          displayName: values.displayName,
          avatarUrl: values.avatarUrl ?? '',
        },
      });
      await router.invalidate();
      setSavedAt(Date.now());
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al guardar');
    }
  });

  const watchedAvatar = form.watch('avatarUrl') ?? '';
  const watchedName = form.watch('displayName') ?? session.displayName;
  const initials = (watchedName || session.email).slice(0, 2).toUpperCase();

  return (
    <MainLayout tone="light">
      <div
        className={cn(
          'theme-light min-h-screen w-full bg-cream text-ink',
          'px-4 md:px-8 tablet-lg:px-10 laptop:px-14 laptop-lg:px-20',
          'pt-28 md:pt-24 tablet-lg:pt-32 laptop:pt-34',
          'pb-16'
        )}
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl md:text-4xl tablet-lg:text-5xl">Ajustes</h1>
            <p className="text-base md:text-lg text-foreground/70">
              Edita tu nombre y avatar. El email y el rol no se cambian desde aquí.
            </p>
          </div>

          <Card
            className={cn(
              'bg-card overflow-hidden',
              'rounded-3xl tablet-lg:rounded-[2rem]',
              'p-6 md:p-8 tablet-lg:p-10'
            )}
          >
            {/* Read-only identity row */}
            <div className="flex items-center gap-4 pb-6 mb-6 border-b border-foreground/10">
              <Avatar className="h-16 w-16">
                {watchedAvatar.trim().length > 0 && <AvatarImage src={watchedAvatar} alt={watchedName} />}
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="font-semibold text-lg truncate">{watchedName || '—'}</p>
                <p className="text-sm text-foreground/60 truncate">{session.email}</p>
                <p className="text-xs text-foreground/40 capitalize">{session.role}</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="settings-name">Nombre</FormLabel>
                      <FormControl>
                        <Input
                          id="settings-name"
                          placeholder="Cómo quieres que te llamemos"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="settings-avatar">URL del avatar</FormLabel>
                      <FormControl>
                        <Input
                          id="settings-avatar"
                          placeholder="https://… (opcional)"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {serverError && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    {serverError}
                  </div>
                )}

                {savedAt !== null && !serverError && (
                  <div
                    role="status"
                    className="rounded-2xl bg-lime-tint ring-1 ring-lime-deep/20 p-3 text-sm text-lime-deep font-semibold"
                  >
                    Cambios guardados.
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
