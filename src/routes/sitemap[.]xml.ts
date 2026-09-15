import { createFileRoute } from '@tanstack/react-router';
import { getPublishedPostsForSitemap } from '@everyone-web/services/posts';
import { STATIC_PAGES, blogPostEntry, buildSitemapXml } from '@everyone-web/lib/sitemap/sitemap';

// El nombre del fichero lleva el punto escapado ([.]) para que la ruta sea
// /sitemap.xml y no /sitemap/xml.

/** Cuánto pueden cachear Netlify y los buscadores el sitemap: 1 hora. */
const CACHE_MAX_AGE_SECONDS = 60 * 60;

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        let postEntries: ReturnType<typeof blogPostEntry>[] = [];
        try {
          const posts = await getPublishedPostsForSitemap(request);
          postEntries = posts.map(post => blogPostEntry(post.slug, post.published_at));
        } catch (error) {
          // Si Supabase falla, se sirve el sitemap con las páginas fijas en vez
          // de un error: Google sigue teniendo las páginas principales.
          console.error('[sitemap.xml] No se pudieron leer los posts; se omiten:', error);
        }

        return new Response(buildSitemapXml([...STATIC_PAGES, ...postEntries]), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': `public, max-age=${CACHE_MAX_AGE_SECONDS}`,
          },
        });
      },
    },
  },
});
