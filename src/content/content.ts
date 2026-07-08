import { installDomRewriter } from './dom-rewriter';
import { defaultTerminology } from '../terminology/replacements';
import { createTextTransformer } from '../terminology/transform';

(() => {
  'use strict';

  const transformText = createTextTransformer(defaultTerminology);

  installDomRewriter({
    document,
    window,
    transformText,
  });
})();
