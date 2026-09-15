// sitemap.ts — construcción del sitemap.xml (lógica pura, sin red).
//
// Lo sirve la ruta src/routes/sitemap[.]xml.ts y lo anuncia public/robots.txt.
// Formato: protocolo estándar de sitemaps (https://www.sitemaps.org/protocol.html).
// Solo se emiten <loc> y <lastmod>: Google ignora <priority> y <changefreq>.

export const SITE_URL = 'https://arrobaeveryone.com';

export interface SitemapEntry {
  /** URL absoluta, idéntica a la `canonical` que declara la página. */
  loc: string;
  /** Fecha de última modificación real (YYYY-MM-DD). Si no se sabe, se omite. */
  lastmod?: string;
}

/**
 * Páginas públicas fijas. Son las rutas que declaran `canonical` en su `head`;
 * si se añade una página pública nueva, hay que añadirla también aquí.
 * Sin `lastmod`: no hay una fecha fiable de modificación y Google recomienda
 * no inventarla.
 */
export const STATIC_PAGES: readonly SitemapEntry[] = [
  { loc: SITE_URL },
  { loc: `${SITE_URL}/aboutUs` },
  { loc: `${SITE_URL}/projects` },
  { loc: `${SITE_URL}/contact` },
  { loc: `${SITE_URL}/blog` },
];

/** Entrada de un post del blog. Misma URL que su `canonical` en blog/$slug.tsx. */
export function blogPostEntry(slug: string, publishedAt: string | null): SitemapEntry {
  const entry: SitemapEntry = { loc: `${SITE_URL}/blog/${encodeURIComponent(slug)}` };
  const date = publishedAt ? new Date(publishedAt) : null;
  if (date && !Number.isNaN(date.getTime())) {
    entry.lastmod = date.toISOString().slice(0, 10);
  }
  return entry;
}

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, char => XML_ESCAPES[char] ?? char);
}

export function buildSitemapXml(entries: readonly SitemapEntry[]): string {
  const urls = entries.map(entry => {
    const lastmod = entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
    return `  <url><loc>${escapeXml(entry.loc)}</loc>${lastmod}</url>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}
