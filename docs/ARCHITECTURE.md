# Architecture and decisions

## Static first

Astro builds seven HTML pages: the homepage, five project routes and a custom 404. Text, navigation, contact and illustrations work without client-side JavaScript. Case studies come from one typed project array rather than a database. React is reserved for the owner-approved 3D hero character, not used to hydrate the whole page.

## Current theme and workflow

The owner selected Velvet Violet on October 12, 2026, then requested a lavender light mode for the entire site. `BaseLayout.astro` reads only the local `portfolio-theme` preference before paint. `ThemeToggle.astro` changes semantic CSS colors, announces the next mode through its accessible name and synchronizes page restoration and other tabs. Storage failure does not prevent switching. The native toggle is hidden without JavaScript; all content remains readable in the default dark palette.

`theme.css` is the owning palette layer, loaded after retained component styles. Concept illustrations use genuine alpha derivatives on both backgrounds; documentary images and gameplay are never inverted. `SystemScene.tsx` changes lights in response to the theme event while retaining demand rendering and existing teardown. The original avatar remains active while the owner's untextured, unrigged personal mesh is inspected.

The earlier circular workflow is replaced by five sequential tiles on desktop and readable rows on mobile. Direct stage hashes, keyboard arrows/Home/End and the HTML explanation are retained. Historical descriptions below document the previous designs and are superseded by this current contract.

```
src/data/                 typed owner/project content
src/layouts/              shared document, metadata, fonts and chrome
src/components/           reusable Astro UI and media
src/pages/                homepage, generated cases and 404
src/islands/              automatic React/Three hero enhancement
src/styles/               shared design tokens and section-organized CSS
public/images/            original conceptual illustrations and approved photo exports
public/media/             optional optimized clips/captions (no raw masters)
tests/                    production-browser acceptance tests
.github/workflows/        checks, browser tests and static build artifact
```

## Automatic 3D with a static fallback

The owner explicitly requested an automatic 3D hero on October 11, 2026, replacing the earlier opt-in toggle. The static HTML and transparent model-rendered WebP remain readable immediately. After the first animation frame, a dynamic import loads React/Three and the 1.54 MB local model. The poster remains visible until the avatar has rendered, then the canvas fades in once. There is no loading gate or 3D toggle. The substantial model and JavaScript now load automatically; this is an intentional experience/performance tradeoff, not a claim that Three has no cost.

`SourceCharacter.tsx` fetches and parses the verified local `public/models/source-character.glb` when the automatic hero mounts. It applies the source model's intro end pose, hides the foreground monitor for the portrait composition, and uses the original material textures. It has no owner photograph texture and does not claim to represent the owner's likeness. The source license excludes asset reuse by default; `THIRD-PARTY.md` records the owner's explicit confirmation of permission from the original designer and credit. The earlier independently authored studio character and personal avatar remain separate retained assets.

The active model contains no Draco compression, so no external decoder, HDR environment, physics, postprocessing or source page animation orchestration is needed. DPR is capped at 1.5. Native hero scroll progress reverses the actual source `introAnimation` clip from its 3.29-second end pose toward its 0.75-second focused keyboard pose, with a small model yaw, pitch and downward movement. This is a new scroll mapping authored for this portfolio, not the inspiration’s full GSAP sequence. Demand rendering updates in response to pointer movement or changed scroll progress; an intersection observer and page visibility state disable offscreen/hidden rendering. Reduced-motion preferences disable pointer-driven movement, including live preference changes. Pagehide aborts a pending mount and model fetch promptly, unmounts an active scene, stops the pose mixer and disposes its owned geometries, materials, texture maps, skeletons and image bitmaps. A model finishing parse after unmount is also disposed. Pageshow automatically remounts after BFCache restoration. Without JavaScript or when WebGL/model initialization fails, the poster stays visible.

The explanatory story remains HTML. Canvas is decorative and does not hide controls, project links, or information unavailable to keyboard users. A startup error boundary/time limit restores the static experience when WebGL cannot initialize.

## Why native scrolling

Native scroll connects the sections without a loading gate. Visitors can use normal browser search, anchors, keyboard navigation and touch scrolling. Images reserve dimensions to limit layout shift. All primary content is present before media interactions.

## Why no backend

