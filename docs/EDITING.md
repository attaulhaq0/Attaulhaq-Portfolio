# Editing the portfolio

See [the documentation index](INDEX.md) and [codebase map](CODEBASE-MAP.md) for rendering paths, assets, scripts and tests. The active project is `G:/Portfolio Website/Attaulhaq-Portfolio`; the adjacent inspiration checkout is comparison material.

## Quick map

| Change | File |
|---|---|
| Name, email, GitHub and general metadata | `src/data/site.ts` |
| Experience timeline / approach cards | `src/data/site.ts` |
| Project titles, text, tags, external links and media | `src/data/projects.ts` |
| Freelance website cards, contribution/evidence and live/source URLs | `src/data/client-work.ts`, `ClientWork.astro`, `src/styles/client-work.css` |
| Tool names and project contexts | `src/data/tech-stack.ts`, `src/components/TechStack.astro` |
| Historical Fiverr metrics / Subrickzz certificate | `src/data/achievements.ts`, `CareerHighlights.astro` for Fiverr, `ExperienceCertificate.astro` in the Subrickzz timeline entry |
| Color palette and fonts | `src/styles/tokens.css` |
| Layout, responsive spacing and component styling | `src/styles/global.css` (section headings identify each area) |
| Homepage section order and narrative | `src/pages/index.astro` |
| Hero wording, fallback image and automatic 3D startup | `src/components/Hero.astro` |
| Header / footer | `src/components/Header.astro`, `Footer.astro` |
| Shared case-study layout | `src/pages/work/[slug].astro` |
| Active permitted avatar loader / pose | `src/islands/SourceCharacter.tsx` |
| Retained original studio character geometry | `src/islands/StudioCharacter.tsx` |
| Retained personal model geometry | `src/islands/PersonalAvatar.tsx` |
| Portrait camera and lighting | `src/islands/SystemScene.tsx` |
| Dark spatial layouts | `src/styles/redesign.css` |
| Event media and captions | `src/data/moments.ts`, `src/components/FieldNotes.astro` |
| Illustrated stage controls | `src/components/WorkflowDiagram.astro`, `src/styles/workflow-diagram.css`, `public/images/workflow/` |
| Game development map disclosure | `src/data/projects.ts` (`developmentImage`), `src/components/DevelopmentEvidence.astro` |
| Native project players | `src/components/HomeGameplay.astro`, `ProjectMedia.astro`, `ConceptMotion.astro` |
| Section entrances / accent cues | `src/components/SectionMotion.astro`, `src/styles/section-motion.css` |
| Original illustrations / replacements | `public/images/` |
| Owner-supplied downloadable CV | `public/documents/sheikh-atta-ul-haq-cv.pdf`, linked through `src/data/site.ts` |

