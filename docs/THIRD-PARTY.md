# Third-party notices and visual provenance

## Original work

All SVG project illustrations and the retained procedural hero compositions were authored for this portfolio. They are conceptual art, not evidence of live interfaces/gameplay. The current hero avatar is the separately permitted third-party model described below. Portfolio text is based on the owner's supplied professional information and reviewed editorial framing.

The portfolio was developed with AI assistance. Original code/artwork is currently all rights reserved; public repository visibility does not grant a general reuse license. Any later open-source license should explicitly address personal content and media separately.

## Dependencies

Astro, React, React DOM, React Three Fiber, Three.js, TypeScript, Playwright and supporting packages retain their published licenses. The exact resolved versions are recorded in `package-lock.json`; package distribution license files are available in each installed dependency. They are not relicensed by this project.

Manrope and Source Sans 3 are self-hosted through Fontsource distributions and provided under their respective SIL Open Font License terms. Retain the font licenses supplied with these packages when redistributing fonts independently.

## External projects

E Deviser, Subrickzz, Digital Dynasty and other project names identify the owner's work/context. Inclusion is not a claim that all underlying company/game assets are owned by the portfolio author or licensed for redistribution. Use approved media and preserve relevant credits when replacing concept art.

## October 2026 portrait and media

The earlier portrait poster and four featured conceptual renders were generated through the owner’s configured Microsoft Foundry Sunburst deployment. The owner supplied the face photograph and selected event images. Generated art is labeled as illustration and does not represent product screenshots. The retained personal model is independently authored geometry with the owner’s face photograph as a curved surface texture. See CONTENT-PROVENANCE.md and the generation manifests for exact sources.

## Owner-confirmed permission for the active source avatar

The active hero uses the original avatar by [Moncy Yohannan](https://www.moncy.dev/), from the owner-supplied local inspiration project `G:/Portfolio Website/Portfolio-Website-main`. The original project's Personal Portfolio License v1.0 expressly excludes its 3D assets from general reuse. On October 11, 2026, the portfolio owner explicitly answered “yes” when asked whether the original designer had given permission to reuse this avatar in this portfolio. This is an owner-confirmed permission record; it does not relicense the model for other users or other projects.

`public/models/source-character.glb` was recovered from that local project's `public/models/character.enc` with the supplied project's existing public runtime loader format. Its 1,537,316 bytes match the source's Git LFS manifest SHA-256 `c287a4d10bbbbc4c779f7b0a68b666b530ef9754142843aa048b4d5976c0d052`. The source pointer itself contains no model geometry. No model was downloaded from an external source.

`public/images/source-character-poster.webp` is rendered directly from that model by `scripts/render-source-character.mjs`, using the same authored standing rig pose, camera and lighting as the automatic runtime scene. The foreground monitor is hidden for the portfolio portrait composition. The avatar has no owner photograph texture and is a decorative character rather than a claim of the owner's likeness. The earlier original studio/personal models remain separate retained assets. The inspiration's HDR environment, trial plugins, page design and animation orchestration are not included. The new scene integration is authored for this static-first portfolio.

The owner subsequently requested removal of the visible “Avatar by Moncy Yohannan” footer link on October 12, 2026. The visible link is removed; this maintenance record preserves the original creator and source-specific permission history. The active model remains that previously permitted asset while the owner-supplied personal mesh is being inspected. No new model license or claim of personal likeness is implied. Exact bundled Manrope and Source Sans 3 SIL Open Font License notices remain under `public/licenses/`.

## October 2026 Sora work concepts

The owner explicitly requested Sora 2 clips for the case pages. Two four-second, 1280×720 videos were generated through the already authorized Microsoft Foundry deployment, with no person uploads. `aegis-voice-concept.mp4` animates the original microphone, waveform and retrieval-node sculpture. `family-approval-concept.mp4` animates light between the original connected glass homes. They are labeled as AI-generated concept animations, not actual product interfaces, deployed architecture or recorded product behavior.

The input references are resized crops of the portfolio's earlier original `aegisops-render.webp` and `family-os-render.webp` concept covers. Sora generation kept the sculptures stable while animating light. Public exports receive a gentle violet color grade, have their audio removed and use H.264 with faststart. Posters are actual frames at 1.5 seconds. `scripts/process-sora-work-concepts.mjs` performs the export and full-decode validation; the prompt, reviewed request, completed job, reference and processing records are in `output/sora/`. The Family OS output does not include an explicit approval ring, so its caption describes household coordination rather than claiming that an approval step is visible.
