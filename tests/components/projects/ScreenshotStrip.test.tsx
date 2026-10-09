import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScreenshotStrip } from '@everyone-web/components/projects/ScreenshotStrip';

const screenshots = [
  { src: '/a.webp', alt: 'Primera captura de ejemplo' },
  { src: '/b.webp', alt: 'Segunda captura de ejemplo' },
  { src: '/c.webp', alt: 'Tercera captura de ejemplo' },
];

interface IStripLayout {
  scrollLeft: number;
  clientWidth: number;
  scrollWidth: number;
}

/**
 * jsdom no calcula layout (todo mide 0), así que se simulan las medidas de la
 * tira. Hay que hacerlo ANTES de renderizar: el componente las lee al montar.
 */
function mockStripLayout(layout: IStripLayout) {
  for (const [property, value] of Object.entries(layout)) {
    Object.defineProperty(HTMLElement.prototype, property, { value, configurable: true });
  }
}

const getPrev = () => screen.getByRole('button', { name: 'Capturas anteriores', hidden: true });
const getNext = () => screen.getByRole('button', { name: 'Capturas siguientes', hidden: true });

describe('ScreenshotStrip', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollBy = vi.fn();
  });

  afterEach(() => {
    for (const property of ['scrollLeft', 'clientWidth', 'scrollWidth']) {
      Reflect.deleteProperty(HTMLElement.prototype, property);
    }
  });

  it('renders every screenshot with its alt text and reserved size', () => {
    render(<ScreenshotStrip appName="Loop" screenshots={screenshots} />);

    for (const { alt } of screenshots) {
      const img = screen.getByRole('img', { name: alt });
      expect(img).toHaveAttribute('width', '720');
      expect(img).toHaveAttribute('height', '1558');
      expect(img).toHaveAttribute('loading', 'lazy');
    }
  });

  it('exposes the strip as a labelled, keyboard-focusable region', () => {
    render(<ScreenshotStrip appName="Spotter" screenshots={screenshots} />);
    const region = screen.getByRole('region', { name: 'Capturas de Spotter' });
    expect(region).toHaveAttribute('tabindex', '0');
  });

  it('at the start: previous is disabled and next is enabled', () => {
    mockStripLayout({ scrollLeft: 0, clientWidth: 500, scrollWidth: 1500 });
    render(<ScreenshotStrip appName="Loop" screenshots={screenshots} />);

    expect(getPrev()).toBeDisabled();
    expect(getNext()).toBeEnabled();
  });

  it('in the middle: both arrows are enabled', () => {
    mockStripLayout({ scrollLeft: 500, clientWidth: 500, scrollWidth: 1500 });
    render(<ScreenshotStrip appName="Loop" screenshots={screenshots} />);

    expect(getPrev()).toBeEnabled();
    expect(getNext()).toBeEnabled();
  });

  it('at the end: next is disabled', () => {
    mockStripLayout({ scrollLeft: 1000, clientWidth: 500, scrollWidth: 1500 });
    render(<ScreenshotStrip appName="Loop" screenshots={screenshots} />);

    expect(getPrev()).toBeEnabled();
    expect(getNext()).toBeDisabled();
  });

  it('when everything fits, there is nothing to scroll to', () => {
    mockStripLayout({ scrollLeft: 0, clientWidth: 1500, scrollWidth: 1500 });
    render(<ScreenshotStrip appName="Loop" screenshots={screenshots} />);

    expect(getPrev()).toBeDisabled();
    expect(getNext()).toBeDisabled();
  });

  it('next scrolls forward by 80 % of the visible width', async () => {
    mockStripLayout({ scrollLeft: 0, clientWidth: 500, scrollWidth: 1500 });
    render(<ScreenshotStrip appName="Loop" screenshots={screenshots} />);

    await userEvent.click(getNext());

    expect(HTMLElement.prototype.scrollBy).toHaveBeenCalledWith({ left: 400, behavior: 'smooth' });
  });

  it('previous scrolls back by 80 % of the visible width', async () => {
    mockStripLayout({ scrollLeft: 600, clientWidth: 500, scrollWidth: 1500 });
    render(<ScreenshotStrip appName="Loop" screenshots={screenshots} />);

    await userEvent.click(getPrev());

    expect(HTMLElement.prototype.scrollBy).toHaveBeenCalledWith({ left: -400, behavior: 'smooth' });
  });
});
