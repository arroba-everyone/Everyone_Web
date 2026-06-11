// @vitest-environment jsdom
/**
 * T20 — React.memo boundary on MarkdownPreview (ADR-5)
 *
 * Design decision (ADR-5): Apply React.memo to MarkdownPreview so it doesn't
 * re-render when its parent re-renders with the same props.
 *
 * Test strategy:
 * 1. Verify MarkdownPreview is memo-wrapped by checking React internal $$typeof
 * 2. Verify correct rendering output (behavioral)
 */
import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { useState } from 'react';

describe('MarkdownPreview — React.memo boundary (T20)', () => {
  it('renders correctly with given content', async () => {
    const { MarkdownPreview } = await import(
      '@everyone-web/components/markdown/MarkdownPreview'
    );
    const { container } = render(<MarkdownPreview content="**hello**" />);
    const strong = container.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toBe('hello');
  });

  it('is wrapped with React.memo (memo property exists on the exported component)', async () => {
    // React.memo wraps the component and adds a $$typeof === Symbol(react.memo)
    // We verify the component is memo-wrapped by checking the React internal type.
    const mod = await import('@everyone-web/components/markdown/MarkdownPreview');
    const component = mod.MarkdownPreview as unknown as { $$typeof?: symbol; type?: unknown };

    // React.memo sets $$typeof to Symbol.for('react.memo')
    // If not memo-wrapped, $$typeof will be undefined
    const REACT_MEMO_TYPE = Symbol.for('react.memo');
    expect(component.$$typeof).toBe(REACT_MEMO_TYPE);
  });

  it('still renders updated content when the content prop changes', async () => {
    const { MarkdownPreview } = await import(
      '@everyone-web/components/markdown/MarkdownPreview'
    );

    // A parent that changes the content prop
    function Parent() {
      const [content, setContent] = useState('**initial**');
      return (
        <div>
          <button onClick={() => setContent('**updated**')}>change</button>
          <MarkdownPreview content={content} />
        </div>
      );
    }

    const { getByRole, container } = render(<Parent />);

    // Initial render: "initial" in bold
    expect(container.querySelector('strong')?.textContent).toBe('initial');

    // Change the content prop
    act(() => {
      getByRole('button').click();
    });

    // After prop change: MarkdownPreview MUST re-render with new content
    expect(container.querySelector('strong')?.textContent).toBe('updated');
  });
});
