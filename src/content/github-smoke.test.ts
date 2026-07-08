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
          <a>Issues</a>
          <a>Projects</a>
          <a>Security and quality</a>
          <a>Insights</a>
        </nav>
        <section>Folders and files</section>
        <section aria-label="Repository files navigation">Repository files</section>
        <span>Latest commit</span>
        <span>History</span>
        <aside>About</aside>
        <button>Fork</button>
        <button>Star</button>
        <strong>Public</strong>
        <a>Readme</a>
        <a>License</a>
        <a>Activity</a>
        <a>Languages</a>
        <a>Topics</a>
        <a>Contributors</a>
        <a>Watchers</a>
        <a aria-label="README.md, (File)">README.md</a>
        <div class="blob-code-content">Repository branch release</div>
      </main>
    `);

    expect(document.querySelector('h1')?.textContent).toBe('Reliquary');
    expect(document.querySelector('nav a')?.textContent).toBe('Rites of Integration');
    expect(document.querySelector('nav a')?.getAttribute('title')).toBe('Rites of Integration');
    expect(document.querySelectorAll('nav a')[1]?.textContent).toBe('Liturgies');
    expect(document.querySelectorAll('nav a')[2]?.textContent).toBe('Anomalies');
    expect(document.querySelectorAll('nav a')[3]?.textContent).toBe('Endeavors');
    expect(document.querySelectorAll('nav a')[4]?.textContent).toBe('Purity and Integrity');
    expect(document.querySelectorAll('nav a')[5]?.textContent).toBe('Auguries');
    expect(document.querySelector('section')?.textContent).toBe('Vaults and Schematics');
    expect(document.querySelectorAll('section')[1]?.textContent).toBe('Reliquary Schematics');
    expect(document.querySelectorAll('section')[1]?.getAttribute('aria-label')).toBe('Reliquary schematics navigation');
    expect(document.querySelectorAll('span')[0]?.textContent).toBe('Latest Inscription');
    expect(document.querySelectorAll('span')[1]?.textContent).toBe('Chronicle');
    expect(document.querySelector('aside')?.textContent).toBe('Dossier');
    expect(document.querySelectorAll('button')[0]?.textContent).toBe('Diverge');
    expect(document.querySelectorAll('button')[1]?.textContent).toBe('Benediction');
    expect(document.querySelector('strong')?.textContent).toBe('Unsealed');
    expect(document.querySelectorAll('main > a')[0]?.textContent).toBe('Canticle');
    expect(document.querySelectorAll('main > a')[1]?.textContent).toBe('Writ of Sanction');
    expect(document.querySelectorAll('main > a')[2]?.textContent).toBe('Activity Log');
    expect(document.querySelectorAll('main > a')[3]?.textContent).toBe('Tongues');
    expect(document.querySelectorAll('main > a')[4]?.textContent).toBe('Runes');
    expect(document.querySelectorAll('main > a')[5]?.textContent).toBe('Adepts');
    expect(document.querySelectorAll('main > a')[6]?.textContent).toBe('Watch Servitors');
    expect(document.querySelectorAll('main > a')[7]?.textContent).toBe('README.md');
    expect(document.querySelector('.blob-code-content')?.textContent).toBe('Repository branch release');
  });

  it('rewrites pull request status and merge language while leaving comment input alone', () => {
    const document = rewriteFixture(`
      <main>
        <h1>Pull Request</h1>
        <nav>Conversation Files changed Reviews</nav>
        <menu>Author Assignee Labels Milestones</menu>
        <button>Merge pull request</button>
        <button>New pull request</button>
        <span aria-label="Checks passed">Checks passed</span>
        <textarea>Repository Pull Request</textarea>
      </main>
    `);

    expect(document.querySelector('h1')?.textContent).toBe('Rite of Integration');
    expect(document.querySelector('nav')?.textContent).toBe('Vox Log Altered Schematics Scrutinies');
    expect(document.querySelector('menu')?.textContent).toBe('Scribe Assigned Adept Seals Omens');
    expect(document.querySelector('button')?.textContent).toBe('Consecrate rite of integration');
    expect(document.querySelectorAll('button')[1]?.textContent).toBe('New Rite of Integration');
    expect(document.querySelector('span')?.textContent).toBe('Purity Trials Blessed');
    expect(document.querySelector('span')?.getAttribute('aria-label')).toBe('Purity Trials Blessed');
    expect(document.querySelector('textarea')?.textContent).toBe('Repository Pull Request');
  });

  it('rewrites Actions page status language', () => {
    const document = rewriteFixture(`
      <main>
        <h1>GitHub Actions</h1>
        <nav>Actions</nav>
        <button>All workflows</button>
        <section>Workflow checks failed</section>
        <p>Waiting for checks</p>
      </main>
    `);

    expect(document.querySelector('h1')?.textContent).toBe('Liturgies');
    expect(document.querySelector('nav')?.textContent).toBe('Liturgies');
    expect(document.querySelector('button')?.textContent).toBe('All rituals');
    expect(document.querySelector('section')?.textContent).toBe('Ritual purity trials tainted');
    expect(document.querySelector('p')?.textContent).toBe("Awaiting the Omnissiah's blessing");
  });

  it('rewrites release and artifact language', () => {
    const document = rewriteFixture(`
      <main>
        <h1>Release</h1>
        <h2>Releases</h2>
        <button>Compare</button>
        <button>Choose a tag</button>
        <ul>
          <li>Artifact</li>
          <li>Unsigned artifact</li>
          <li>Tags</li>
          <li>Assets</li>
          <li>Source code</li>
        </ul>
      </main>
    `);

    expect(document.querySelector('h1')?.textContent).toBe('Sacred Release');
    expect(document.querySelector('h2')?.textContent).toBe('Sacred Releases');
    expect(document.querySelectorAll('button')[0]?.textContent).toBe('Compare Rites');
    expect(document.querySelectorAll('button')[1]?.textContent).toBe('Choose a Sigil');
    expect(document.querySelectorAll('li')[0]?.textContent).toBe('Sacred Relic');
    expect(document.querySelectorAll('li')[1]?.textContent).toBe('Relic without a Purity Seal');
    expect(document.querySelectorAll('li')[2]?.textContent).toBe('Sigils');
    expect(document.querySelectorAll('li')[3]?.textContent).toBe('Sacred Relics');
    expect(document.querySelectorAll('li')[4]?.textContent).toBe('Source Schematics');
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
