declare global {
  type TerminologyPair = readonly [source: string, target: string];

  interface GitHubPuritySealsTerminologyData {
    readonly phrases: readonly TerminologyPair[];
    readonly words: readonly TerminologyPair[];
  }

  var GitHubPuritySealsTerminology: GitHubPuritySealsTerminologyData | undefined;
}

export {};
