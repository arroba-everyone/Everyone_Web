import React from 'react';
import { HeadContent, Scripts, createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { getSessionFn } from '@everyone-web/server/auth';

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
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      // REQ-FONT-1: A <link rel="preload"> for Outfit woff2 is intentionally omitted.
      // Google Fonts serves different woff2 URLs depending on User-Agent (browsers get woff2,
      // other UA types get ttf/woff). Hardcoding any specific gstatic.com URL would be brittle
      // (URL changes on font version bumps, and it would only preload for the UA that generated
      // the URL). The preconnect hints above ensure the DNS + TLS handshake is done early,
      // which covers the main latency. Self-hosting Outfit would be the correct solution for
      // a stable preload, but that is out of scope for this workstream (WS1 deferred).
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300..800&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
    ],
    scripts: [
      {
        // Re-apply the saved theme before paint to avoid a light flash.
        children:
          "(function(){try{if(localStorage.getItem('everyone-theme')==='dark'){document.documentElement.classList.add('theme-dark')}}catch(e){}})()",
      },
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
