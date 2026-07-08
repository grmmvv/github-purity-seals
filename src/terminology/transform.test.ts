import { describe, expect, it } from 'vitest';

import { defaultTerminology } from './replacements';
import { createTextTransformer } from './transform';

const transformText = createTextTransformer(defaultTerminology);

describe('createTextTransformer', () => {
  it('replaces high-priority phrases before individual words', () => {
    expect(transformText('Checks passed')).toBe('Purity Trials Blessed');
    expect(transformText('Pull Request')).toBe('Rite of Integration');
    expect(transformText('GitHub Actions')).toBe('Liturgies');
  });

  it('replaces standalone terminology words', () => {
    expect(transformText('Repository has 3 commits on a branch')).toBe(
      'Reliquary has 3 inscriptions on a crusade path',
    );
  });

  it('respects word boundaries', () => {
    expect(transformText('The commitment checker is deployed')).toBe('The commitment checker is deployed');
  });

  it('preserves empty and null input', () => {
    expect(transformText('')).toBe('');
    expect(transformText(null)).toBeNull();
  });

  it('does not keep transforming already transformed text', () => {
    const once = transformText('Pull Request checks passed');

    expect(transformText(once)).toBe(once);
  });
});
