export type TerminologyPair = readonly [source: string, target: string];

export interface Terminology {
  readonly phrases: readonly TerminologyPair[];
  readonly words: readonly TerminologyPair[];
}

export function createTextTransformer(terminology: Terminology): (value: string | null) => string | null {
  const wordReplacements = new Map<string, string>(terminology.words);
  const wordPattern = new RegExp(
    `\\b(${Array.from(wordReplacements.keys())
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

    return transformed.replace(wordPattern, (match) => wordReplacements.get(match) ?? match);
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
