export type TerminologyPair = readonly [source: string, target: string];

export interface Terminology {
  readonly phrases: readonly TerminologyPair[];
  readonly words: readonly TerminologyPair[];
}

export function createTextTransformer(terminology: Terminology): (value: string | null) => string | null {
  const wordReplacements = new Map<string, string>(terminology.words);
  const wordPattern = new RegExp(
    `\\b(?:${Array.from(wordReplacements.keys())
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join('|')})\\b`,
    'g',
  );

  return (value) => {
    if (!value || !/[A-Za-z]/.test(value)) {
      return value;
    }

    let transformed = value;

    for (const [source, target] of terminology.phrases) {
      transformed = transformed.replaceAll(source, target);
    }

    return transformed.replace(wordPattern, (match, offset: number) => {
      const replacement = wordReplacements.get(match);

      if (!replacement || isAlreadyInsideReplacement(transformed, match, offset, replacement)) {
        return match;
      }

      return replacement;
    });
  };
}

function isAlreadyInsideReplacement(value: string, source: string, offset: number, replacement: string): boolean {
  const sourceOffsetInReplacement = replacement.indexOf(source);

  if (sourceOffsetInReplacement < 0) {
    return false;
  }

  const replacementStart = offset - sourceOffsetInReplacement;

  if (replacementStart < 0) {
    return false;
  }

  return value.slice(replacementStart, replacementStart + replacement.length) === replacement;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
