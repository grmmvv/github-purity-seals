# Smoke Test

Run a local build before loading the extension:

```bash
npm run build
```

Then open `chrome://extensions`, enable Developer mode, choose Load unpacked and select this repository directory.

Check representative GitHub surfaces:

- repository main page
- pull request page
- Actions page
- releases page
- code file page

Confirm:

- normal page labels are rewritten
- code blocks and file content stay unchanged
- inputs, textareas and editable fields stay unchanged
- GitHub navigation remains usable
- no console errors are reported by the extension
