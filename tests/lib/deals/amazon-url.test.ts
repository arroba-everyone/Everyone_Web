import { describe, it, expect } from 'vitest';
import { isAmazonUrl } from '@everyone-web/lib/deals/amazon-url';

describe('isAmazonUrl', () => {
  // Accepted: amazon.* official domains
  it('accepts amazon.es', () => {
    expect(isAmazonUrl('https://www.amazon.es/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.com', () => {
    expect(isAmazonUrl('https://www.amazon.com/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.co.uk', () => {
    expect(isAmazonUrl('https://www.amazon.co.uk/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.de', () => {
    expect(isAmazonUrl('https://www.amazon.de/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.fr', () => {
    expect(isAmazonUrl('https://www.amazon.fr/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.it', () => {
    expect(isAmazonUrl('https://www.amazon.it/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.nl', () => {
    expect(isAmazonUrl('https://www.amazon.nl/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.pl', () => {
    expect(isAmazonUrl('https://www.amazon.pl/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.se', () => {
    expect(isAmazonUrl('https://www.amazon.se/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.com.tr', () => {
    expect(isAmazonUrl('https://www.amazon.com.tr/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.es without www', () => {
    expect(isAmazonUrl('https://amazon.es/dp/B0XXXXXX')).toBe(true);
  });

  it('accepts amazon.com in mixed case URL (protocol lowercase, hostname uppercase)', () => {
    expect(isAmazonUrl('https://AMAZON.COM/dp/B0XXXXXX')).toBe(true);
  });

  // Accepted: Amazon shorteners
  it('accepts amzn.to', () => {
    expect(isAmazonUrl('https://amzn.to/3XXXXXXX')).toBe(true);
  });

  it('accepts a.co', () => {
    expect(isAmazonUrl('https://a.co/d/XXXXXXX')).toBe(true);
  });

  it('accepts amzn.eu', () => {
    expect(isAmazonUrl('https://amzn.eu/d/XXXXXXX')).toBe(true);
  });

  // Rejected: non-Amazon domains
  it('rejects chollometro.com', () => {
    expect(isAmazonUrl('https://www.chollometro.com/ofertas/product/123')).toBe(false);
  });

  it('rejects mediamarkt.es', () => {
    expect(isAmazonUrl('https://www.mediamarkt.es/es/product/XXXX.html')).toBe(false);
  });

  it('rejects example.com', () => {
    expect(isAmazonUrl('https://example.com/product')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isAmazonUrl('')).toBe(false);
  });

  it('rejects invalid URL string', () => {
    expect(isAmazonUrl('not a url')).toBe(false);
  });

  it('rejects amazon-fake.com (not amazon.* pattern)', () => {
    expect(isAmazonUrl('https://amazon-fake.com/dp/B0X')).toBe(false);
  });

  it('rejects fakeamazon.com (not amazon.* pattern)', () => {
    expect(isAmazonUrl('https://fakeamazon.com/dp/B0X')).toBe(false);
  });
});
