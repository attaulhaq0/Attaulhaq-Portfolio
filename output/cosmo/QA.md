# Cosmo Conqueror media QA

Reviewed October 11, 2026, against the owner-supplied local recordings. The website includes a 72-second silent gameplay showcase, three real screenshot captures, and separate focused demonstrations of the Spirit encounter, Iggy/Scorch combat and projectile feedback. Source originals remain on F:; only selected optimized exports are public.

## Selection and attribution

The primary showcase uses mission traversal and distinct combat encounters. The projectile demonstration is a separate graybox development test with visible hit/health feedback and internal diagnostic text. It is not described as final environment gameplay or proof of a specific AI/pathfinding algorithm. Individual characters and environments belong to the wider game; the page does not claim exclusive asset authorship or released production status.

The review excluded `FYP.mp4` from Cosmo because its SHA-256 exactly matches the Digital Dynasty source already published under that separate project. `library.mkv` depicts an immersive library environment and remains excluded from Cosmo. `Main Menu.mp4` retains a placeholder “GAME LOGO HERE” and has repeated timestamp warnings; it was not selected. The short cover/strafe clip has a recording toast, persistent texture-streaming warnings and insufficient evidence to certify the named cover behavior; it was not selected.

Detailed source metadata, streaming hashes, 12-frame contact sheets and interval analysis for these systems files are under `.runtime/qa/cosmo/systems/`. Projectile export metadata and exact crop/interval are in `projectiles-manifest.json`.

## Playback and accessibility

- `tests/cosmo.spec.ts`: **8/8 passed** on desktop and mobile development preview. These checks exercised primary playback, all three focused clips, disclosure close-to-pause behavior, offscreen pause, BFCache cleanup/resume, and no-JavaScript controls/captions.
- Playwright rendered validation at 1440×1000, 390×844 and 320×700 found no document horizontal overflow or runtime errors.
- Axe WCAG A/AA checks found zero violations with all three focused disclosures expanded.
- Initial requests contained no Cosmo MP4 fetches. Opening the focused disclosures leaves the videos paused with `readyState=0` and `preload="none"`; playback occurs only through explicit interaction.
- Primary playback returned 72 seconds at 1280×720. The separate projectile export returned valid `206` range responses and `video/mp4`.
- Native controls, aspect ratios and captions remained readable on narrow screens. Project stills identify actual gameplay; the projectile caption identifies the graybox test and retained diagnostics.

No browser plugin was listed in the current session, so the existing Playwright workflow was used. Visual evidence is stored outside the repository at `G:/Portfolio Website/.review/cosmo/`, with `case-hero-*`, `primary-*` and `focused-*` screenshots for the three tested widths. Automated checks do not replace complete screen-reader or real-device testing.
Final integration verification: Astro check zero errors/warnings/hints, static build seven pages completed, full Playwright desktop/mobile suite52/52passed. Final72secondshowcase decoded in full with no decoder errors, no detected black spans>=0.5seconds and no detected frozen spans>=0.5seconds. No Cosmo MP4 fetches before interaction; focused clips pauseonclose/offscreen/hidden and BFCache cleanup verified. Site files remain onG, rawsource collection remainsF. This is a sampled source review and full selected-output verification, not an exhaustive audit of every raw-frame or engine performance benchmark.
