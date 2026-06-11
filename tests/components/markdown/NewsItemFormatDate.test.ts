/**
 * REQ-FORMATDATE-1 — formatDate must be extracted to module scope
 *
 * Spec acceptance criterion:
 * - formatDate is declared at module scope in NewsItem.tsx (before the component function)
 * - Function signature and all logic are identical
 * - Unit test: test formatDate directly
 *
 * Test strategy:
 * We export formatDate from module scope, then unit-test the pure function directly.
 * This follows the TDD pure-function preference: no mocks needed, deterministic.
 *
 * These tests are pure unit tests: they call formatDate with known inputs and assert
 * the exact expected output string. Each test covers a different code path in the function.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

// We'll import formatDate after it's exported from module scope.
// In RED phase: this import FAILS because formatDate is not yet exported.
// In GREEN phase (T18): formatDate is moved to module scope and exported.

describe('formatDate — REQ-FORMATDATE-1: pure function at module scope', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "hoy" when the timestamp is exactly "now" (0 ms diff → ceil = 0)', async () => {
    // The function uses Math.ceil(diffTime / 86400000). For diffDays === 0,
    // the input timestamp must be EXACTLY equal to "now" (diffTime = 0).
    // Any difference (even seconds) gives ceil ≥ 1.
    vi.useFakeTimers();
    const now = new Date('2026-06-11T12:00:00Z');
    vi.setSystemTime(now);

    const { formatDate } = await import('@everyone-web/components/Blog/NewsItem');

    // Same millisecond: diffTime = 0 → diffDays = ceil(0) = 0 → 'hoy'
    expect(formatDate(now.toISOString())).toBe('hoy');
  });

  it('returns "hace 1 día" for 1 day ago', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00Z'));

    const { formatDate } = await import('@everyone-web/components/Blog/NewsItem');

    expect(formatDate('2026-06-10T12:00:00Z')).toBe('hace 1 día');
  });

  it('returns "hace N días" for 2–6 days ago', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00Z'));

    const { formatDate } = await import('@everyone-web/components/Blog/NewsItem');

    expect(formatDate('2026-06-08T12:00:00Z')).toBe('hace 3 días');
    expect(formatDate('2026-06-06T12:00:00Z')).toBe('hace 5 días');
  });

  it('returns "hace 1 semana" for exactly 7 days ago', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00Z'));

    const { formatDate } = await import('@everyone-web/components/Blog/NewsItem');

    expect(formatDate('2026-06-04T12:00:00Z')).toBe('hace 1 semana');
  });

  it('returns "hace N semanas" for 2–3 weeks ago', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00Z'));

    const { formatDate } = await import('@everyone-web/components/Blog/NewsItem');

    expect(formatDate('2026-05-28T12:00:00Z')).toBe('hace 2 semanas');
  });

  it('returns "hace 1 mes" for ~30 days ago', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00Z'));

    const { formatDate } = await import('@everyone-web/components/Blog/NewsItem');

    expect(formatDate('2026-05-12T12:00:00Z')).toBe('hace 1 mes');
  });

  it('returns "hace N meses" for multiple months ago', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00Z'));

    const { formatDate } = await import('@everyone-web/components/Blog/NewsItem');

    expect(formatDate('2026-03-11T12:00:00Z')).toBe('hace 3 meses');
  });

  it('returns "hace 1 año" for ~365 days ago', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00Z'));

    const { formatDate } = await import('@everyone-web/components/Blog/NewsItem');

    expect(formatDate('2025-06-11T12:00:00Z')).toBe('hace 1 año');
  });

  it('returns "hace N años" for multiple years ago', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00Z'));

    const { formatDate } = await import('@everyone-web/components/Blog/NewsItem');

    expect(formatDate('2023-06-11T12:00:00Z')).toBe('hace 3 años');
  });
});
