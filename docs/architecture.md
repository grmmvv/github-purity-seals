# Architecture

The extension is intentionally small and presentation-only.

## Runtime

`manifest.json` injects compiled scripts into `https://github.com/*`:

- `dist/terminology/replacements.js` defines terminology data.
- `dist/content/content.js` rewrites safe text nodes and selected accessibility attributes.

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

TypeScript source files live under `src/`. `npm run build` emits JavaScript into `dist/`, which is what Chrome loads.
