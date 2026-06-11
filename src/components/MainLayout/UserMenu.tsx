import { useRouter, useNavigate, useRouterState, Link } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@everyone-web/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@everyone-web/ui/avatar';
import { signOut } from '@everyone-web/libs/auth';
import { cn } from '@everyone-web/libs/utils';
import type { Session } from '@everyone-web/types/session';

interface UserMenuProps {
  session: Session;
}

const ADMIN_PATHS = ['/contacts/manage', '/deals/manage', '/blog/manage'];

export function UserMenu({ session }: UserMenuProps) {
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });

  const handleSignOut = async () => {
    await signOut();
    // Navigate BEFORE invalidating: if we are on an admin route, re-running
    // its beforeLoad without a session would bounce us to /login instead of
    // the landing page.
    await navigate({ to: '/' });
    await router.invalidate();
  };

  const initials = (session.displayName || session.email).slice(0, 2).toUpperCase();

  const inAdminPanel = ADMIN_PATHS.some(p => pathname.startsWith(p));
  const inSettings = pathname.startsWith('/settings');

  const itemClass = (active: boolean) =>
    cn(
      'rounded-full px-5 py-2.5 cursor-pointer text-sm font-semibold',
      active
        ? 'text-lime-deep bg-lime-tint focus:bg-lime-tint focus:text-lime-deep'
        : 'text-ink focus:bg-ink/5 focus:text-ink'
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-deep cursor-pointer"
          aria-label={`Menú de usuario: ${session.displayName || session.email}`}
        >
          <Avatar className="h-9 w-9">
            {session.avatarUrl && <AvatarImage src={session.avatarUrl} alt={session.displayName} />}
            <AvatarFallback className="bg-lime text-ink-solid text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      {/* Styled with v2 tokens (not shadcn vars) so it looks identical no matter
          which page the portal mounts on — admin, settings or public. */}
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className={cn(
          'rounded-3xl bg-paper text-ink border-ink/10 p-2',
          'min-w-[14rem] shadow-lg shadow-ink/10'
        )}
      >
        {/* Identity header (non-clickable) */}
        <div className="px-3 py-2 flex flex-col gap-0.5">
          <p className="font-semibold text-sm truncate text-ink">{session.displayName}</p>
          <p className="text-xs text-ink-soft truncate">{session.email}</p>
        </div>

        <DropdownMenuSeparator className="bg-ink/10" />

        {/* Panel admin — only for admins */}
        {session.role === 'admin' && (
          <DropdownMenuItem asChild className={itemClass(inAdminPanel)}>
            <Link to="/contacts/manage" className="w-full">
              Panel admin
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild className={itemClass(inSettings)}>
          <Link to="/settings" className="w-full">
            Ajustes
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-ink/10" />

        <DropdownMenuItem
          onClick={() => void handleSignOut()}
          className={cn(
            'rounded-full px-5 py-2.5 cursor-pointer text-sm font-semibold',
            'text-destructive focus:text-destructive focus:bg-destructive/10'
          )}
        >
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
