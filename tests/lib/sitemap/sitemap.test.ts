import { describe, it, expect } from 'vitest';
import {
  SITE_URL,
  STATIC_PAGES,
  blogPostEntry,
  buildSitemapXml,
} from '@everyone-web/lib/sitemap/sitemap';

describe('STATIC_PAGES', () => {
  it('lists the public pages with absolute canonical URLs', () => {
    expect(STATIC_PAGES.map(page => page.loc)).toEqual([
      'https://arrobaeveryone.com',
      'https://arrobaeveryone.com/aboutUs',
      'https://arrobaeveryone.com/projects',
      'https://arrobaeveryone.com/contact',
      'https://arrobaeveryone.com/blog',
    ]);
  });

  it('never includes private or auth routes', () => {
    const locs = STATIC_PAGES.map(page => page.loc).join(' ');
    expect(locs).not.toMatch(/login|settings|auth|manage|admin/);
  });
});

describe('blogPostEntry()', () => {
  it('builds the same URL the post declares as canonical', () => {
    expect(blogPostEntry('mi-post', null).loc).toBe(`${SITE_URL}/blog/mi-post`);
  });

  it('uses the publication date as lastmod (YYYY-MM-DD)', () => {
    expect(blogPostEntry('mi-post', '2026-08-25T11:33:02.000Z').lastmod).toBe('2026-08-25');
  });

  it('omits lastmod when the date is missing or invalid', () => {
    expect(blogPostEntry('a', null)).not.toHaveProperty('lastmod');
    expect(blogPostEntry('a', 'not-a-date')).not.toHaveProperty('lastmod');
  });

  it('encodes unsafe characters in the slug', () => {
    expect(blogPostEntry('año nuevo', null).loc).toBe(`${SITE_URL}/blog/a%C3%B1o%20nuevo`);
  });
});

describe('buildSitemapXml()', () => {
  it('produces a valid urlset with loc and optional lastmod', () => {
    const xml = buildSitemapXml([
      { loc: 'https://arrobaeveryone.com' },
      { loc: 'https://arrobaeveryone.com/blog/x', lastmod: '2026-09-01' },
    ]);

    expect(xml).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url><loc>https://arrobaeveryone.com</loc></url>',
        '  <url><loc>https://arrobaeveryone.com/blog/x</loc><lastmod>2026-09-01</lastmod></url>',
        '</urlset>',
        '',
      ].join('\n')
    );
  });

  it('escapes XML special characters', () => {
    const xml = buildSitemapXml([{ loc: 'https://arrobaeveryone.com/?a=1&b=<2>' }]);
    expect(xml).toContain('<loc>https://arrobaeveryone.com/?a=1&amp;b=&lt;2&gt;</loc>');
  });

  it('is parseable XML', () => {
    const xml = buildSitemapXml([...STATIC_PAGES, blogPostEntry('x&y', '2026-01-01')]);
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0);
    expect(doc.getElementsByTagName('url')).toHaveLength(STATIC_PAGES.length + 1);
  });
});
