# Portfolio maintenance instructions

Read `README.md`, `docs/INDEX.md`, `docs/CODEBASE-MAP.md`, `docs/EDITING.md`, `docs/ARCHITECTURE.md` and `docs/CONTENT-PROVENANCE.md` before changing the site. Check `docs/THIRD-PARTY.md` before using reference assets.

## Workspace and commands

- Active project: `G:/Portfolio Website/Attaulhaq-Portfolio`. The adjacent `Portfolio-Website-main` is comparison/reference material, not the portfolio to edit. Its comparison server uses port 4330.
- Keep installs, browser downloads, temporary exports and review artifacts on G:. Set process `TEMP`/`TMP` to `G:/Portfolio Website/.runtime/temp`, `npm_config_cache` to `G:/Portfolio Website/.runtime/cache/npm` and `PLAYWRIGHT_BROWSERS_PATH` to `G:/Portfolio Website/.runtime/cache/playwright` before install/build/test commands. `G:/Portfolio Website/Start-Portfolio.ps1` applies these settings.
- Development serves port 4321; production-browser tests use the built preview on 4322. Hostinger receives `dist/`, not source files. Do not assume server-side Node or Apache support.
- Preserve unrelated checkout work. Keep the existing logical organization; do not move assets or perform broad refactors just to make folders look tidy.

## Content ownership

- `src/data/site.ts`: identity, public contacts, personal Calendly event, approved navigation-only CV, About, timeline and capabilities.
- `src/data/projects.ts`: five case studies, stable slugs, homepage order/art, real media, tools, stage descriptions and development diagrams.
- `src/data/moments.ts`: personal/event stories, role/date context, photo collections and immersive education footage.
- `src/data/achievements.ts`: historical owner-confirmed Fiverr metrics and Subrickzz employment/certificate.
- `src/data/tech-stack.ts`: tool names and evidence-backed project contexts.
- Use first-person, employer-relevant copy. Distinguish personal contribution from team scope, design from implementation, and implementation from release. Never invent expertise, outcomes, awards, metrics, project status or endorsements. Owner-confirmed historical Fiverr values are not claims about current seller status.
- Record new sources and claim boundaries in `docs/CONTENT-PROVENANCE.md`. Preserve original historical paths/hashes. Source-specific avatar permission recorded in `docs/THIRD-PARTY.md` does not authorize other reference assets or general redistribution.

## Rendering and interactions

- Essential content stays static HTML. Preserve no-JS reading, native controls/details, keyboard navigation, 320px layouts and reduced motion. Do not turn the site into a SPA or make reading depend on WebGL.
- The owner selected **automatic** 3D startup and an authored **standing-to-seated scroll journey**. There is no opt-in toggle. `Hero.astro` dynamically imports `mountScene.tsx`; `SourceCharacter.tsx` owns the standing rig pose and source animation blend. Keep the standing poster visible until a real model frame is ready, and preserve no-JS/WebGL failure fallback.
- Keep React/Three out of static initial imports. Preserve capped DPR, demand rendering, offscreen/hidden suspension, AbortSignal cancellation, pagehide disposal and pageshow restoration. Reduced motion holds the standing pose. Clean up observers, listeners, mixers, textures, geometries and other owned resources.
- Homepage project covers are original illustrations in `public/images/home/`; game players show real footage when played. Case covers/media remain independently selected. Never represent concept art, concept animation or Blueprint-style reconstruction as a native screenshot or exact project graph.
- `WorkflowDiagram.astro` keeps numbered, labeled stage buttons and readable HTML explanations; its shared art is decorative. `DevelopmentEvidence.astro` presents the game development maps in native details. Preserve direct stage hashes and keyboard controls.
- `FieldNotes.astro` has independent story and photo carousels. Preserve complete branded source graphics, full-image links, captions and useful role/date context. Do not conflate different summit guest/event records or infer identities from appearance.
- Keep the approved CV download in navigation, the personal Calendly event in contact actions, and public email/general location in site copy. Avoid repeated CV cards or redundant biography/experience blocks.

## Files and verification

- `public/` is publishable. Keep secrets, private dashboard/contact data, raw recordings, unreviewed reports, employer internals and restricted references out of it and out of commits. Private review sources belong in ignored `.runtime/` or the workspace `.review/` directory. Sanitized processing and concept provenance live under `output/`.
- Do not add a backend, analytics or external services without a concrete requirement and owner authorization. Never print credentials or put them in browser code.
- Run `npm run check`, `npm run build` and `npm test` before claiming completion. Update expectations for deliberate content/count changes. Recheck affected desktop/mobile flows, keyboard, no-JS and reduced-motion behavior; automated axe checks do not certify all accessibility.
- Capture stable screenshots after entrances finish or each section enters view. Offscreen blocks armed for entrance motion can be blank in rapid whole-page captures; reject that capture before reporting a rendering defect.
- Commit only when authorized. Make genuine scoped commits and report actual checks, risks and evidence; do not fabricate history or unperformed validation.
