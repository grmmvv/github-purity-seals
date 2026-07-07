# Contributing

## Principles

- Preserve GitHub usability.
- Keep the extension presentation-only.
- Avoid telemetry, external services and API calls.
- Prefer small, reviewable terminology changes.

## Local Checks

Run:

```bash
npm run check
```

Before loading the extension manually, run:

```bash
npm run build
```

## Manual Test

1. Load the repository as an unpacked extension in Chrome.
2. Open GitHub repository, pull request, Actions and release pages.
3. Confirm terminology changes are readable.
4. Confirm code blocks, inputs and textareas remain unchanged.
