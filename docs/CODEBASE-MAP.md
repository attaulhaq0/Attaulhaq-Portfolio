# Codebase map

The active site is an Astro portfolio with static HTML and focused JavaScript enhancements. Keep the current logical folders; this map makes ownership discoverable without moving working files.

## Content to rendering

| Content or behavior | Edit here | Rendered by |
|---|---|---|
| Name, metadata, email, LinkedIn, GitHub, personal Calendly and CV | `src/data/site.ts` | `BaseLayout.astro`, `Header.astro`, `Footer.astro`, `Hero.astro` |
| About narrative, timeline and capabilities | `src/data/site.ts` | `src/pages/index.astro` |
| Project text, homepage art/order, case covers, clips, diagrams and stage descriptions | `src/data/projects.ts` | `ProjectCard.astro`, `HomeGameplay.astro`, `src/pages/work/[slug].astro` |
| Tool names and project-specific contexts | `src/data/tech-stack.ts` | `TechStack.astro` on the homepage and cases |
| Event stories, photographs, sources and immersive education | `src/data/moments.ts` | `FieldNotes.astro` |
| Historical Fiverr metrics and Subrickzz certificate | `src/data/achievements.ts` | `CareerHighlights.astro` |

Component names in this document are under `src/components/` unless a different path is given. Shared layout is `src/layouts/BaseLayout.astro`; it loads fonts/styles, metadata, navigation, contact/footer and `SectionMotion.astro`. The homepage is `src/pages/index.astro`. Five stable project slugs generate `/work/<slug>/`; `survival-game` is Digital Dynasty's retained slug. A custom 404, robots and sitemap routes are under `src/pages/`.

## Interaction areas

- **Hero:** `Hero.astro` starts the dynamically imported scene automatically, preserves the standing poster until the first rendered frame and moves the canvas into the desktop intro composition. `src/islands/mountScene.tsx` owns mounting/cancellation; `SystemScene.tsx` owns canvas/camera/lighting; `SourceCharacter.tsx` loads the permitted source model, creates the authored standing pose and blends into seated source animation on native scroll. Mobile/reduced-motion experiences keep the inline hero; reduced motion holds the standing pose.
- **Project media:** `HomeGameplay.astro` provides illustrated homepage posters with real native footage on play. `ProjectMedia.astro` renders case showcases, clips and captures. `ConceptMotion.astro` and the E Deviser `ProjectCard.astro` disclosure hold labeled concept animations. Native playback pauses offscreen, when hidden and on pagehide.
- **Workflows:** `WorkflowDiagram.astro` renders five illustrated stage controls plus HTML explanations; keyboard arrows/Home/End and `#system-stage-N` select a stage. `DevelopmentEvidence.astro` puts detailed game reconstruction maps and HTML reasoning in native disclosure.
- **Stories:** `FieldNotes.astro` owns native outer story and inner photo tracks, independent controls, role/date facts, source links, details and the immersive classroom video.
- **Motion:** `SectionMotion.astro` and `section-motion.css` add short entrances, alternating accent cues, hover feedback and supported page transitions. HTML is visible by default; JavaScript only arms offscreen entrances. Keep focus, reduced-motion and page lifecycle recovery.
- **Retained models:** `StudioCharacter.tsx` and `PersonalAvatar.tsx` are earlier original studies, not the active hero. Preserve their source/export records unless cleanup is specifically requested.

## Styling

| File under `src/styles/` | Area |
|---|---|
| `tokens.css`, `global.css` | Base tokens, typography, reset and shared primitives |
| `redesign.css` | Dark homepage, hero, project rows, biography and contact styling |
| `scene-journey.css` | Desktop standing-to-seated canvas composition |
| `case-study.css`, `project-media.css` | Case openings, content and native media |
| `workflow-diagram.css` | Illustrated stage ring and selected explanation |
| `field-notes.css` | Stories, nested photo tracks and immersive section |
| `tech-stack.css`, `career-highlights.css` | Toolkit and career records |
| `editorial-additions.css`, `section-motion.css` | Current editorial refinements and motion |

Check import order in `BaseLayout.astro` before changing a shared rule. Prefer a targeted rule in the owning stylesheet over another broad override.

## Publishable assets and private records

| Location | Purpose |
|---|---|
| `public/images/home/` | Five blended homepage illustrations: E Deviser, AegisOps, Family OS, Cosmo and Digital Dynasty |
| `public/images/workflow/` | Shared context, decision, build, review and outcome stage sculptures |
| `public/images/development/` | Cosmo and Digital Dynasty explanatory maps; not native screenshots or exact project graphs |
| `public/images/cosmo/`, `public/images/digital-dynasty/` | Actual development/gameplay frame exports |
| `public/images/moments/` | Approved event/photo exports and complete branded summit pages |
| `public/images/source-character-poster.webp`, `public/models/source-character.glb` | Active standing fallback and permitted model |
| `public/images/subrickzz-experience-certificate.webp` | Full approved employment certificate export |
| `public/images/fiverr-performance-metrics.webp` | Focused historical Fiverr metrics, separate from the employment certificate |
| `public/media/` | Optimized silent gameplay, immersive walkthrough and labeled concept clips |
| `public/documents/sheikh-atta-ul-haq-cv.pdf` | Intact approved two-page résumé; navigation download only |
| `output/imagegen/` | Original generated images, exact prompts and source/export manifests for home/case/editorial/workflow/development art |
| `output/cosmo/`, `output/digital-dynasty/`, `output/moments/`, `output/sora/` | Sanitized selection, encoding and provenance records |
| `.runtime/`, `.local/` | Ignored private review sources, backups and temporary media |
| `G:/Portfolio Website/.review/` | Private source exports, screenshots and audit notes outside the repository |

`public/` is deployed; `output/`, source and private review folders are not. Review content before adding any asset to `public/`. Keep raw recordings, unreviewed reports, private dashboards, credentials and restricted reference assets private. Inspect the current component/data reference before assuming a retained file is active.

## Regeneration and checks

| Script under `scripts/` | Purpose |
|---|---|
| `render-source-character.mjs` | Rebuild the standing fallback from the active model/camera/pose |
| `assemble-cosmo-showcase.mjs` | Assemble selected footage, remove the first 20 seconds, then seconds 4–12 of that edit, yielding 44 seconds |
| `process-digital-dynasty.mjs` | Create the prototype excerpt and selected real captures |
| `process-sora-work-concepts.mjs`, `optimize-education-concept.py` | Optimize concept clips/posters and verify encoding |
| `foundry-sora.mjs` | Existing owner-authorized generation workflow; credentials remain local |
| `export-avatar.mjs`, `export-studio-character.mjs`, `render-studio-character.mjs` | Retained original model studies/exports |

Run these commands from the active repository with G: temporary/cache settings:

```sh
npm run check
npm run build
npm test
```

`playwright.config.ts` uses the built preview on 4322. `portfolio.spec.ts` covers broad routes/accessibility; `portfolio-additions.spec.ts` covers content/media additions; `gallery.spec.ts`, `workflow.spec.ts`, `cosmo.spec.ts` and `digital-dynasty.spec.ts` cover their focused interactions; `source-character.spec.ts`, `lifecycle.spec.ts` and `section-motion.spec.ts` cover startup, teardown and motion. Preserve meaningful tests when changing deliberate counts or behavior. For visual work, capture stable desktop, 390px and 320px states and open the saved images. Test no-JS, reduced motion, keyboard and actual native media behavior as relevant.
