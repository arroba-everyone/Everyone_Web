import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashtagsInput } from '@everyone-web/components/admin/HashtagsInput';

function setup(value: string[] = [], onChange = vi.fn()) {
  const user = userEvent.setup();
  const result = render(<HashtagsInput value={value} onChange={onChange} />);
  const input = result.container.querySelector('input') as HTMLInputElement;
  return { user, input, onChange, ...result };
}

describe('HashtagsInput', () => {
  it('(a) empty value renders input with counter 0/15', () => {
    setup([], vi.fn());
    expect(screen.getByText('0/15')).toBeInTheDocument();
  });

  it('(b) Enter with valid draft adds chip and clears input', async () => {
    const onChange = vi.fn();
    const { user, input } = setup([], onChange);

    await user.click(input);
    await user.type(input, 'ofertazo');
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith(['ofertazo']);
  });

  it('(c) comma triggers commit', async () => {
    const onChange = vi.fn();
    const { user, input } = setup([], onChange);

    await user.click(input);
    await user.type(input, 'tecnologia,');

    expect(onChange).toHaveBeenCalledWith(['tecnologia']);
  });

  it('(d) space triggers commit', async () => {
    const onChange = vi.fn();
    const { user, input } = setup([], onChange);

    await user.click(input);
    await user.type(input, 'sony ');

    expect(onChange).toHaveBeenCalledWith(['sony']);
  });

  it('(e) Tab triggers commit', async () => {
    const onChange = vi.fn();
    const { user, input } = setup([], onChange);

    await user.click(input);
    await user.type(input, 'auriculares');
    await user.keyboard('{Tab}');

    expect(onChange).toHaveBeenCalledWith(['auriculares']);
  });

  it('(f) Backspace with empty draft removes last chip', async () => {
    const onChange = vi.fn();
    const { user, input } = setup(['ofertazo', 'sony'], onChange);

    await user.click(input);
    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenCalledWith(['ofertazo']);
  });

  it('(g) pasting "foo bar,baz" adds three chips', async () => {
    const onChange = vi.fn();
    const { user, input } = setup([], onChange);

    await user.click(input);
    await user.paste('foo bar baz');

    // After paste, we may get multiple onChange calls; the last one should have all 3
    const calls = onChange.mock.calls;
    const lastCall = calls[calls.length - 1][0] as string[];
    expect(lastCall).toEqual(expect.arrayContaining(['foo', 'bar', 'baz']));
    expect(lastCall).toHaveLength(3);
  });

  it('(h) tag failing regex is NOT added and input shows error state', async () => {
    const onChange = vi.fn();
    const { user, input } = setup([], onChange);

    await user.click(input);
    await user.type(input, 'oferta-mala');
    await user.keyboard('{Enter}');

    expect(onChange).not.toHaveBeenCalled();
    // input should have an error indicator (data-invalid or border-red class)
    expect(input).toHaveAttribute('data-invalid', 'true');
  });

  it('(i) duplicate (case-insensitive) is discarded silently', async () => {
    const onChange = vi.fn();
    const { user, input } = setup(['ofertazo'], onChange);

    await user.click(input);
    await user.type(input, 'OFERTAZO');
    await user.keyboard('{Enter}');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('(j) click X on chip removes it', async () => {
    const onChange = vi.fn();
    const { user } = setup(['ofertazo', 'sony'], onChange);

    const removeBtn = screen.getByLabelText('Quitar ofertazo');
    await user.click(removeBtn);

    expect(onChange).toHaveBeenCalledWith(['sony']);
  });

  it('(k) when maxTags reached input is disabled', () => {
    const tags = Array.from({ length: 15 }, (_, i) => `tag${i}`);
    const { container } = setup(tags, vi.fn());
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('(l) chips have aria-label on X button', () => {
    setup(['ofertazo'], vi.fn());
    expect(screen.getByLabelText('Quitar ofertazo')).toBeInTheDocument();
  });
});

describe('HashtagsInput — defensive strip of leading # in value prop', () => {
  it('(m) chip shows #ofertazo (not ##ofertazo) when value contains #ofertazo', () => {
    render(<HashtagsInput value={['#ofertazo']} onChange={vi.fn()} />);
    // Badge text should be "#ofertazo" not "##ofertazo"
    const badge = screen.getByText('#ofertazo');
    expect(badge).toBeInTheDocument();
    expect(screen.queryByText('##ofertazo')).toBeNull();
  });

  it('(n) chip shows #ofertazo when value contains ofertazo (no prefix)', () => {
    render(<HashtagsInput value={['ofertazo']} onChange={vi.fn()} />);
    expect(screen.getByText('#ofertazo')).toBeInTheDocument();
  });

  it('(o) onChange is NOT called when component renders (no mutation of value prop)', () => {
    const onChange = vi.fn();
    render(<HashtagsInput value={['#ofertazo']} onChange={onChange} />);
    // No user interaction — onChange should not be called by the strip logic
    expect(onChange).not.toHaveBeenCalled();
  });
});
