import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MarkdownPreview } from '@everyone-web/components/markdown/MarkdownPreview';

describe('MarkdownPreview', () => {
  it('renders bold text', () => {
    render(<MarkdownPreview content="**texto en negrita**" />);
    const strong = document.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toContain('texto en negrita');
  });

  it('renders a link', () => {
    render(<MarkdownPreview content="[enlace](https://example.com)" />);
    const link = document.querySelector('a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('https://example.com');
    expect(link?.textContent).toBe('enlace');
  });

  it('renders a fenced code block', () => {
    render(<MarkdownPreview content={'```js\nconsole.log("hola");\n```'} />);
    const code = document.querySelector('code');
    expect(code).not.toBeNull();
    expect(code?.textContent).toContain('console.log');
  });

  it('renders raw HTML via rehype-raw (mark tag survives)', () => {
    render(<MarkdownPreview content="Texto con <mark>marcado</mark>" />);
    const mark = document.querySelector('mark');
    expect(mark).not.toBeNull();
    expect(mark?.textContent).toBe('marcado');
  });
});
