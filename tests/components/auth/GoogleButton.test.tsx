// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

describe('GoogleButton', () => {
  it('renders "Continuar con Google" text', async () => {
    const { GoogleButton } = await import('@everyone-web/components/auth/GoogleButton');
    render(<GoogleButton onClick={vi.fn()} />);
    expect(screen.getByText('Continuar con Google')).toBeInTheDocument();
  });

  it('calls onClick prop when clicked', async () => {
    const { GoogleButton } = await import('@everyone-web/components/auth/GoogleButton');
    const onClick = vi.fn();
    render(<GoogleButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a Google icon element (svg)', async () => {
    const { GoogleButton } = await import('@everyone-web/components/auth/GoogleButton');
    const { container } = render(<GoogleButton onClick={vi.fn()} />);
    // The Google SVG icon should be present inside the button
    expect(container.querySelector('svg')).not.toBeNull();
  });
});
