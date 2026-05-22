import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MarkdownEditor } from '@everyone-web/components/markdown/MarkdownEditor';

describe('MarkdownEditor', () => {
  it('renders both the textarea and the preview panel', () => {
    render(<MarkdownEditor value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByTestId('markdown-preview')).toBeTruthy();
  });

  it('calls onChange with new value when user types in the textarea', () => {
    const onChange = vi.fn();
    render(<MarkdownEditor value="" onChange={onChange} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'hola mundo' } });
    expect(onChange).toHaveBeenCalledWith('hola mundo');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('reflects the current value prop in the textarea', () => {
    render(<MarkdownEditor value="**texto**" onChange={vi.fn()} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('**texto**');
  });

  it('renders the preview section with the current markdown value', () => {
    render(<MarkdownEditor value="**negrita**" onChange={vi.fn()} />);
    const preview = screen.getByTestId('markdown-preview');
    // Preview should contain the rendered strong element
    const strong = preview.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toContain('negrita');
  });
});
