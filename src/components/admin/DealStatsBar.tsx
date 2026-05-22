import { Card, CardContent } from '@everyone-web/ui/card';
import { cn } from '@everyone-web/libs/utils';

interface DealStatsBarProps {
  counts: {
    pending: number;
    published: number;
    rejected: number;
  };
}

interface StatCardProps {
  label: string;
  value: number;
  colorClasses: string;
  numberClasses: string;
  testId?: string;
}

function StatCard({ label, value, colorClasses, numberClasses, testId }: StatCardProps) {
  return (
    <Card className={cn('border', colorClasses)}>
      <CardContent className="flex flex-col items-center justify-center py-4 gap-1">
        <span
          data-testid={testId}
          className={cn('text-3xl md:text-4xl font-bold tabular-nums', numberClasses)}
        >
          {value}
        </span>
        <span className="text-xs text-foreground/60 font-medium uppercase tracking-wide">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}

/**
 * Displays three stat cards: pending (amber), published (primary/glow), rejected (rose).
 * Pure component — no internal state.
 */
export function DealStatsBar({ counts }: DealStatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      <StatCard
        label="Pendientes"
        value={counts.pending}
        colorClasses="border-amber-500/30 bg-amber-500/5"
        numberClasses="text-amber-300"
      />
      <StatCard
        label="Publicadas"
        value={counts.published}
        colorClasses="border-primary/30 bg-primary/5"
        numberClasses="text-primary glow-primary"
        testId="published-count"
      />
      <StatCard
        label="Rechazadas"
        value={counts.rejected}
        colorClasses="border-rose-500/30 bg-rose-500/5"
        numberClasses="text-rose-300"
      />
    </div>
  );
}
