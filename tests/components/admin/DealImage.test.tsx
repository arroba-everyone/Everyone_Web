import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DealImage } from '@everyone-web/components/admin/DealImage';

describe('DealImage', () => {
  it('(a) renders fallback Lucide icon when src is null', () => {
    render(<DealImage src={null} alt="Test deal" />);
    // Fallback: no <img> visible, instead the fallback div with a test-id
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByTestId('deal-image-fallback')).toBeInTheDocument();
  });

  it('(b) renders <img> when src is a valid string', () => {
    render(<DealImage src="https://example.com/img.jpg" alt="Test deal" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/img.jpg');
  });

  it('(c) after onError fires, renders fallback instead of broken img', () => {
    render(<DealImage src="https://example.com/broken.jpg" alt="Test deal" />);
    const img = screen.getByRole('img');

    // Fire the error event (simulates 404 / network failure)
    fireEvent.error(img);

    // img should no longer be visible; fallback should appear
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByTestId('deal-image-fallback')).toBeInTheDocument();
  });

  it('(d) <img> has loading="lazy" and decoding="async" attributes', () => {
    render(<DealImage src="https://example.com/img.jpg" alt="Test deal" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });
});
