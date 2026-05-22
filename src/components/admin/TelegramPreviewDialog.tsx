import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
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
import { DealImage } from '@everyone-web/components/admin/DealImage';
import { publishDealWithEditsFn } from '@everyone-web/services/deals';
import { calculateDiscount } from '@everyone-web/lib/deals/calculate-discount';
import { cn } from '@everyone-web/libs/utils';
import type { DealRow } from '@everyone-web/types/supabase';

interface TelegramPreviewDialogProps {
  deal: DealRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onReject?: (id: string) => void;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Two-column dialog for reviewing and publishing a deal to Telegram.
 *
 * Left column: live preview bubble (how the bot message will look).
 * Right column: editable hashtags + optional youtube review URL.
 *
 * On submit: calls publishDealWithEditsFn (single atomic UPDATE).
 * On success: router.invalidate() + close.
 * On error: show message, keep dialog open.
 */
export function TelegramPreviewDialog({
  deal,
  open,
  onOpenChange,
  onReject,
}: TelegramPreviewDialogProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [youtubeReviewUrl, setYoutubeReviewUrl] = useState('');
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [youtubeUrlError, setYoutubeUrlError] = useState(false);

  // Repopulate when the deal changes
  useEffect(() => {
    if (deal) {
      setTitle(deal.title);
      // Defensive strip of leading '#' — the bot may write hashtags with or without prefix
      setHashtags((deal.hashtags ?? []).map(t => (t.startsWith('#') ? t.slice(1) : t)));
      setYoutubeReviewUrl(deal.youtube_review_url ?? '');
      setPreviousPrice(deal.previous_price ?? null);
      setError(null);
      setYoutubeUrlError(false);
    }
  }, [deal]);

  // Derived: discount is computed on every render, no useMemo needed (trivial calc)
  const discount = deal ? calculateDiscount(deal.current_price, previousPrice) : null;

  function handleCancel() {
    onOpenChange(false);
  }

  async function handleSubmit() {
    if (!deal) return;

    // Validate youtube URL (optional but if set must be https)
    if (youtubeReviewUrl && !isValidUrl(youtubeReviewUrl)) {
      setYoutubeUrlError(true);
      return;
    }
    setYoutubeUrlError(false);

    setSubmitting(true);
    setError(null);

    try {
      await publishDealWithEditsFn({
        data: {
          id: deal.id,
          title,
          hashtags,
          youtube_review_url: youtubeReviewUrl || null,
          previous_price: previousPrice ?? 0,
        },
      });

      router.invalidate();
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al publicar la oferta';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!deal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <DialogTitle>Vista previa</DialogTitle>
            <a
              href={deal.original_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver en Amazon"
              className="inline-flex items-center gap-1 text-xs text-foreground/70 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Ver en Amazon</span>
            </a>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column: Telegram preview bubble + reject button */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
              Preview del mensaje
            </p>
            <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-lg flex flex-col gap-3">
              {/* Image */}
              <DealImage src={deal.image_url} alt={deal.title} className="rounded-xl max-h-48" />

              {/* Message body */}
              <div className="text-sm leading-relaxed space-y-1">
                <p data-testid="telegram-preview-title" className="font-bold">
                  {title}
                </p>
                <p>
                  <span className="text-primary glow-primary font-bold">
                    💶 {deal.current_price.toFixed(2)} €
                  </span>
                  {previousPrice != null && (
                    <span className="text-foreground/50 line-through ml-2 text-xs">
                      {previousPrice.toFixed(2)} €
                    </span>
                  )}
                  {discount != null && (
                    <span className="text-rose-400 ml-2 text-xs">(-{discount}%)</span>
                  )}
                </p>

                {/* Live hashtags preview */}
                {hashtags.length > 0 && (
                  <p
                    data-testid="telegram-preview-hashtags"
                    className="text-primary/80 text-xs flex flex-wrap gap-1"
                  >
                    {hashtags.map(t => (
                      <span key={t}>#{t}</span>
                    ))}
                  </p>
                )}

                {/* YouTube review link */}
                {youtubeReviewUrl && isValidUrl(youtubeReviewUrl) && (
                  <p className="text-xs text-foreground/60">
                    📹 <span className="underline">{youtubeReviewUrl}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Rechazar — reject deal without publishing */}
            {onReject && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onReject(deal.id);
                  onOpenChange(false);
                }}
              >
                Rechazar
              </Button>
            )}
          </div>

          {/* Right column: editable controls */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title-input">Título</Label>
              <Input
                id="title-input"
                type="text"
                placeholder="Título de la oferta"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="previous-price-input">Precio anterior (€)</Label>
              <Input
                id="previous-price-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="Precio anterior"
                value={previousPrice ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setPreviousPrice(val === '' ? null : parseFloat(val));
                }}
              />
              <span
                data-testid="calculated-discount-label"
                className="text-xs text-muted-foreground"
              >
                {discount != null ? `Descuento calculado: ${discount}%` : '—'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="hashtags-input">Hashtags</Label>
              <HashtagsInput
                value={hashtags}
                onChange={setHashtags}
                placeholder="Añadir hashtag…"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="youtube-url-input">URL reseña YouTube (opcional)</Label>
              <Input
                id="youtube-url-input"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeReviewUrl}
                onChange={e => {
                  setYoutubeReviewUrl(e.target.value);
                  setYoutubeUrlError(false);
                }}
                className={cn(youtubeUrlError && 'border-destructive')}
              />
              {youtubeUrlError && (
                <p data-testid="youtube-url-error" className="text-xs text-destructive">
                  La URL debe comenzar con https://
                </p>
              )}
            </div>

            {/* Server error */}
            {error && (
              <div
                role="alert"
                className="rounded-md bg-destructive/10 border border-destructive/30 p-3"
              >
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              submitting || title.trim() === '' || previousPrice == null || previousPrice <= 0
            }
          >
            {submitting ? 'Publicando…' : 'Publicar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
