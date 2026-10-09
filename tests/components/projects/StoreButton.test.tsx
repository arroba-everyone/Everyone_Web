import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoreButton } from '@everyone-web/components/projects/StoreButton';

describe('StoreButton', () => {
  it('opens the App Store listing in a new tab, safely', () => {
    render(
      <StoreButton store="ios" href="https://apps.apple.com/es/app/x/id1" appName="Spotter" />
    );
    const link = screen.getByRole('link', { name: 'Descargar en App Store: Spotter' });

    expect(link).toHaveAttribute('href', 'https://apps.apple.com/es/app/x/id1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('opens the Google Play listing in a new tab, safely', () => {
    render(
      <StoreButton
        store="android"
        href="https://play.google.com/store/apps/details?id=com.x"
        appName="Loop"
      />
    );
    const link = screen.getByRole('link', { name: 'Disponible en Google Play: Loop' });

    expect(link).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=com.x');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('shows the store name as visible text', () => {
    render(<StoreButton store="ios" href="https://apps.apple.com/x" appName="Loop" />);
    expect(screen.getByText('App Store')).toBeInTheDocument();
    expect(screen.getByText('Descargar en')).toBeInTheDocument();
  });
});
