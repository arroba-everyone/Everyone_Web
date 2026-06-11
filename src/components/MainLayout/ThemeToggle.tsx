import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@everyone-web/libs/utils';

const STORAGE_KEY = 'everyone-theme';

/**
 * Light/dark switch for the public navbar. Defaults to light.
 * Toggles `.theme-dark` on <html> so Radix portals flip too, and
 * persists the choice in localStorage (re-applied on load by the
 * inline script in __root.tsx to avoid a flash).
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Read the real state after hydration (the inline script may have
  // already applied .theme-dark before React mounted).
  useEffect(() => {
    setDark(document.documentElement.classList.contains('theme-dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('theme-dark', next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // localStorage unavailable (private mode) — theme just won't persist
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      onClick={toggle}
      className={cn(
        'relative inline-flex h-8 w-14 shrink-0 items-center rounded-full cursor-pointer',
        'ring-1 ring-ink/10 transition-colors',
        dark ? 'bg-ink/80' : 'bg-ink/5'
      )}
    >
      <span
        className={cn(
          'grid place-items-center size-6 rounded-full bg-paper shadow-md',
          'transition-transform duration-300',
          dark ? 'translate-x-7' : 'translate-x-1'
        )}
      >
        {dark ? (
          <Moon className="size-3.5 text-grape-deep" />
        ) : (
          <Sun className="size-3.5 text-lime-deep" />
        )}
      </span>
    </button>
  );
}
