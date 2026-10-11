# Portfolio documentation

Start with the [codebase map](CODEBASE-MAP.md) to find the component or data file responsible for a change. Use [editing instructions](EDITING.md) for content and media updates, then verify the affected flow.

| Document | Use it for |
|---|---|
| [Codebase map](CODEBASE-MAP.md) | Content ownership, rendering paths, assets, scripts and tests |
| [Editing](EDITING.md) | Updating biography, projects, galleries, CV and media |
| [Architecture](ARCHITECTURE.md) | Static HTML, automatic standing-to-seated hero, native interactions and lifecycle decisions |
| [Content provenance](CONTENT-PROVENANCE.md) | Sources, dates, claim boundaries and historical changes |
| [Third-party notices](THIRD-PARTY.md) | Dependencies, source-specific model permission and visual rights |
| [Hostinger deployment](HOSTINGER.md) | Building and publishing the static `dist/` output |
| [Spatial design record](design/2026-10-11-spatial-portfolio.md) | Historical design decisions; current code and owner instructions take precedence |

The parent workspace holds private reviews in `G:/Portfolio Website/.review/`. Concept and media processing manifests under `output/` record reproducible sources and exports; those directories are not deployed by Astro. Raw sources remain at their supplied locations or in ignored runtime storage.
