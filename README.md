# github-purity-seals

Transform GitHub into a Forge World of the Adeptus Mechanicus. Replace GitHub UI with Warhammer 40K-inspired terminology, purity seals and imperial aesthetics.

## MVP

This is a Manifest V3 Chrome extension. The current MVP is presentation-only:

- replaces common GitHub terminology with Adeptus Mechanicus-inspired wording
- observes GitHub SPA updates through `MutationObserver`
- avoids editing code blocks, inputs, textareas and editable content
- does not call GitHub APIs
- does not collect telemetry
- does not modify repositories

## Local Installation

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose Load unpacked.
4. Select this repository directory.
5. Open `https://github.com`.

## Development

TypeScript sources are compiled into `dist/` before loading the extension.

Extension files:

- `manifest.json`
- `src/terminology/replacements.ts`
- `src/terminology/transform.ts`
- `src/content/content.ts`
- `src/ui/github-theme.css`

Useful commands:

```bash
npm run build
npm run check
```

After editing extension files, run `npm run build`, then reload the unpacked extension from `chrome://extensions`.
