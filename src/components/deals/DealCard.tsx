import { Card, CardContent, CardFooter, CardHeader } from '@everyone-web/ui/card';
import { Badge } from '@everyone-web/ui/badge';
import { ExternalLink } from 'lucide-react';
import type { PublicDeal } from '@everyone-web/services/deals';

interface DealCardProps {
  deal: PublicDeal;
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      {deal.image_url && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover" />
        </div>
      )}

      <CardHeader className="pb-2">
        <h3 className="font-semibold text-base leading-tight line-clamp-2">{deal.title}</h3>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {deal.current_price != null && (
            <span className="text-xl font-bold text-foreground">
              {deal.current_price.toFixed(2)} €
            </span>
          )}

          {deal.previous_price != null && (
            <span className="text-sm text-muted-foreground line-through">
              {deal.previous_price.toFixed(2)} €
            </span>
          )}

          {deal.discount_percent != null && (
            <Badge variant="destructive" className="text-xs">
              -{Math.round(deal.discount_percent)}%
            </Badge>
          )}
        </div>
      </CardContent>

      {deal.affiliate_url && (
        <CardFooter className="pt-2">
          <a
            href={deal.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-semibold text-lime-deep hover:underline"
          >
            Ver oferta
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardFooter>
      )}
    </Card>
  );
}
