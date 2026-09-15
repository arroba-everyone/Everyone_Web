import { describe, it, expect, vi, beforeEach } from 'vitest';

// createFileRoute(path)(options) devuelve aquí las opciones tal cual, para poder
// llamar al handler GET directamente.
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: unknown) => options,
}));

vi.mock('@everyone-web/services/posts', () => ({
  getPublishedPostsForSitemap: vi.fn(),
}));

type GetHandler = (ctx: { request: Request }) => Promise<Response>;

async function callSitemap(): Promise<Response> {
  const mod = await import('@everyone-web/routes/sitemap[.]xml');
  const route = mod.Route as unknown as { server: { handlers: { GET: GetHandler } } };
  return route.server.handlers.GET({
    request: new Request('https://arrobaeveryone.com/sitemap.xml'),
  });
}

describe('/sitemap.xml', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('serves XML with the static pages and the published posts', async () => {
    const { getPublishedPostsForSitemap } = await import('@everyone-web/services/posts');
    vi.mocked(getPublishedPostsForSitemap).mockResolvedValue([
      { slug: 'primer-post', published_at: '2026-09-01T10:00:00.000Z' },
    ]);

    const response = await callSitemap();
    const xml = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');
    expect(xml).toContain('<loc>https://arrobaeveryone.com</loc>');
    expect(xml).toContain(
      '<loc>https://arrobaeveryone.com/blog/primer-post</loc><lastmod>2026-09-01</lastmod>'
    );
  });

  it('still serves the static pages when Supabase fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { getPublishedPostsForSitemap } = await import('@everyone-web/services/posts');
    vi.mocked(getPublishedPostsForSitemap).mockRejectedValue(new TypeError('fetch failed'));

    const response = await callSitemap();
    const xml = await response.text();

    expect(response.status).toBe(200);
    expect(xml).toContain('<loc>https://arrobaeveryone.com/contact</loc>');
    expect(xml).not.toContain('/blog/');
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
