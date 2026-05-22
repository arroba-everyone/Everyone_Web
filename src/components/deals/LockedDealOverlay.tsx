import { Link } from '@tanstack/react-router';
import { Button } from '@everyone-web/ui/button';
import { Lock, Send } from 'lucide-react';
import { VITE_TELEGRAM_CHANNEL_URL } from '@everyone-web/constants/dotenv.constants';
import type { LockedDeal } from '@everyone-web/services/deals';
import { Card } from '@everyone-web/ui/card';

interface LockedDealOverlayProps {
  lockedDeal: LockedDeal;
}

export function LockedDealOverlay({ lockedDeal }: LockedDealOverlayProps) {
  return (
    <div className="relative">
      {/* Blurred card underneath */}
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        <Card className="flex flex-col overflow-hidden h-full">
          {lockedDeal.image_url && (
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={lockedDeal.image_url}
                alt={lockedDeal.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-base leading-tight line-clamp-2">
              {lockedDeal.title}
            </h3>
            {/* Price placeholder to preserve height */}
            <div className="mt-2 h-6 bg-muted rounded" />
          </div>
        </Card>
      </div>

      {/* Overlay with CTAs */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/60 backdrop-blur-sm p-4">
        <Lock className="h-8 w-8 text-muted-foreground" aria-hidden="true" />

        <p className="text-center text-sm font-medium text-foreground">
          Inicia sesión o únete al canal para ver esta oferta
        </p>

        <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
          <Button asChild variant="default" size="sm">
            <Link to="/login" search={{ redirect: '/deals' }}>
              Iniciar sesión
            </Link>
          </Button>

          {VITE_TELEGRAM_CHANNEL_URL && (
            <Button asChild variant="outline" size="sm">
              <a
                href={VITE_TELEGRAM_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Únete al Telegram
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