## Run locally

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321`. Changes update the local page automatically. Tests use the built preview on port 4322; the separate inspiration/comparison server uses 4330. Stop the foreground server with Ctrl+C; if launched as a managed background job, stop that job through the launching environment.

Before installs/builds/tests, use `G:/Portfolio Website/Start-Portfolio.ps1` or set process `TEMP`/`TMP` to `G:/Portfolio Website/.runtime/temp`, `npm_config_cache` to `G:/Portfolio Website/.runtime/cache/npm` and `PLAYWRIGHT_BROWSERS_PATH` to `G:/Portfolio Website/.runtime/cache/playwright`. Keep review screenshots in `G:/Portfolio Website/.review/`.

## Change a case study

Edit the matching entry in `src/data/projects.ts`. Each `slug` creates `/work/<slug>/`. Keep slugs stable after publication to preserve links. `featured` controls the homepage card collection. The Digital Dynasty archive link is explicitly set in `src/pages/index.astro`; change it if changing that slug.

- `summary`: one-sentence card/metadata introduction.
- `description`: longer introduction at the top of the case study.
- `overview`: problem and context.
- `contributions`: personally attributable work; distinguish project scope and team contribution.
- `system`: a conceptual flow, not an implied deployment diagram.
- `designConsiderations`: defensible reasoning; do not invent implementation decisions.
- `scopeNote`: clarify illustration, project or contribution boundaries naturally.
- `homeCover` / `homeCoverAlt`: independently select the blended homepage illustration. Case `cover` remains the real capture or case artwork.
- `homeOrder`: order featured rows without changing stable project indices.
- `sectionTitles`: keep case headings specific to the project's subject.
- `developmentImage`: explanatory development map, dimensions, caption and static HTML reasoning shown in native details.
- `conceptMotion`: explicitly labeled concept animation, poster, dimensions and caption.

To add a project, duplicate an entry, give it a unique slug/index, create its image and provide all typed fields. The dynamic page route and next-project links follow automatically. Update tests that intentionally expect five known cases/four featured cards.

## Replace an illustration with a real screenshot

1. Export an approved, anonymized image, preferably WebP/AVIF around 1200px wide.
2. Put it in `public/images/` using a descriptive filename.
3. Change `cover` and `coverAlt` in the project entry.
4. Set `coverKind: 'screenshot'` or `coverKind: 'gameplay'` and optionally `coverCaption` in the same data entry. Omitted `coverKind` defaults to `'illustration'`. Preserve accurate labels; Cosmo and Digital Dynasty case covers use real captures, while homepage covers remain illustrative.
5. Preserve the actual media ratio. Update `coverWidth`, `coverHeight` and responsive sources where used; do not stretch or crop away meaningful gameplay or document context.

No fake product screenshots are included. Check third-party image rights before committing any file.

## Add a video

Place a small optimized MP4 in `public/media/` or use a directly playable HTTPS media URL. Add this optional field to a project:

```ts
media: {
  src: '/media/project-demo.mp4',
  poster: '/images/project-demo-poster.webp',
  caption: 'A short demonstration of the reporting workflow.',
  captions: '/media/project-demo.en.vtt',
  transcript: 'Describe the spoken demonstration here.'
}
```

The component provides controls, `playsinline`, `preload="none"`, captions and optional transcript. No audio or video autoplays. Supply captions for speech. YouTube/Vimeo webpage URLs are NOT native video source URLs; use a normal link or implement an explicit click-to-load embed. Keep long/large recordings on a suitable video host/CDN, not in Git. Raw media masters are ignored under `public/media/raw/`.

## Navigation and personal media

Homepage artwork is selected independently with `homeCover` and `homeCoverAlt`; case pages continue to use `cover` for real media or case artwork. `HomeGameplay.astro` presents native controls over an illustrated poster and switches to the actual recording on play. Keep these covers labeled as conceptual illustrations. The approved CV download appears only in desktop/mobile navigation; avoid repeating download cards in content sections.

The owner-supplied, two-page CV is available at `public/documents/sheikh-atta-ul-haq-cv.pdf`. It is copied intact from the updated PDF supplied on October 11, 2026; it retains the owner's résumé layout and professional contact details. Replace this file only with an owner-approved résumé and keep the download path stable. The public LinkedIn link is owner-supplied. Website contact text uses the approved email and general location. Do not add dead `#` links to make a section appear complete.

## Before committing

```sh
npm run check
npm run build
npx playwright install chromium  # first use only
npm test
```

Review the site on a narrow screen and with keyboard navigation. Commit one meaningful change at a time; use a branch and pull request for review. Screenshots/reports under `test-results/` and `playwright-report/` are generated, not source.

The five current homepage covers in `public/images/home/` are original Sunburst illustrations with gently feathered empty borders. Generated sources/prompts and hashes are recorded in `output/imagegen/home/`; shared stage art is in `public/images/workflow/` with its atlas/manifest under `output/imagegen/workflow/`. Blueprint-style development maps are explanatory reconstructions, not native project screenshots. The current hero poster is rendered from the permitted source model's authored standing pose. Earlier generated portrait/studio/personal studies remain retained separately. Labeled Sora concept clips and the real immersive walkthrough use explicit native playback controls.

The event gallery’s `moments.ts` entries support context, date, location, role, detail paragraphs and extra photos. Use exact evidence to distinguish attendance from organizer/speaker roles. Keep the date broad when sources conflict. Gallery styling lives in `field-notes.css`, imported after the main redesign styles.

