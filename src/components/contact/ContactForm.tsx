import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, PartyPopper } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@everyone-web/ui/form';
import { Input } from '@everyone-web/ui/input';
import { Textarea } from '@everyone-web/ui/textarea';
import { Button } from '@everyone-web/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@everyone-web/ui/select';
import { cn } from '@everyone-web/libs/utils';
import { contactSchema, PROJECT_TYPES } from '@everyone-web/lib/validators/contact';
import { submitContactRequestFn } from '@everyone-web/services/contact';
import type { ContactInput } from '@everyone-web/lib/validators/contact';

/**
 * Public contact form. Stores the request in Supabase via server fn.
 * Includes a honeypot field ("website") that stays hidden for humans.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      projectType: 'web',
      message: '',
      website: '',
    },
  });

  const handleSubmit = async (data: ContactInput) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await submitContactRequestFn({ data });
      setSent(true);
    } catch {
      setServerError(
        'No hemos podido enviar tu mensaje. Inténtalo de nuevo o escríbenos directamente a contacto@arrobaeveryone.com.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div
        role="status"
        className="flex flex-col items-center text-center gap-4 py-12 tablet-lg:py-16"
      >
        <div className="grid place-items-center size-16 rounded-3xl bg-lime text-ink-solid rotate-[-6deg]">
          <PartyPopper className="size-8" />
        </div>
        <h3 className="text-2xl font-extrabold tracking-tight text-ink">¡Recibido!</h3>
        <p className="max-w-sm text-ink-soft leading-relaxed">
          Gracias por contarnos tu proyecto. Te respondemos en menos de 48 horas con los
          siguientes pasos.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="contact-name">Tu nombre</FormLabel>
                <FormControl>
                  <Input id="contact-name" placeholder="María García" autoComplete="name" {...field} />
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
                <FormLabel htmlFor="contact-email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="contact-email"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="contact-company">Empresa (opcional)</FormLabel>
                <FormControl>
                  <Input
                    id="contact-company"
                    placeholder="Tu negocio"
                    autoComplete="organization"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Qué necesitas?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Elige una opción" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="theme-light">
                    {PROJECT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="contact-message">Cuéntanos tu proyecto</FormLabel>
              <FormControl>
                <Textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Qué problema quieres resolver, plazos, lo que tengas en mente…"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot: hidden from humans (and screen readers), tempting for bots */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
              <label htmlFor="contact-website">No rellenes este campo</label>
              <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...field} />
            </div>
          )}
        />

        {serverError && (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'group self-start rounded-full bg-ink text-paper hover:bg-ink/90',
            'h-12 px-7 font-bold text-base'
          )}
        >
          {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </form>
    </Form>
  );
}
