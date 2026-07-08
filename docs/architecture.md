# Architecture

The extension is intentionally small and presentation-only.

## Runtime

`manifest.json` injects a compiled script into `https://github.com/*`:

- `dist/content/content.js` contains bundled terminology data and rewrites safe text nodes and selected accessibility
  attributes.

The stylesheet `src/ui/github-theme.css` adds subtle visual treatment without changing layout or behavior.

## DOM Strategy

GitHub is a Single Page Application, so the content script uses `MutationObserver`.

The initial pass scans `document.body`. Later passes process only changed text nodes, attributes and added nodes.

The script skips:

- code blocks
- editable fields
- form controls
- script/style/svg/canvas content
- common GitHub code viewer containers

## Boundaries

The extension does not:

- call GitHub APIs
- write to repositories
- store user data
- collect telemetry
- inject remote assets

## Source Layout

TypeScript source files live under `src/`. `npm run build` bundles the content script into `dist/`, which is what Chrome
loads.
