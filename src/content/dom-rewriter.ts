export type TextTransformer = (value: string | null) => string | null;

interface RewriterWindow {
  readonly MutationObserver: typeof MutationObserver;
  readonly NodeFilter: typeof NodeFilter;
  readonly requestIdleCallback?: Window['requestIdleCallback'];
  readonly setTimeout: Window['setTimeout'];
}

export interface DomRewriterOptions {
  readonly document: Document;
  readonly window: RewriterWindow;
  readonly transformText: TextTransformer;
  readonly extensionMark?: string;
}

const elementNode = 1;
const textNode = 3;
const documentNode = 9;
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

const skipSelector =
  'pre, code, kbd, samp, script, style, textarea, input, select, svg, canvas, .blob-code, .blob-code-content, .react-code-text';
const editableSelector = "input, textarea, select, [contenteditable=''], [contenteditable='true'], [role='textbox']";

export function installDomRewriter(options: DomRewriterOptions): MutationObserver {
  const extensionMark = options.extensionMark ?? 'data-omnissiah-observed';
  const rewriter = createDomRewriter(options);
  const observer = new options.window.MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        rewriter.scheduleRewrite(mutation.target);
        continue;
      }

      if (mutation.type === 'attributes') {
        rewriter.scheduleRewrite(mutation.target);
        continue;
      }

      for (const node of mutation.addedNodes) {
        rewriter.scheduleRewrite(node);
      }
    }
  });

  observer.observe(options.document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...attributeNames],
  });

  options.document.documentElement.setAttribute(extensionMark, 'true');
  rewriter.scheduleRewrite(options.document.body);

  return observer;
}

export function createDomRewriter(options: DomRewriterOptions): {
  readonly rewriteRoot: (root: Node) => void;
  readonly scheduleRewrite: (root: Node) => void;
} {
  let scheduled = false;
  const pendingRoots = new Set<Node>();
  const processedTextValues = new WeakMap<Text, string>();
  const processedAttributeValues = new WeakMap<Element, Map<(typeof attributeNames)[number], string>>();

  function rewriteTextNode(node: Text): void {
    const parent = node.parentElement;

    if (!parent || shouldSkipElement(parent)) {
      return;
    }

    if (processedTextValues.get(node) === node.nodeValue) {
      return;
    }

    const nextValue = options.transformText(node.nodeValue);

    if (nextValue !== node.nodeValue) {
      node.nodeValue = nextValue;
    }

    if (node.nodeValue) {
      processedTextValues.set(node, node.nodeValue);
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

      if (getProcessedAttributeValue(element, attributeName) === currentValue) {
        continue;
      }

      const nextValue = options.transformText(currentValue);

      if (nextValue !== currentValue) {
        element.setAttribute(attributeName, nextValue ?? '');
      }

      setProcessedAttributeValue(element, attributeName, element.getAttribute(attributeName) ?? '');
    }
  }

  function rewriteRoot(root: Node): void {
    if (root.nodeType === textNode) {
      rewriteTextNode(root as Text);
      return;
    }

    if (root.nodeType !== elementNode && root.nodeType !== documentNode) {
      return;
    }

    if (root.nodeType === elementNode) {
      const element = root as Element;

      if (shouldSkipElement(element)) {
        return;
      }

      rewriteAttributes(element);
    }

    const walker = options.document.createTreeWalker(
      root,
      options.window.NodeFilter.SHOW_ELEMENT | options.window.NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (node.nodeType === elementNode && shouldSkipElement(node as Element)) {
            return options.window.NodeFilter.FILTER_REJECT;
          }

          return options.window.NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    while (walker.nextNode()) {
      const node = walker.currentNode;

      if (node.nodeType === textNode) {
        rewriteTextNode(node as Text);
      } else if (node.nodeType === elementNode) {
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

    if (typeof options.window.requestIdleCallback === 'function') {
      options.window.requestIdleCallback(processPendingRoots, { timeout: 250 });
    } else {
      options.window.setTimeout(processPendingRoots, 0);
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

  function isEditable(element: Element): boolean {
    return Boolean(element.closest(editableSelector));
  }

  function shouldSkipElement(element: Element | null): boolean {
    if (element?.nodeType !== elementNode) {
      return false;
    }

    if (skipElements.has(element.tagName)) {
      return true;
    }

    if (isEditable(element)) {
      return true;
    }

    return Boolean(element.closest(skipSelector));
  }

  function getProcessedAttributeValue(
    element: Element,
    attributeName: (typeof attributeNames)[number],
  ): string | undefined {
    return processedAttributeValues.get(element)?.get(attributeName);
  }

  function setProcessedAttributeValue(
    element: Element,
    attributeName: (typeof attributeNames)[number],
    value: string,
  ): void {
    const elementValues = processedAttributeValues.get(element) ?? new Map<(typeof attributeNames)[number], string>();

    elementValues.set(attributeName, value);
    processedAttributeValues.set(element, elementValues);
  }

  return {
    rewriteRoot,
    scheduleRewrite,
  };
}
