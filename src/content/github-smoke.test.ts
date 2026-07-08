import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

import { createDomRewriter } from './dom-rewriter';
import { defaultTerminology } from '../terminology/replacements';
import { createTextTransformer } from '../terminology/transform';

const transformText = createTextTransformer(defaultTerminology);

describe('representative GitHub page smoke fixtures', () => {
  it('rewrites repository page chrome without touching code content', () => {
    const document = rewriteFixture(`
      <main>
        <h1>Repository</h1>
        <nav>
          <a title="Pull requests">Pull Requests</a>
          <a>Actions</a>
        </nav>
        <div class="blob-code-content">Repository branch release</div>
      </main>
    `);

    expect(document.querySelector('h1')?.textContent).toBe('Reliquary');
    expect(document.querySelector('nav a')?.textContent).toBe('Rites of Integration');
    expect(document.querySelector('nav a')?.getAttribute('title')).toBe('Rites of Integration');
    expect(document.querySelectorAll('nav a')[1]?.textContent).toBe('Actions');
    expect(document.querySelector('.blob-code-content')?.textContent).toBe('Repository branch release');
  });

  it('rewrites pull request status and merge language while leaving comment input alone', () => {
    const document = rewriteFixture(`
      <main>
        <h1>Pull Request</h1>
        <button>Merge pull request</button>
        <span aria-label="Checks passed">Checks passed</span>
        <textarea>Repository Pull Request</textarea>
      </main>
    `);

    expect(document.querySelector('h1')?.textContent).toBe('Rite of Integration');
    expect(document.querySelector('button')?.textContent).toBe('Consecrate rite of integration');
    expect(document.querySelector('span')?.textContent).toBe('Purity Trials Blessed');
    expect(document.querySelector('span')?.getAttribute('aria-label')).toBe('Purity Trials Blessed');
    expect(document.querySelector('textarea')?.textContent).toBe('Repository Pull Request');
  });

  it('rewrites Actions page status language', () => {
    const document = rewriteFixture(`
      <main>
        <h1>GitHub Actions</h1>
        <section>Workflow checks failed</section>
        <p>Waiting for checks</p>
      </main>
    `);

    expect(document.querySelector('h1')?.textContent).toBe('Liturgies');
    expect(document.querySelector('section')?.textContent).toBe('Ritual purity trials tainted');
    expect(document.querySelector('p')?.textContent).toBe("Awaiting the Omnissiah's blessing");
  });

  it('rewrites release and artifact language', () => {
    const document = rewriteFixture(`
      <main>
        <h1>Release</h1>
        <ul>
          <li>Artifact</li>
          <li>Unsigned artifact</li>
        </ul>
      </main>
    `);

    expect(document.querySelector('h1')?.textContent).toBe('Sacred Release');
    expect(document.querySelectorAll('li')[0]?.textContent).toBe('Sacred Relic');
    expect(document.querySelectorAll('li')[1]?.textContent).toBe('Relic without a Purity Seal');
  });

  it('leaves code file content untouched while rewriting surrounding page labels', () => {
    const document = rewriteFixture(`
      <main>
        <h1>Repository</h1>
        <div class="react-code-text">Pull Request checks failed</div>
        <pre>Repository Commit Branch</pre>
      </main>
    `);

    expect(document.querySelector('h1')?.textContent).toBe('Reliquary');
    expect(document.querySelector('.react-code-text')?.textContent).toBe('Pull Request checks failed');
    expect(document.querySelector('pre')?.textContent).toBe('Repository Commit Branch');
  });
});

function rewriteFixture(body: string): Document {
  const dom = new JSDOM(`<!doctype html><html><body>${body}</body></html>`);
  const rewriter = createDomRewriter({
    document: dom.window.document,
    window: dom.window,
    transformText,
  });

  rewriter.rewriteRoot(dom.window.document.body);

  return dom.window.document;
}
