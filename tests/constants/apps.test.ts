import { describe, it, expect } from 'vitest';
import { APPS } from '@everyone-web/constants/apps';

/** IDs de las fichas publicadas. Si cambian, hay que cambiar también las URLs. */
const APP_STORE_IDS = {
  spotter: 'id6755760038',
  inedito: 'id6783731687',
  loop: 'id6785017855',
} as const;

const PLAY_PACKAGES = {
  spotter: 'com.spotter.com',
  inedito: 'com.everyone.inedito',
  loop: 'com.everyone.loop',
} as const;

describe('APPS', () => {
  it('lists Spotter, Inédito and Loop, in that order', () => {
    expect(APPS.map(app => app.id)).toEqual(['spotter', 'inedito', 'loop']);
  });

  it('does not include NutrIA', () => {
    expect(JSON.stringify(APPS)).not.toMatch(/nutr/i);
  });

  it.each(APPS)('$name links to its own App Store listing', ({ id, stores }) => {
    const url = new URL(stores.ios);
    expect(url.origin).toBe('https://apps.apple.com');
    expect(url.pathname.endsWith(APP_STORE_IDS[id])).toBe(true);
  });

  it.each(APPS)('$name links to its own Google Play listing', ({ id, stores }) => {
    const url = new URL(stores.android);
    expect(url.origin).toBe('https://play.google.com');
    expect(url.pathname).toBe('/store/apps/details');
    expect(url.searchParams.get('id')).toBe(PLAY_PACKAGES[id]);
  });

  it('never repeats a store URL across apps (guards against copy-paste)', () => {
    const urls = APPS.flatMap(app => [app.stores.ios, app.stores.android]);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('keeps tracking parameters out of the store links', () => {
    for (const app of APPS) {
      expect(app.stores.android).not.toMatch(/utm_/);
      expect(app.stores.ios).not.toMatch(/utm_|\?uo=/);
    }
  });

  it.each(APPS)('$name has the screenshots it declares, each with alt text', ({ screenshots }) => {
    expect(screenshots.length).toBeGreaterThan(0);
    for (const screenshot of screenshots) {
      expect(screenshot.src).toMatch(/\.webp/);
      expect(screenshot.alt.length).toBeGreaterThan(10);
    }
  });

  it('has the expected number of screenshots per app', () => {
    const counts = Object.fromEntries(APPS.map(app => [app.id, app.screenshots.length]));
    expect(counts).toEqual({ spotter: 5, inedito: 5, loop: 8 });
  });

  it.each(APPS)('$name keeps highlights to at most four', ({ highlights }) => {
    expect(highlights.length).toBeLessThanOrEqual(4);
  });

  it('only points to personal-email-free legal pages', () => {
    for (const app of APPS) {
      expect(app.privacyHref).toMatch(/^\/(spotter|inedito|loop)\/privacidad/);
    }
  });
});
