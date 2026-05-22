import { cn } from '@everyone-web/libs/utils';

interface AuthDividerProps {
  className?: string;
}

/**
 * Visual divider with centred "o" text.
 * Used between the Google OAuth button and the email+password form.
 * Pure presentational — no state, no interactions.
 */
export function AuthDivider({ className }: AuthDividerProps) {
  return (
    <div className={cn('flex items-center gap-4', className)} role="separator" aria-hidden="true">
      <div className="h-px flex-1 bg-border" />
      <span className="text-sm text-muted-foreground">o</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
