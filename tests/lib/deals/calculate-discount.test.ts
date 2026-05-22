import { describe, it, expect } from 'vitest';
import { calculateDiscount } from '@everyone-web/lib/deals/calculate-discount';

describe('calculateDiscount', () => {
  it('(a) returns 44 for (49.99, 89.99)', () => {
    expect(calculateDiscount(49.99, 89.99)).toBe(44);
  });

  it('(b) returns 50 for (50, 100)', () => {
    expect(calculateDiscount(50, 100)).toBe(50);
  });

  it('(c) returns null when current is null', () => {
    expect(calculateDiscount(null, 89.99)).toBe(null);
  });

  it('(d) returns null when previous is null', () => {
    expect(calculateDiscount(49.99, null)).toBe(null);
  });

  it('(e) returns null when previous equals current (0% discount)', () => {
    expect(calculateDiscount(49.99, 49.99)).toBe(null);
  });

  it('(f) returns null when previous is less than current (negative discount)', () => {
    expect(calculateDiscount(89.99, 49.99)).toBe(null);
  });

  it('(g) returns null when current is 0 or negative', () => {
    expect(calculateDiscount(0, 100)).toBe(null);
  });

  it('(h) returns null when previous is 0 (division by zero guard)', () => {
    expect(calculateDiscount(50, 0)).toBe(null);
  });

  it('(i) returns null when previous is undefined', () => {
    expect(calculateDiscount(50, undefined as unknown as null)).toBe(null);
  });

  it('(j) returns null when current is undefined', () => {
    expect(calculateDiscount(undefined as unknown as null, 100)).toBe(null);
  });
});
