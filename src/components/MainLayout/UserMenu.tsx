import { useRouter, useNavigate, Link } from '@tanstack/react-router';
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

export function UserMenu({ session }: UserMenuProps) {
  const router = useRouter();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    await router.invalidate();
    await navigate({ to: '/' });
  };

  const initials = (session.displayName || session.email).slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          aria-label={`Menú de usuario: ${session.displayName || session.email}`}
        >
          <Avatar className="h-9 w-9">
            {session.avatarUrl && <AvatarImage src={session.avatarUrl} alt={session.displayName} />}
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className={cn(
          'rounded-3xl bg-background border-primary/20 p-2',
          'min-w-[14rem] shadow-lg'
        )}
      >
        {/* Identity header (non-clickable) */}
        <div className="px-3 py-2 flex flex-col gap-0.5">
          <p className="font-semibold text-sm truncate">{session.displayName}</p>
          <p className="text-xs text-foreground/60 truncate">{session.email}</p>
        </div>

        <DropdownMenuSeparator className="bg-foreground/10" />

        {/* Panel admin — only for admins */}
        {session.role === 'admin' && (
          <>
            <DropdownMenuItem
              asChild
              className={cn(
                'rounded-full px-5 py-2.5 cursor-pointer text-sm font-semibold',
                'text-primary focus:bg-primary/10 focus:text-primary'
              )}
            >
              <Link to="/deals/manage" className="w-full">
                Panel admin
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem
          asChild
          className={cn(
            'rounded-full px-5 py-2.5 cursor-pointer text-sm font-semibold',
            'text-foreground focus:bg-foreground/5 focus:text-primary'
          )}
        >
          <Link to="/settings" className="w-full">
            Ajustes
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-foreground/10" />

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
