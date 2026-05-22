import React from 'react';
import { HeadContent, Scripts, createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { getSessionFn } from '@everyone-web/server/auth.server';

import appCss from '../styles.css?url';

import type { QueryClient } from '@tanstack/react-query';
import type { Session } from '@everyone-web/types/session';

interface MyRouterContext {
  queryClient: QueryClient;
  session: Session | null;
}

/**
 * Exported for testing. Called as `beforeLoad` on the root route.
 * Returns `{ session }` so TanStack Router merges it into the route context.
 * (Mutating `context.session` directly does NOT propagate.)
 */
export async function beforeLoadHandler(): Promise<{ session: Session | null }> {
  const session = await getSessionFn();
  return { session };
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: '@Everyone' },
      { name: 'theme-color', content: '#000000' },
      { property: 'og:site_name', content: '@Everyone' },
      { property: 'og:locale', content: 'es_ES' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
    ],
  }),

  beforeLoad: beforeLoadHandler,

  component: RootComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  return <Outlet />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'Tanstack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
