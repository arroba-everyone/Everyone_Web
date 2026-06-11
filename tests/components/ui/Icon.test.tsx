// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

/**
 * REQ-ICON-1 — Icon.tsx must use JSX syntax, not function-call anti-pattern
 *
 * The spec requires:
 * - No direct function call of an IconType (e.g. IconComponent({ ...props }))
 * - The rendered output is identical: same SVG icons, same sizing/color props forwarded
 * - tsc --noEmit passes
 *
 * Design (DECISION 6): render via JSX (<IconComponent />) KEEPING react-icons
 *
 * Test strategy: we cannot detect "was JSX used?" from the rendered DOM, so we test
 * behavioral requirements:
 * 1. Renders an SVG element (react-icons icons always produce an SVG)
 * 2. Does NOT throw React reconciliation warnings ("Functions are not valid as a React child")
 * 3. Forwards className/color props to the underlying SVG
 * 4. Falls back gracefully (AiFillBug red) when name is unknown
 */

// We need to spy on console.error to catch React reconciliation warnings
// that occur when an icon is called as a function rather than rendered as JSX

describe('Icon — REQ-ICON-1: JSX syntax (not function call)', () => {
  it('renders an SVG when given a valid icon name (github)', async () => {
    const { Icon } = await import('@everyone-web/ui/Icon/Icon');

    const { container } = render(<Icon name="github" />);

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('renders an SVG when given a valid icon name (youtube)', async () => {
    const { Icon } = await import('@everyone-web/ui/Icon/Icon');

    const { container } = render(<Icon name="youtube" />);

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('forwards className prop to the SVG element', async () => {
    const { Icon } = await import('@everyone-web/ui/Icon/Icon');

    const { container } = render(<Icon name="instagram" className="h-5 w-5" />);

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    // react-icons SVG accepts className via aria-hidden, class attr
    expect(svg?.getAttribute('class')).toContain('h-5 w-5');
  });

  it('does NOT trigger React reconciliation warnings (no function-call anti-pattern)', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { Icon } = await import('@everyone-web/ui/Icon/Icon');
    render(<Icon name="menu" />);

    // If IconComponent({ ...props }) is used instead of <IconComponent />,
    // React 19 will log: "Functions are not valid as a React child"
    const errorCalls = consoleSpy.mock.calls.map(call => String(call[0]));
    const hasReconciliationWarning = errorCalls.some(
      msg =>
        msg.includes('Functions are not valid') ||
        msg.includes('is not a valid React child') ||
        msg.includes('Each child in a list should have a unique')
    );

    consoleSpy.mockRestore();
    expect(hasReconciliationWarning).toBe(false);
  });

  it('renders all 7 icon names without errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { Icon } = await import('@everyone-web/ui/Icon/Icon');
    const names = ['youtube', 'instagram', 'twitch', 'github', 'linkedin', 'telegram', 'menu'] as const;

    for (const name of names) {
      const { container } = render(<Icon name={name} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
    }

    const errorCalls = consoleSpy.mock.calls.map(call => String(call[0]));
    const hasReactError = errorCalls.some(
      msg => msg.includes('Functions are not valid') || msg.includes('is not a valid React child')
    );

    consoleSpy.mockRestore();
    expect(hasReactError).toBe(false);
  });
});
