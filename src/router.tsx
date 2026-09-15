import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { QueryClient } from '@tanstack/react-query';
import { RouteError } from '@everyone-web/components/RouteError/RouteError';

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1 * 60 * 60 * 1000,
        gcTime: 1 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      session: null,
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Pantalla de error para cualquier ruta que no defina la suya propia.
    defaultErrorComponent: RouteError,
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};