There is no authentication, private inbox, CMS or account feature. Local typed content and `mailto:` contact meet the initial requirements. Supabase would add operational complexity without solving a current need. If a real form is added, it requires a trusted endpoint, validation, spam controls and explicit data retention; client-side validation is insufficient.

## Media and evidence

Illustrations are original concept art, not captured interfaces. Project summaries are owner-supplied/CV-grounded. Conceptual sequences are not certified infrastructure diagrams. See `CONTENT-PROVENANCE.md`. Replace artwork with approved real captures as evidence becomes available.

## Accessibility and performance verification

Playwright exercises desktop/mobile layouts, navigation, routes, no-JS and reduced-motion behavior, automatic 3D teardown and fallback, and axe WCAG A/AA automated checks. Automated accessibility checks are useful but do not certify complete accessibility. Manual screen-reader, actual-device and bandwidth testing remain valuable.

Core Web Vitals targets are LCP <=2.5s, INP <=200ms, CLS <=0.1 at the 75th percentile when field data exists. Local test results are not production field measurements or a universal FPS guarantee.

## Deliberate omissions

No analytics/tracking, invented testimonials, skill percentages, fabricated metrics, unapproved reference assets, cloud-expert positioning, empty blog, speculative chatbot, or browser secrets. GitHub history records actual work; CI records checks rather than simulated activity.

## Event story gallery

FieldNotes renders every story and photograph in static HTML. A native horizontal scroll track supplies swiping without JavaScript; optional next/previous, numbered jump controls and keyboard arrows/Home/End synchronize the selected story. Context/date/place/role remain inline. Native details reveal additional context and supporting photo/press artifacts. Reduced motion removes smooth transitions; native vertical page scrolling remains usable. Gallery listener/observer resources suspend on pagehide and reattach on BFCache pageshow. Captions and event provenance stay centralized in src/data/moments.ts.
## Interactive workflow refinement

The owner requested circular or animated alternatives to the five stacked workflow boxes. Every case now uses a native HTML circular stage selector with five directly labeled controls and one selected explanation. The visual is a schematic numbered sequence; circular placement does not assert that every workflow is cyclic. Selection is linked by `#system-stage-N`, keyboard controls support arrows/Home/End, live text announces selected content, and reduced motion removes the short reveal. Without site JavaScript, all five ordered descriptions remain readable. No generated artwork replaces the actual explanatory text and no external visualization service is required.

## Desktop character journey

On wide screens with ordinary motion preferences, the same canvas remains fixed through the hero and introduction. It moves into a reserved left column while the camera pulls back to reveal the full seated desk. The asset’s filtered typing and key1/key2/key5/key6 clips are scrubbed by native scroll, then the canvas fades and stops rendering before selected work. Mobile and reduced-motion experiences keep the model inline in the hero. This is an authored source-inspired transition; the asset has no standing or walking animation and the inspiration’s complete GSAP timeline is not reproduced.

The hero starts with an authored standing rig pose: one open hand raised in greeting and the other arm relaxed, with desk and chair hidden. Hand, palm, thumb and finger rotations are captured before applying the source animation, so typing wrist/finger bends cannot leak into the greeting. Both upper arms and forearms use explicit world directions and roll, preserving bent elbows and the sleeve silhouette. The greeting arm lowers through an outward waypoint to keep the palm clear of the face; arms approach the source pose as the desk appears at seated blend 0.58 and finish settling at 0.65, before the hips finish sitting. All adjusted bones participate in the standing snapshot; scroll restores the source animation before blending, then reveals the desk during the introduction. The source contains no standing clip; standing is a portfolio-authored bone pose. The no-JS/WebGL poster is rendered from that exact standing pose. Reduced motion holds the standing pose.

## Scene startup resilience

The startup watchdog counts only time when the scene is visible and the page is active. A model finishing offscreen keeps the poster and resumes a demand frame when the visitor returns, rather than timing out an otherwise valid model. A lost WebGL context after initialization restores the static poster and disposes the scene. Regression tests cover both cases. Local throttled measurements remain local evidence, not production Core Web Vitals or a universal performance guarantee.

Desktop intro height is reserved before model readiness to prevent asynchronous layout shifts. Decorative canvas descendants never receive pointer activation; a window listener supplies pointer movement for the visual response. This prevents a late canvas frame from intercepting a native link or disclosure click. Tests complete model loading between pointer down and pointer up, verify unchanged layout, and require successful first-click activation.
