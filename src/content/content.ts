(() => {
  'use strict';

  const loadedTerminology = globalThis.GitHubPuritySealsTerminology;

  if (!loadedTerminology) {
    return;
  }

  const terminology: GitHubPuritySealsTerminologyData = loadedTerminology;

  const extensionMark = 'data-omnissiah-observed';
  const attributeNames = ['aria-label', 'title', 'placeholder'] as const;

  const skipElements = new Set([
    'CODE',
    'KBD',
    'PRE',
    'SAMP',
    'SCRIPT',
    'STYLE',
    'TEXTAREA',
    'INPUT',
    'SELECT',
    'OPTION',
    'NOSCRIPT',
    'SVG',
    'CANVAS',
  ]);

  const wordReplacements = new Map<string, string>(terminology.words);
  const wordPattern = new RegExp(
    `\\b(${Array.from(wordReplacements.keys())
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join('|')})\\b`,
    'g',
  );

  let scheduled = false;
  const pendingRoots = new Set<Node>();

  function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function isEditable(element: Element): boolean {
    return Boolean(
      element.closest("input, textarea, select, [contenteditable=''], [contenteditable='true'], [role='textbox']"),
    );
  }

  function shouldSkipElement(element: Element | null): boolean {
    if (element?.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    if (skipElements.has(element.tagName)) {
      return true;
    }

    if (isEditable(element)) {
      return true;
    }

    return Boolean(
      element.closest(
        'pre, code, kbd, samp, script, style, textarea, input, select, svg, canvas, .blob-code, .blob-code-content, .react-code-text',
      ),
    );
  }

  function transformText(value: string | null): string | null {
    if (!value || !/[A-Za-z]/.test(value)) {
      return value;
    }

    let transformed = value;

    for (const [source, target] of terminology.phrases) {
      transformed = transformed.replaceAll(source, target);
    }

    return transformed.replace(wordPattern, (match) => wordReplacements.get(match) ?? match);
  }

  function rewriteTextNode(node: Text): void {
    const parent = node.parentElement;

    if (!parent || shouldSkipElement(parent)) {
      return;
    }

    const nextValue = transformText(node.nodeValue);

    if (nextValue !== node.nodeValue) {
      node.nodeValue = nextValue;
    }
  }

  function rewriteAttributes(element: Element): void {
    if (shouldSkipElement(element)) {
      return;
    }

    for (const attributeName of attributeNames) {
      if (!element.hasAttribute(attributeName)) {
        continue;
      }

      const currentValue = element.getAttribute(attributeName);
      const nextValue = transformText(currentValue);

      if (nextValue !== currentValue) {
        element.setAttribute(attributeName, nextValue ?? '');
      }
    }
  }

  function rewriteRoot(root: Node): void {
    if (root.nodeType === Node.TEXT_NODE) {
      rewriteTextNode(root as Text);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) {
      return;
    }

    if (root.nodeType === Node.ELEMENT_NODE) {
      const element = root as Element;

      if (shouldSkipElement(element)) {
        return;
      }

      rewriteAttributes(element);
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE && shouldSkipElement(node as Element)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    });

    while (walker.nextNode()) {
      const node = walker.currentNode;

      if (node.nodeType === Node.TEXT_NODE) {
        rewriteTextNode(node as Text);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        rewriteAttributes(node as Element);
      }
    }
  }

  function scheduleRewrite(root: Node): void {
    pendingRoots.add(root);

    if (scheduled) {
      return;
    }

    scheduled = true;

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(processPendingRoots, { timeout: 250 });
    } else {
      window.setTimeout(processPendingRoots, 0);
    }
  }

  function processPendingRoots(): void {
    scheduled = false;

    const roots = Array.from(pendingRoots);
    pendingRoots.clear();

    for (const root of roots) {
      rewriteRoot(root);
    }
  }

  function observe(): void {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          scheduleRewrite(mutation.target);
          continue;
        }

        if (mutation.type === 'attributes') {
          scheduleRewrite(mutation.target);
          continue;
        }

        for (const node of mutation.addedNodes) {
          scheduleRewrite(node);
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...attributeNames],
    });

    document.documentElement.setAttribute(extensionMark, 'true');
  }

  scheduleRewrite(document.body);
  observe();
})();
