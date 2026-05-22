import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@everyone-web/ui/dialog';
import { Button } from '@everyone-web/ui/button';
import { Input } from '@everyone-web/ui/input';
import { Label } from '@everyone-web/ui/label';
import { HashtagsInput } from '@everyone-web/components/admin/HashtagsInput';
import { createDealFn } from '@everyone-web/services/deals';
import { HASHTAG_REGEX, MAX_HASHTAGS } from '@everyone-web/lib/validators/deal';
import { cn } from '@everyone-web/libs/utils';

// Local form schema — uses string inputs and manual number parsing (matches existing DealEditDialog pattern)
const addDealFormSchema = z.object({
  original_url: z.string().url('La URL original no es válida (debe empezar con https://)'),
  title: z.string().min(1, 'El título no puede estar vacío'),
  current_price: z.number().positive('El precio debe ser mayor que 0'),
  previous_price: z.number().positive().nullable().optional(),
  image_url: z.string().nullable().optional(),
  source: z.string().min(1, 'Indica la fuente'),
  affiliate_url: z.string().nullable().optional(),
  hashtags: z.array(z.string().regex(HASHTAG_REGEX)).max(MAX_HASHTAGS).nullable().optional(),
});

type AddDealFormValues = z.infer<typeof addDealFormSchema>;

interface AddDealDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

/**
 * Modal form for creating a new deal manually (Option A — no scraping).
 *
 * Required fields: original_url, title, current_price.
 * Optional fields: previous_price, image_url, source, affiliate_url, hashtags.
 *
 * On submit: calls createDealFn (inserts with status='pending').
 * On success: router.invalidate() + reset + close.
 * On error: show message, keep dialog open.
 */
export function AddDealDialog({ open, onOpenChange }: AddDealDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddDealFormValues>({
    resolver: zodResolver(addDealFormSchema),
    defaultValues: {
      title: '',
      original_url: '',
      source: 'manual',
      hashtags: [],
    },
  });

  async function onSubmit(values: AddDealFormValues) {
    setServerError(null);
    try {
      await createDealFn({ data: values });
      router.invalidate();
      reset();
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear la oferta';
      setServerError(message);
    }
  }

  function handleClose() {
    reset();
    setServerError(null);
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={v => {
        if (!v) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Añadir oferta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {/* Required fields */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="original-url-input">URL original (requerida)</Label>
            <Input
              id="original-url-input"
              type="url"
              placeholder="https://amazon.es/dp/..."
              {...register('original_url')}
              className={cn(errors.original_url && 'border-destructive')}
            />
            {errors.original_url && (
              <p data-testid="original-url-error" role="alert" className="text-xs text-destructive">
                {errors.original_url.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title-input">Título</Label>
            <Input
              id="title-input"
              type="text"
              placeholder="Nombre del producto"
              {...register('title')}
              className={cn(errors.title && 'border-destructive')}
            />
            {errors.title && (
              <p role="alert" className="text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-price-input">Precio actual (€)</Label>
            <Controller
              name="current_price"
              control={control}
              render={({ field }) => (
                <Input
                  id="current-price-input"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="29.99"
                  value={field.value ?? ''}
                  onChange={e =>
                    field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  className={cn(errors.current_price && 'border-destructive')}
                />
              )}
            />
            {errors.current_price && (
              <p role="alert" className="text-xs text-destructive">
                {errors.current_price.message}
              </p>
            )}
          </div>

          {/* Optional fields */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="previous-price-input">Precio anterior (opcional)</Label>
            <Controller
              name="previous_price"
              control={control}
              render={({ field }) => (
                <Input
                  id="previous-price-input"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="59.99"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="image-url-input">URL de imagen (opcional)</Label>
            <Input
              id="image-url-input"
              type="url"
              placeholder="https://..."
              {...register('image_url')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="source-input">Fuente</Label>
            <Input
              id="source-input"
              type="text"
              placeholder="amazon / chollometro / manual…"
              {...register('source')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="affiliate-url-input">URL de afiliado (opcional)</Label>
            <Input
              id="affiliate-url-input"
              type="url"
              placeholder="https://..."
              {...register('affiliate_url')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Hashtags (opcional)</Label>
            <Controller
              name="hashtags"
              control={control}
              render={({ field }) => (
                <HashtagsInput
                  value={(field.value as string[]) ?? []}
                  onChange={field.onChange}
                  placeholder="Añadir hashtag…"
                />
              )}
            />
          </div>

          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              className="rounded-md bg-destructive/10 border border-destructive/30 p-3"
            >
              <p className="text-xs text-destructive">{serverError}</p>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando…' : 'Añadir oferta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
