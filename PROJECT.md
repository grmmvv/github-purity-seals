# GitHub: Adeptus Mechanicus Edition

> _The Omnissiah protects those who protect the Machine._

---

## Overview

GitHub: Adeptus Mechanicus Edition is a Chrome extension that transforms the GitHub interface into something worthy of the Forge Worlds of Mars.

The extension replaces GitHub terminology, UI elements and status indicators with concepts inspired by the Adeptus Mechanicus from Warhammer 40,000 while preserving 100% of GitHub's usability.

This is **not** a meme extension.

The goal is to create an interface that feels like it could genuinely be used by Tech-Priests responsible for maintaining humanity's greatest repositories.

---

# Design Philosophy

The project follows four principles.

## 1. Never reduce usability

The extension must never make GitHub harder to use.

Users should immediately understand every element even if terminology changes.

---

## 2. Respect the source material

Warhammer terminology should be used consistently and appropriately.

Avoid random references.

Every replacement should make sense within Adeptus Mechanicus lore.

---

## 3. Production quality

The extension should feel polished.

Animations, colors and icons should enhance the interface instead of overwhelming it.

No "cheap meme" feeling.

---

## 4. GitHub remains GitHub

Nothing should modify GitHub functionality.

Only presentation changes.

No API calls.

No telemetry.

No external services.

---

# MVP Goals

## Text Replacement

Replace GitHub terminology with Adeptus Mechanicus terminology.

Examples:

| GitHub          | Adeptus Mechanicus              |
| --------------- | ------------------------------- |
| Repository      | Reliquary                       |
| Pull Request    | Rite of Integration             |
| Merge           | Consecrate                      |
| Branch          | Crusade Path                    |
| Commit          | Inscription                     |
| Workflow        | Ritual                          |
| GitHub Actions  | Liturgies                       |
| Checks          | Purity Trials                   |
| Passed          | Blessed                         |
| Failed          | Tainted                         |
| Approved        | Sanctified                      |
| Review Required | Inquisitorial Approval Required |
| Deploy          | Dispatch to Holy Terra          |
| Release         | Sacred Release                  |
| Artifact        | Sacred Relic                    |

---

## Dynamic GitHub Support

GitHub is a Single Page Application.

The extension must react correctly to:

- page navigation
- AJAX updates
- dynamically loaded comments
- PR timeline updates
- Actions pages

without requiring page refreshes.

---

## Performance

DOM mutations should be efficient.

Avoid rescanning the entire page.

Prefer incremental updates.

---

# Future Features

## Purity Seals

Replace success checkmarks with imperial purity seals.

Examples:

✔ Checks passed

↓

🦅 Purity Seal Granted

---

## Machine Spirit Status

Replace loading indicators.

Examples:

Loading...

↓

Reciting the Litany of Compilation...

---

Deploying...

↓

Appeasing the Machine Spirit...

---

Waiting for checks...

↓

Awaiting the Omnissiah's Blessing...

---

## The Inquisition

Failed security checks should become lore-friendly.

Examples:

Security scan failed

↓

The Inquisition has detected traces of Chaos corruption.

---

Unsigned artifact

↓

This relic bears no Purity Seal.

---

## Imperial Theme

Optional UI theme:

- Mars red
- brass accents
- parchment highlights
- purity seals
- subtle gothic styling

The interface must remain readable.

---

## Icons

Potential replacements:

GitHub Checkmark

↓

Purity Seal

---

Package icon

↓

Sacred Relic

---

Actions icon

↓

Cog Mechanicus

---

Review icon

↓

Inquisitorial Rosette

---

# Technical Goals

- Manifest V3
- Vanilla TypeScript
- No framework unless necessary
- Small bundle size
- No build step for MVP if possible
- Modern browser support

---

# Out of Scope

The extension will NOT:

- modify repositories
- call GitHub APIs
- inject advertisements
- collect telemetry
- require an account
- require cloud services

---

# Roadmap

## v0.1

Text replacement only.

---

## v0.2

Purity seals.

Icons.

Status messages.

---

## v0.3

Theme support.

---

## v0.4

Settings page.

Enable/disable individual features.

---

## v1.0

Chrome Web Store release.

Documentation.

Tests.

---

# Contribution Philosophy

Every contribution should answer one question:

> "Would a Tech-Priest genuinely use this?"

If the answer is "yes", it belongs here.

If the answer is "it's funny", reconsider.

---

# Motto

> _Knowledge is power. Guard it well._
