# Attaulhaq Portfolio

An original personal portfolio for Sheikh Atta-ul-Haq: from interactive worlds to intelligent products.

## Direction

A dark spatial homepage with an owner-permitted source character and native scroll motion, neutral warm-white work-page openings, Sunburst concept artwork, CV-grounded case studies, a slideable gallery of real event stories and an immersive education walkthrough. Useful content never waits for WebGL.

## Development

Start with [AGENTS.md](AGENTS.md) and the [codebase map](docs/CODEBASE-MAP.md) to find the content, components, media, scripts and verification workflows.

```sh
npm ci
npm run dev
```

Requires Node.js 22.12 or later (Node 24 LTS recommended). Local preview: http://127.0.0.1:4321.

## Principles

- Static HTML first; native scrolling and meaningful mobile layouts.
- Centralized content, design tokens, reusable page components.
- Original illustrations, clearly distinguished from product screenshots.
- Honest project scope and no fabricated performance/business metrics.
- No database, trackers, paid services or client-side secrets required.

## Provenance and rights

This is an independent Astro implementation. Development is AI-assisted, with design direction and personal/project information supplied by the portfolio owner. The owner confirmed permission for Moncy Yohannan’s original avatar; its use and attribution are documented in `docs/THIRD-PARTY.md`. The reference’s page source and trial animation plugins are not used by the portfolio.

Original site code and artwork: all rights reserved unless a separate license is supplied. Public visibility is not an open-source license. Third-party dependencies and fonts remain under their respective licenses. See subsequent documentation for editing, architecture and deployment.

## G: workspace launcher

Run `G:/Portfolio Website/Start-Portfolio.ps1` to keep TEMP/TMP, npm cache and Playwright browsers on G:. Add `-Build` for the static production preview.

The retained photo-informed study is `public/models/atta-avatar.glb`. Run `node scripts/export-avatar.mjs` to rebuild it from the authored geometry and face texture. This earlier stylized model is not a photogrammetry scan and is not the active hero.

The current hero automatically loads the owner-permitted `SourceCharacter.tsx` integration and `public/models/source-character.glb`. Its actual animation clip responds to native scroll. A transparent mesh-rendered poster supports loading, WebGL failure and no-JavaScript reading. Earlier studio and personal models remain separate. The inspiration site runs independently at `http://127.0.0.1:4330/` for comparison; portfolio preview remains `http://127.0.0.1:4321/`.

The approved two-page CV is downloadable at `/documents/sheikh-atta-ul-haq-cv.pdf`. General meeting links use the owner’s separate personal Calendly event. Gameplay remains actual development footage; Sunburst development diagrams and Sora videos are explicitly conceptual explanations. Image exports include 3840×2160 derivatives; the configured deployment returned 1672×941 originals, so the 4K derivatives are upscaled rather than native generations.
