import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@everyone-web/ui/dialog';
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
import { dealEditSchema, type DealEditInput } from '@everyone-web/lib/validators/deal';
import { updateDealFn } from '@everyone-web/services/deals';
import { useRouter } from '@tanstack/react-router';
import type { DealRow } from '@everyone-web/types/supabase';

interface DealEditDialogProps {
  deal: DealRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function DealEditDialog({ deal, open, onOpenChange }: DealEditDialogProps) {
  const router = useRouter();

  const form = useForm<DealEditInput>({
    resolver: zodResolver(dealEditSchema),
    defaultValues: {
      title: '',
      current_price: 0,
      original_url: '',
      source: '',
    },
  });

  // Re-populate when deal changes
  useEffect(() => {
    if (deal) {
      form.reset({
        title: deal.title,
        current_price: deal.current_price,
        previous_price: deal.previous_price ?? undefined,
        average_price: deal.average_price ?? undefined,
        discount_percent: deal.discount_percent ?? undefined,
        image_url: deal.image_url ?? undefined,
        original_url: deal.original_url,
        affiliate_url: deal.affiliate_url ?? undefined,
        source: deal.source,
        youtube_review_url: deal.youtube_review_url ?? undefined,
        hashtags: deal.hashtags ?? [],
      });
    }
  }, [deal, form]);

  const onSubmit = async (values: DealEditInput) => {
    if (!deal) return;
    try {
      await (
        updateDealFn as unknown as (input: {
          id: string;
          fields: DealEditInput;
        }) => Promise<unknown>
      )({
        id: deal.id,
        fields: values,
      });
      router.invalidate();
      onOpenChange(false);
    } catch (err) {
      console.error('Error al guardar oferta:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar oferta</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Título de la oferta" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="current_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio actual (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previous_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio anterior (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="average_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio medio (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descuento (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        max={100}
                        {...field}
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL imagen</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affiliate_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL afiliado</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="youtube_review_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL reseña YouTube</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="https://youtube.com/..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Guardar cambios
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
