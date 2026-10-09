import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { AppShowcase } from '@everyone-web/components/projects/AppShowcase';
import { APPS } from '@everyone-web/constants/apps';

// motion (Reveal) observa el scroll con IntersectionObserver, que jsdom no trae.
beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
});

describe('AppShowcase', () => {
  it.each(APPS)('$name shows its name, tagline and both store links', app => {
    render(<AppShowcase app={app} />);

    expect(screen.getByRole('heading', { level: 2, name: app.name })).toBeInTheDocument();
    expect(screen.getByText(app.tagline)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Descargar en App Store/ })).toHaveAttribute(
      'href',
      app.stores.ios
    );
    expect(screen.getByRole('link', { name: /Disponible en Google Play/ })).toHaveAttribute(
      'href',
      app.stores.android
    );
  });

  it.each(APPS)('$name is a landmark reachable by its anchor id', app => {
    const { container } = render(<AppShowcase app={app} />);
    const section = container.querySelector(`section#${app.id}`);

    expect(section).not.toBeNull();
    expect(within(section as HTMLElement).getByRole('heading', { level: 2 })).toHaveTextContent(
      app.name
    );
  });

  it('renders every highlight as a list item', () => {
    const [spotter] = APPS;
    render(<AppShowcase app={spotter!} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(spotter!.highlights.length);
  });

  it('shows the age and country note only when the app has one', () => {
    const [spotter, inedito] = APPS;
    const { unmount } = render(<AppShowcase app={spotter!} />);
    expect(screen.getByText(/mayores de 18 años/)).toBeInTheDocument();
    unmount();

    render(<AppShowcase app={inedito!} />);
    expect(screen.queryByText(/mayores de 18 años/)).not.toBeInTheDocument();
  });

  it.each(APPS)('$name links to its privacy policy', app => {
    render(<AppShowcase app={app} />);
    expect(screen.getByRole('link', { name: 'Política de privacidad' })).toHaveAttribute(
      'href',
      app.privacyHref
    );
  });
});
