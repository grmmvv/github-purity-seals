import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

import { createDomRewriter, installDomRewriter } from './dom-rewriter';

const transformText = (value: string | null): string | null => value?.replaceAll('Repository', 'Reliquary') ?? value;
const selfContainingTransformText = (value: string | null): string | null =>
  value?.replaceAll('Release', 'Sacred Release') ?? value;

describe('dom rewriter', () => {
  it('rewrites safe text nodes', () => {
    const dom = createDom('<main><h1>Repository</h1></main>');
    const rewriter = createDomRewriter({
      document: dom.window.document,
      window: dom.window,
      transformText,
    });

    rewriter.rewriteRoot(dom.window.document.body);

    expect(dom.window.document.querySelector('h1')?.textContent).toBe('Reliquary');
  });

  it('rewrites accessibility and title attributes', () => {
    const dom = createDom(
      '<button aria-label="Repository" title="Repository"></button><input placeholder="Repository">',
    );
    const rewriter = createDomRewriter({
      document: dom.window.document,
      window: dom.window,
      transformText,
    });

    rewriter.rewriteRoot(dom.window.document.body);

    expect(dom.window.document.querySelector('button')?.getAttribute('aria-label')).toBe('Reliquary');
    expect(dom.window.document.querySelector('button')?.getAttribute('title')).toBe('Reliquary');
    expect(dom.window.document.querySelector('input')?.getAttribute('placeholder')).toBe('Repository');
  });

  it('skips code and form editing surfaces', () => {
    const dom = createDom(`
      <pre>Repository</pre>
      <code>Repository</code>
      <textarea>Repository</textarea>
      <input value="Repository" title="Repository">
      <select><option>Repository</option></select>
      <div contenteditable="true">Repository</div>
      <div role="textbox">Repository</div>
    `);
    const rewriter = createDomRewriter({
      document: dom.window.document,
      window: dom.window,
      transformText,
    });

    rewriter.rewriteRoot(dom.window.document.body);

    expect(dom.window.document.querySelector('pre')?.textContent).toBe('Repository');
    expect(dom.window.document.querySelector('code')?.textContent).toBe('Repository');
    expect(dom.window.document.querySelector('textarea')?.textContent).toBe('Repository');
    expect(dom.window.document.querySelector('input')?.getAttribute('title')).toBe('Repository');
    expect(dom.window.document.querySelector('option')?.textContent).toBe('Repository');
    expect(dom.window.document.querySelector('[contenteditable="true"]')?.textContent).toBe('Repository');
    expect(dom.window.document.querySelector('[role="textbox"]')?.textContent).toBe('Repository');
  });

  it('skips GitHub code viewer containers', () => {
    const dom = createDom(`
      <div class="blob-code">Repository</div>
      <div class="blob-code-content">Repository</div>
      <div class="react-code-text">Repository</div>
    `);
    const rewriter = createDomRewriter({
      document: dom.window.document,
      window: dom.window,
      transformText,
    });

    rewriter.rewriteRoot(dom.window.document.body);

    expect(dom.window.document.querySelector('.blob-code')?.textContent).toBe('Repository');
    expect(dom.window.document.querySelector('.blob-code-content')?.textContent).toBe('Repository');
    expect(dom.window.document.querySelector('.react-code-text')?.textContent).toBe('Repository');
  });

  it('marks the page when installed', () => {
    const dom = createDom('<main>Repository</main>');

    const observer = installDomRewriter({
      document: dom.window.document,
      window: dom.window,
      transformText,
    });

    expect(dom.window.document.documentElement.getAttribute('data-omnissiah-observed')).toBe('true');

    observer.disconnect();
  });

  it('does not rewrite its own text node output again', () => {
    const dom = createDom('<main><h1>Release</h1></main>');
    const rewriter = createDomRewriter({
      document: dom.window.document,
      window: dom.window,
      transformText: selfContainingTransformText,
    });

    rewriter.rewriteRoot(dom.window.document.body);
    rewriter.rewriteRoot(dom.window.document.body);

    expect(dom.window.document.querySelector('h1')?.textContent).toBe('Sacred Release');
  });

  it('does not rewrite its own attribute output again', () => {
    const dom = createDom('<main><a title="Release">Release</a></main>');
    const rewriter = createDomRewriter({
      document: dom.window.document,
      window: dom.window,
      transformText: selfContainingTransformText,
    });

    rewriter.rewriteRoot(dom.window.document.body);
    rewriter.rewriteRoot(dom.window.document.body);

    expect(dom.window.document.querySelector('a')?.getAttribute('title')).toBe('Sacred Release');
    expect(dom.window.document.querySelector('a')?.textContent).toBe('Sacred Release');
  });
});

function createDom(body: string): JSDOM {
  return new JSDOM(`<!doctype html><html><body>${body}</body></html>`);
}
