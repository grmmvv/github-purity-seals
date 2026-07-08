import { describe, expect, it } from 'vitest';

import { defaultTerminology } from './replacements';
import { createTextTransformer } from './transform';

const transformText = createTextTransformer(defaultTerminology);

describe('createTextTransformer', () => {
  it('replaces high-priority phrases before individual words', () => {
    expect(transformText('Checks passed')).toBe('Purity Trials Blessed');
    expect(transformText('checks passed')).toBe('purity trials blessed');
    expect(transformText('Pull Request')).toBe('Rite of Integration');
    expect(transformText('GitHub Actions')).toBe('Liturgies');
    expect(transformText('Security and quality')).toBe('Purity and Integrity');
    expect(transformText('Latest commit')).toBe('Latest Inscription');
    expect(transformText('Folders and files')).toBe('Vaults and Schematics');
    expect(transformText('Repository files navigation')).toBe('Reliquary schematics navigation');
    expect(transformText('View commit history for this file')).toBe('View inscription chronicle for this schematic');
    expect(transformText('Source code')).toBe('Source Schematics');
    expect(transformText('New pull request')).toBe('New Rite of Integration');
  });

  it('uses explicit case-sensitive mappings', () => {
    expect(transformText('Repository')).toBe('Reliquary');
    expect(transformText('repository')).toBe('reliquary');
    expect(transformText('Repositories')).toBe('Reliquaries');
    expect(transformText('repositories')).toBe('reliquaries');
  });

  it('replaces standalone terminology words', () => {
    expect(transformText('Repository has 3 commits on a branch')).toBe(
      'Reliquary has 3 inscriptions on a crusade path',
    );
  });

  it('handles punctuation around terminology words', () => {
    expect(transformText('Repository, branch, and release.')).toBe('Reliquary, crusade path, and sacred release.');
    expect(transformText('(Checks failed)')).toBe('(Purity Trials Tainted)');
  });

  it('respects word boundaries', () => {
    expect(transformText('The commitment checker is deployed')).toBe('The commitment checker is deployed');
  });

  it('covers risky GitHub terms explicitly', () => {
    expect(transformText('release')).toBe('sacred release');
    expect(transformText('branch')).toBe('crusade path');
    expect(transformText('check')).toBe('purity trial');
    expect(transformText('deploy')).toBe('dispatch to Holy Terra');
  });

  it('covers common GitHub repository navigation terms', () => {
    expect(transformText('Issues Actions Projects Insights')).toBe('Anomalies Liturgies Endeavors Auguries');
    expect(transformText('Fork Star Tags Notifications About Public History')).toBe(
      'Diverge Benediction Sigils Vox Alerts Dossier Unsealed Chronicle',
    );
    expect(transformText('Readme License Activity Languages Topics Contributors Watchers')).toBe(
      'Canticle Writ of Sanction Activity Log Tongues Runes Adepts Watch Servitors',
    );
    expect(transformText('Author Assignee Labels Milestones Reviews Conversation Assets')).toBe(
      'Scribe Assigned Adept Seals Omens Scrutinies Vox Log Sacred Relics',
    );
    expect(transformText('Go to file')).toBe('Locate Schematic');
    expect(transformText('View all files')).toBe('View all Schematics');
  });

  it('preserves empty and null input', () => {
    expect(transformText('')).toBe('');
    expect(transformText(null)).toBeNull();
  });

  it('does not keep transforming already transformed text', () => {
    const once = transformText(
      'Pull Request checks passed with Release and releases, Issues, Actions, Projects, Fork, Star, Tags, Activity, License',
    );

    expect(transformText(once)).toBe(once);
  });

  it('does not repeat self-containing replacements', () => {
    expect(transformText(transformText('Release'))).toBe('Sacred Release');
    expect(transformText(transformText('release'))).toBe('sacred release');
    expect(transformText(transformText('Releases'))).toBe('Sacred Releases');
    expect(transformText(transformText('releases'))).toBe('sacred releases');
  });
});
