import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { QueryClient } from '@tanstack/react-query';

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
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};