Each event uses one outer story and an independent inner photo collection. Merge approved photos into the correct story instead of duplicating events. Preserve the complete branded welcome and summit graphics, use full-image links for document detail, and keep Qaiser Ahmed Sheikh's source post distinct from the Daniyal Chaudhry welcome record. Update photo dimensions/captions when replacing an export. Additional QSTP/Google images belong to their existing story collections.

Digital Dynasty’s current case study uses the owner-supplied gameplay recording and report. Regenerate its selected clips and frames with `node scripts/process-digital-dynasty.mjs`. Edit the project’s `media` width/height, caption, durationLabel and description alongside its three `gallery` entries. Keep historical manual test results distinct from newly executed website tests. The raw report and original video are kept at their supplied F: paths.
The October 2026 audit moved homepage ordering and case-specific headings into project data (`homeOrder`, `sectionTitles`). Native nested photo/story galleries remain readable without JavaScript and pause lifecycle resources on pagehide. Homepage contact uses the owner’s separate personal Calendly event and email. Case pages use a compact contact block to avoid repeating the homepage’s full CTA section. `coverWidth`, `coverHeight` and `coverSrcSet` support responsive artwork; `conceptMotion` adds an explicitly labeled, click-to-play Sora concept video; `developmentImage` adds an explanatory Blueprint-style reconstruction with static HTML reasoning. All native project players pause offscreen, when hidden and on pagehide.

The owner selected automatic 3D startup for the hero. Keep the static HTML readable and the model-rendered poster visible until a real model frame is ready. `mountScene.tsx` accepts an AbortSignal so pagehide promptly cancels pending work and unmounts active resources; pageshow automatically restores the scene. Keep DPR capped, demand rendering and reduced-motion behavior. The poster remains the no-JS/WebGL failure fallback; there is no user-facing 3D toggle.

The hero uses native scroll progress to scrub the source model’s actual intro clip from its end pose toward 0.75 seconds as the hero leaves the viewport. `SourceCharacter.tsx` owns this pose mapping and subtle orientation change. Do not substitute a moving poster for the actual model or add a perpetual render loop; scroll and pointer events invalidate demand frames. Reduced motion resets the model to its resting pose.

The latest hero starts in an authored standing rig pose with the desk/chair hidden, then blends into the supplied seated animation and reveals the desk through the desktop introduction. The source contains no standing clip; this pose is authored for the portfolio. `render-source-character.mjs` rebuilds the matching standing fallback. Reduced motion holds standing; mobile keeps the canvas inline. Current owner instructions supersede historical opt-in/seated descriptions.

Keep raw recordings, private review sources and previous media edits in ignored runtime storage. The previous 72-second Cosmo reel is preserved under `.runtime/media-originals/`; `assemble-cosmo-showcase.mjs` applies the approved 20-second trim and records the retained 52-second edit. Update duration labels and descriptions together with a media edit. Public `output/` manifests should describe sanitized provenance and processing, not contain credentials or private contact/account data.

## Freelance website work

The homepage's **Freelance web development** section follows selected work and precedes the approach. Maintain its four entries in `src/data/client-work.ts`, layout in `ClientWork.astro`, and owning styles in `client-work.css`. Keep these separate from `projects.ts` and the five `/work/` case routes. Its public anchor is `#freelance-web-development`.

The 1600x1120 WebP compositions in `public/images/client-work/` show real website desktop/mobile UI. Preserve their ratio, useful alt text and original UI colors. Keep source captures and review artifacts outside `public/`. Do not substitute generated concepts or imply measured traffic, performance, release outcomes or independent verification of authorship. Artechs USA has source-backed canonical/sitemap/JSON-LD evidence; the other three entries claim homepage Open Graph/Twitter metadata only. Backend links describe setup in source, not a live portfolio backend. Preserve native View website/View code links, keyboard details, both themes, no-JS access and the 320px layout. Run the focused `client-work.spec.ts` alongside the required complete checks.

Arissoft and The EB1 also have full desktop homepage captures in native evidence details, with a View full homepage link to the original image. Maintain these through the optional fullHomepage field, preserve intrinsic image dimensions and keep the entire page visible without cropping. The other cards remain unchanged.
