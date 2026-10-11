# Content provenance

## Source and scope

The project summaries in `src/data/projects.ts` are based on the portfolio owner’s supplied CV. They present the owner’s described roles, contributions and project scope in concise public-facing language. They are not an independent technical audit or an assertion of sole authorship.

Live product status, deployment details, release status and outcomes have not been independently verified. The summaries do not claim adoption, revenue, performance improvements, production readiness or security certification.

## Chronology and attribution

| Project | CV-based chronology | Attribution |
| --- | --- | --- |
| E Deviser | October 2025–present (updated supplied CV) | Chief Product Officer & AI Product Engineer; company post separately identifies Co-Founder & CPO |
| AegisOps | January 2026–present | Product and system-design work; the role label describes the work rather than a formal title |
| Family OS | January 2026–present | Founding Product Architect & Core Engineer |
| Cosmo Conqueror | January 2024–January 2025 (owner and experience certificate) | Game Developer at Subrickzz |
| Digital Dynasty | 2023–2024, confirmed by final report context | Co-developed with Hassan Bashir at COMSATS University Islamabad, Wah Campus |

“Present” reflects the supplied CV, not an independently monitored employment or project status. The owner subsequently confirmed the university project’s name as Digital Dynasty and supplied its public source repository. Its internal portfolio slug remains `survival-game`. Project-level features are not automatically attributed to the owner as sole implementer.

The 33 story-driven missions associated with Cosmo Conqueror are described as **designed**, not shipped. On October 11, 2026 the owner explicitly confirmed Digital Dynasty was award-winning; public copy uses that broad claim without inventing an award title, issuer or ranking. Family OS model references retain the prior CV’s DeepSeek-V3 and DeepSeek-R1 names and describe the supplied design, not verified current production usage.

## Visuals and system explanations

E Deviser, AegisOps, Family OS and Cosmo Conqueror use original conceptual Sunburst renders, labeled as illustrations. Digital Dynasty now uses an actual frame from the owner-supplied prototype recording; its media label identifies gameplay/editor demonstration. Historical SVG concept covers are retained separately.

The `system` sequences are conceptual summaries of workflows or gameplay relationships. They simplify the described subject and do not reproduce exact deployed architecture, proprietary source graphs or implementation order. Each project includes a scope note explaining the distinction.

The `designConsiderations` entries are reasoned considerations arising from each project’s subject. They are not claims that a particular tradeoff was evaluated, a specific decision was implemented or an outcome was measured.

No unverified video or demonstration asset is represented through the optional `media` field.

## External references

The included direct links are the CV-supplied websites and the subsequently owner-confirmed source repository:

- [E Deviser](https://edeviser.com/)
- [Subrickzz](https://subrickzz.com/)
- [Digital Dynasty source repository](https://github.com/attaulhaq0/DigitalDynasty)

These links provide context, not independent verification of the portfolio’s claims. Unverified shortened links are omitted.

## Updating with evidence

To make a summary more specific, confirm the relevant statement with the owner and an appropriate publishable source: an approved product artifact, dated release note, public project page, attributable contribution record or documented measurement. Record the source, its date and the exact claim it supports in this document. Distinguish personal contribution from team scope, design from implementation, and implementation from release.

For outcomes, include the measurement definition, period and supporting source rather than adding an unsupported number. Update “present” dates and formal roles when their status changes. Add award details only when the award name, organizer, year and connection to the project can be substantiated.

Replace or supplement conceptual artwork only with assets cleared for publication. Label screenshots, prototypes, concept art and gameplay footage accurately; include necessary credits and useful alternative text. For video, supply a genuine source and poster, with captions or a transcript where appropriate. Remove private student, household, operational or employer information before publication.

Private planning notes and personal deliberations are not sources of public biography or project claims and are not reproduced here.

## Owner-approved personal photographs and immersive footage

The owner requested real personal and event photographs from the E Deviser website conversation for the portfolio redesign, and explicitly chose the QSTP photograph and the café group photograph. The October 2026 redesign uses these publication exports:

| Public export | Approved local source | Supported description |
| --- | --- | --- |
| `public/images/portrait-qstp.webp` | `G:/LinkedIn-Posts/2026-10-09/Lightly_Edited_New_Photos/IMG_3861.jpg` | Atta-ul-Haq beside an E Deviser display at Qatar Science & Technology Park. No keynote, endorsement, or formal speaking engagement is inferred. |
| `public/images/google-cloud.webp` | `G:/LinkedIn-Posts/2026-10-09/Google_Cloud_Options/Option_B_Closer_Co_Innovation_Portrait.jpg` | Personal photograph at the Google Cloud Summit Co-Innovation Stage display. No stage appearance, professional certification, or Google endorsement is inferred. |
| `public/images/community.webp` | `G:/LinkedIn-Posts/2026-10-09/Lightly_Edited_New_Photos/IMG_3692.jpg` | Owner-selected café group photo, captioned “Coffee & community.” The other people are not named and no professional relationship is asserted. |
| `public/images/atta-headshot.webp` | `F:/Attaulhaq Documents Scanned/Pictures/2.jpg.jpeg` | Owner-supplied face reference for a stylized personal 3D figure. A single photograph does not supply a scanned, rigged, or photorealistic personal model. |
| `public/images/edeviser-classroom.webp` | `G:/E Deviser Website/public/review/media/classroom-poster.webp` | Poster from the supplied immersive classroom development footage. |
| `public/media/immersive-classroom.mp4` | `G:/E Deviser Website/public/review/media/classroom-walkthrough-720p.mp4` | Approximately 28 seconds of silent classroom development footage. The owner confirmed that immersive education is a separate E Deviser initiative in development, distinct from Cuevo and from the AI platform project summary. |

Photographs were exported as resized WebP images with EXIF orientation applied and metadata omitted. The source photographs and raw video masters are not copied into the repository. The small, existing optimized MP4 is copied without a second video encode. The classroom player has native controls, does not autoplay, and identifies the footage as silent. Its caption and descriptive context remain available as static HTML.
## October 11, 2026 spatial redesign

The owner requested the dark, centered figurative direction and provided a frontal face photograph for an original avatar. The homepage now uses `avatar-poster-feathered.webp`, generated through the owner's configured Microsoft Foundry `gpt-image-2.5-sunburst` deployment with the supplied face and QSTP attire references. The image is a portrait illustration, not a capture of a 3D mesh. The separately authored `PersonalAvatar.tsx` provides a genuine 3D seated figure with a curved photographic face texture, sculpted head/hair/beard, clothing, hands, chair and workstation. The result is a stylized photo-informed study, not a photogrammetry scan or an anatomically exact reconstruction. A reusable GLB export lives at `public/models/atta-avatar.glb`; regenerate with `node scripts/export-avatar.mjs`.

The four featured covers are new Microsoft Foundry Sunburst conceptual renders at `/images/{edeviser,aegisops,family-os,cosmo-conqueror}-render.webp`. They are not product screenshots or gameplay evidence. Their prompts and hashes live in `output/imagegen/project-covers/manifest.json`. The Digital Dynasty cover remains the original conceptual SVG.

The configured Sora 2 deployment accepted one portrait-animation job but failed its upload checks with `moderation_blocked`, citing `people-in-user-uploads`. No Sora video was produced or represented as completed. The exact nonsecret response is preserved in `output/sora/avatar-manifest.json`. The website uses its real silent classroom walkthrough and interactive 3D instead.
The subsequent, separate Sora 2 book-sculpture job completed successfully with no people in its reference input. `public/media/education-concept.mp4` is a 3.7-second, 1080×720 silent H.264 conceptual animation. It preserves the original glass-book sculpture and is labeled as concept animation; it is not education-product footage. `output/sora/education-concept-job.json` and the processing manifest record the completed job and source hashes.

## October 11, 2026 — expanded personal field notes

The owner requested a fuller slideable account of the real connections around the work, including the Bahria events. `src/data/moments.ts` now contains 12 distinct stories, with brief context, date precision, location, bounded role descriptions and up to three supporting photographs or press artifacts. The exported media are in `public/images/moments/`. `output/moments/media-manifest.json` records each exact source, source/output SHA-256, dimensions, crop when applicable, and processing. The originals remain untouched.

Sources read for this gallery were the owner-supplied CV context retained in `G:/Portfolio Website/discovery/04-case-study-drafts-and-media-brief.md`; the E Deviser website chat `01a0f9af-75d2-7051-ba86-1c03244121c4`, especially its supplied ecosystem PDF and October 2 source inventory; and the personal highlights chat `01a111e4-c91f-7ce0-84f7-a4cd845b710c`. The latter's supplied photographs and confirmed selections were already exported to `G:/LinkedIn-Posts/2026-10-09/`. Local plans are editorial records, not independent evidence of private personal reflections or completed product outcomes.

| Story | Source and factual scope |
| --- | --- |
| Cuevo at QSTP | Existing owner-selected IMG_3861 portrait plus `Selected_Post_Photos/Post_1_QSTP_and_CUEVO/01_CUEVO_Team.jpg`. The owner confirmed incubation and that the team photo shows him and his teammate with Cuevo at QSTP. His general company role is Co-Founder & Chief Product Officer; the photographs do not establish a keynote or formal speaking role. |
| Google Cloud Summit Doha | Owner-selected Co-Innovation Stage portrait, own keynote/exhibition pictures and the additional venue photograph expressly supplied for this summit. Local event plan identifies September 22, 2026 at QNCC; public copy uses September 2026. The stage portrait records attendance. No Google partnership, customer relationship, certification, or speaker status is claimed. |
| Coffee & Community | The owner explicitly confirmed IMG_3692 as Startup Grind Doha's Coffee & Community in highlights turn `01a1211f-2bbc-7ba2-b6d8-0e58ba0109ca`. Other people are not identified by appearance. |
| AI × Future Summit 2025 | Owner-supplied E Deviser Ecosystem Key Moments PDF pages 3 and 7 support a completed summit at Bahria University, Islamabad, with Barrister Daniyal Chaudhry as chief guest. The upper group photo on page 2 supplies an additional associated summit moment. The CV supports the owner's strategic planning and stakeholder engagement around the summit; it does not establish him as a keynote speaker or sole organizer. |
| EdTech Future Forum 2025 | The same PDF pages 2 lower photograph, 4, 6 and 17 document the separate NICAT, Rawalpindi forum, E Deviser/Roze News collaboration, panel, group, press report and participant certificates. The event role describes company collaboration, not a personal panelist role. The certificate is presented to a participant and is not an award won by the owner. |
| QSTP SPRINT F26 Summit | The owner supplied the group and panel images with QSTP's recap in turn `01a11205-454d-7241-909e-03a993e9a071`. QSTP's official event listing identifies October 1, 2026. The photographed session is “From Opportunity to Scale: Building Companies that Last,” with Mohammed Al-Delaimi and moderator Majed Lababidi. Public date uses October 2026; attendance is distinguished from graduating/completing the SPRINT cohort. |
| QSTP × YEC Summer Bootcamp closing | The owner clarified the earlier late-August closing in turn `01a111ff-ab98-7ad0-bf43-203bd8bb951a`, consistent with the August 23 photograph. The Ministry of Sports and Youth announcement supports the program's training topics and final hackathon. The gallery records closing-gathering attendance, without claiming program completion, competition placement, sponsorship or an award. |
| Paklaunch Doha Meetup | Owner-supplied photograph, event invitation and Startup Grind/Paklaunch recap in the highlights chat. Location Nestwork M7, Msheireb; September 3, 2026 in the source plan, rendered as September 2026. Cross-border community context describes the gathering, not a resulting investment or partnership. |
| EO Qatar learning event | Owner-supplied photograph and invitation to “10x Your Business: Breaking Through the Next Stage of Growth” with Antony Enright. Source invitation gives Qatar Chamber, Lusail and September 16, 2026; public date uses September 2026. Attendance does not establish EO membership. |
| Qatar Event Show 2026 | Owner-supplied visit photograph with “01–03 SEP. 2026 DECC” visible on the display; DECC's official listing supports those dates. The gallery describes an exhibition visit, without interpreting the podium photograph as a speaking engagement. |
| September MCIT AI workshop | Owner-supplied `05_Separate_MCIT_AI_Workshop.jpg`. The presentation reads “AI for internal business improvements,” including content creation, research and information analysis. The photographed sign refers to practical sessions from idea to launch. Exact session date/title is not conclusively established; the gallery uses a September MCIT workshop label, distinct from Google Cloud Summit, the September 30 Scale Now panel and the October 7 workshop invitation. |
| MCIT Scale Now government-opportunities panel | The owner explicitly stated attendance and supplied the invitation to “Unlocking Government Opportunities for Scale-Ups” in turn `01a111f0-e10d-78c2-8405-db36cff3063f`. September 30, 2026, Mandarin Oriental in Msheireb; IMG_4091 is the clear photograph. Public date uses September 2026, with procurement readiness/enterprise context and attendee role. |

The Bahria date remains **2025** in the gallery: the supplied CV lists December 18, 2025, while the press report says Wednesday and December 18 fell on Thursday. An exact day/month is therefore not represented as reconciled evidence. The chief guest's title is also inconsistent between the source caption and newspaper report, so only his name and chief-guest role are used.

The related AI × Future Summit series is included as supporting context and its attributed announcement image within the Bahria story. The announcement planned a first edition at Bahria's H-11 campus and subsequent university editions; it does not prove all future editions occurred. No separate completed “Innovation X” event was found in the supplied scoped records and none is invented. The owner's earlier AI Tinkerers attendance is acknowledged by the source conversation, but there is no confidently matched photograph/date/round for an additional gallery card; the October 19 invitation is not treated as past attendance.

The gallery honors the previous exclusions of QIYADA and the rear-view QSTP room photograph IMG_4065. QSTP SPRINT organizer photos retain their event context. Photographs and press artifacts are owner-supplied and used within the current request; institutions/logos in them do not imply endorsements. The editorial sentences avoid fabricated personal failures, outcomes, friendships or quotations. No private contacts, raw source PDF, camera metadata, CV PDF, employer internals or unrelated planning notes are published.

## October 11, 2026 — Digital Dynasty project report

The owner supplied `F:/Digital Dynasty/Digital Dynasty Report (1).pdf` and authorized the use of its documentation alongside gameplay footage. The report SHA-256 is `47211ffe77eb017e87bedc9f837ff00069f24d4451bbb1b38596030aeabcb451`. Its 60 physical pages were extracted locally with pypdf, and representative interface/architecture pages were rendered and visually inspected with Poppler. Page references below use physical PDF page numbers; the numbered report body begins at PDF page 12. Student identifiers and contact information are omitted from review extracts and public content. The raw PDF is not published.

The title and project brief on pages 1, 2 and 6 confirm **Digital Dynasty**, undertaken by **Sheikh Atta-ul-Haq and Hassan Bashir** at **COMSATS University Islamabad, Wah Campus, Pakistan**, within the 2020–2024 academic session. Page 6 records an October 2023 start. Its May 2023 completion field is chronologically inconsistent; dated manual tests on pages 47–52 run from November 2023 to April 2024. Public copy can therefore use **2023–2024 university project** without asserting an exact completion day or month. The portfolio slug stays `survival-game`.

Pages 6 and 44 document Unreal Engine 5 and Blueprint scripting, Blender, Adobe Photoshop/Illustrator, Visual Studio/JetBrains Rider and Git/GitHub. IDE use alone does not establish a C++ implementation claim. Epic Games Marketplace is listed among project tools, so artwork and models are not collectively described as wholly authored by the two students.

The abstract and introduction (pages 7, 12 and 18) describe the survival/adventure loop of exploration, gathering, crafting, structures, AI/combat, progression and cooperative/community play. Twelve manual test cases on pages 47–52 are marked **Pass** in the supplied report. The report credits Attaulhaq as verifier for player movement and collision (page 47), basic crafting/resource consumption and structure placement under terrain/collision rules (page 51), leveling and save/load restoring state (page 52). This supports a specific contribution to **gameplay validation**, without assigning sole implementation of those systems. Hassan is listed as verifier for gathering, tools, HUD, combat, inventory and enemy-AI cases on pages 48–50. These are historical report results; the portfolio does not imply that executable tests were newly rerun or that these manual checks establish release readiness.

The report supplies interface captures for spawn/map selection (pages 25 and 56), inventory/equipment/XP/skill points/health/food/water/stamina (pages 25 and 57), crafting requirements (pages 27 and 58), tribe membership (pages 27 and 59), and session finding (pages 28 and 56). Chapter 2 introduces expected interfaces/mockups, and the same captures are repeated in the operating manual. They are labeled as **interface captures from the project report**, while separately supplied gameplay footage can substantiate the actions actually observed. A session or tribe interface does not by itself establish dedicated-server deployment, large multiplayer scale or functioning proximity voice.

Pages 34–38 contain composite, logical, information, interaction and state models. These support a simplified explanation of world resources, inventory, recipe checks, crafting, construction, progression and saved state. They are documented design models, not an exact Blueprint graph or verified deployed database/network schema. The composite diagram also includes CMS and analytics concepts without corresponding implementation evidence; those are not added as delivered backend capabilities.

The functional-requirements chapter (pages 20–22) and future-work section (page 44) must remain distinct from demonstrated behavior. In particular, larger clan battles, cooperative quests/player events, modding, VR and cross-platform support are listed as future extensions. The report's 60 FPS, sub-five-second loading/saving and low-latency statements on pages 30–31 are performance targets, not measured outcomes. The report describes three procedural biomes, Level Streaming, Niagara, Control Rig and MetaSounds but does not supply benchmark/algorithm evidence for each technique. The 50+ structures claim has no asset inventory and is omitted from lead copy. No award details, commercial release, adoption count, anti-cheat effectiveness or security certification are established.

Editorial inconsistencies naming a different “Mad Max Runner” project on pages 41 and 54, including Android wording, are excluded from Digital Dynasty's platform description. The project brief supports a Windows/PC project. No personal IDs, supervisor contacts, unreviewed raw report pages or unrelated template claims are published. The detailed local evidence review, sanitized full text and extracted-image manifest remain under `.runtime/qa/digital-dynasty-report/` for review.
## October 11, 2026 — current hero refinement

The owner subsequently requested a generic stylized character in place of the personal portrait, an intact Atta-ul-Haq name, a plain-name header and the supplied LinkedIn profile. The current hero now uses the independently authored `StudioCharacter.tsx` and its mesh-rendered transparent `studio-character-poster.webp`. Its GLB export is `public/models/studio-character.glb`. It contains no photographic face texture, owner likeness, Moncy source code or proprietary reference assets. The earlier personal model, generated portrait and related records remain retained for the owner; they are no longer the hero visual.

The supplied reference's Personal Portfolio License explicitly excludes its 3D avatar/assets from reuse. The current website is an independent Astro implementation in `Attaulhaq-Portfolio`; `Portfolio-Website-main` remains separate study/reference source. Public LinkedIn is the owner-provided `https://www.linkedin.com/in/sheikh-atta-ul-haq-7a7527241/`, with the incidental self-profile query removed.

## Digital Dynasty media integration

The homepage’s Digital Dynasty spotlight now uses an actual prototype riverbank frame and links to the existing `/work/survival-game/` route. The case study includes a 60-second silent edited showcase and three real captures: exploration, inventory and structure placement. The source is `F:/Digital Dynasty/.mp4` (162 seconds, 1920×1080, source audio present). The excerpt is re-ordered for a compact narrative, retains original editor UI/debug overlays and removes audio; it is labeled accordingly. No full presentation title card or student identifiers appear in the selected excerpt. Exact source/output hashes, intervals, stream encoding and screenshot timestamps are recorded in `output/digital-dynasty/media-manifest.json`. Original sources remain on F:.
## Personal voice and scheduling

The owner clarified that “Learning can be a place” is his own immersive education work at E Deviser and requested first-person portfolio language. The public description and video caption now identify his work and keep the experience’s in-development status.

The owner requested his Calendly meeting link from the E Deviser website. `G:/E Deviser Website/src/data/site-links.ts` supplies `https://calendly.com/attaulhaqsheikh/cuevo-demo`; `src/data/cuevo-faq.ts` explicitly identifies the host as Sheikh Atta Ul Haq, Co-Founder & Chief Product Officer, and the booking as a 30-minute Google Meet. The portfolio uses that existing event link for “Book a meeting” actions. It does not create a new scheduling event or rename the Cuevo Demo event in Calendly.
## Employer-focused personal presentation

The owner asked the public copy to use COMSATS University Islamabad without the campus detail, and to focus the Digital Dynasty introduction and wider portfolio on his work and capabilities. Public source content now describes his game development and documented gameplay validation, omits the collaborator’s name from presentation text, and retains original team attribution in this provenance record. This is an editorial focus change, not a change to historical authorship. Capability and biography text emphasizes Unreal Engine/Blueprint gameplay, AI/RAG product workflows, system design, prototyping and validation using the existing evidence. No new expertise, sole-authorship claim, seniority, business outcome or release status is introduced.
## October 11, 2026 — Cosmo Conqueror supplied recordings

The owner supplied 13 clips from `F:/Cosmo_Portfolio` and identified them as recordings of his work. A sampled visual/technical review selected five source sequences for a 72-second silent showcase and three focused demonstrations: Spirit boss, Iggy/Scorch miniboss and a graybox projectile test. The exact source/output hashes, selected intervals, crops and full-output decoder checks are saved in `output/cosmo/`. `selection-review.md` records the decision for all 13 files.

The cover and gallery now use actual gameplay frames rather than the previous conceptual monolith illustration. The footage demonstrates development behavior and complements the owner's existing CV-grounded contribution statements. It does not independently identify each underlying component's author, prove release status, establish performance benchmarks or transfer ownership of the wider game's art assets. Public captions focus on the owner's gameplay work without implying sole authorship of every visible environment/model.

`FYP.mp4` is identical to the Digital Dynasty presentation source (SHA256 `81967616cfa805987bfc73bdc51073732c9bf0c2f1443f99ddc35aa8dec529c9`) and is not attributed to Cosmo. `library.mkv` shows an immersive library and is excluded from this game's media. The raw sources remain on F:, and no original multi-GB masters are copied into public media.

The selected public edits are silent even though the original files have audio streams. Only desktop recording chrome was cropped; gameplay HUD, in-game labels and graybox diagnostics remain. Windowed source aspect ratios are preserved using letterboxing. Source review was sampled, while each final selected output was decoded in full.
## October 11, 2026 — senior design and interaction audit

The owner requested a reference comparison, repetition audit, per-section ratings and improved event navigation. Fresh screenshots and interaction checks guided the refinements: reduced duplicated positioning/case boilerplate, distinct capability rows, shorter biography, gameplay-first ordering, project-specific case headings, preserved media aspect ratios, legible labels, compact case contact sections and independent event/photo carousels.

The owner subsequently confirmed a Qatar Event Show talk and requested meaningful personal wording. Its card now uses Speaker · E Deviser and describes a product-builder perspective. No session title, audience size or independently verified agenda is invented. It is the second story in the carousel at the owner’s request.

The owner subsequently explicitly confirmed original-designer permission for avatar reuse. The model was recovered from the supplied local runtime asset with its exact LFS SHA-256 match; `THIRD-PARTY.md` records credit and the owner-confirmed scope. The automatic `SourceCharacter.tsx` scene uses this actual model and its intro animation clip. The earlier independent character remains retained separately.

## Latest supplied CV, professional milestones and artwork

`F:/Attaulhaq Documents Scanned/Resume/Sheikh_Atta-ul-Haq_CV (1).pdf` is copied intact as `public/documents/sheikh-atta-ul-haq-cv.pdf`: 313,423 bytes, two pages, SHA-256 `8225d3fa175de48a45eec8134aee95acccd9ea0c3619fdb37a9cb1d9e561f7a5`. Current role/date and Python, JavaScript, Docker, CI/CD, agents, orchestration and retrieval skills follow this CV. General skills are not assigned to individual cases without source evidence. The verified website GitHub URL remains correct despite a malformed CV annotation.

The owner supplied the Fiverr account screenshot and historical first-five-month milestone: reached Level 2, 62+ unique clients, PKR 1M+ earned. Public wording is historical, without claiming current seller status. The private dashboard screenshot is not published. Subrickzz’s owner-supplied certificate records January 2024–January 2025, Unreal development/debugging, 3D asset integration and collaboration; its full composition is preserved in the public WebP.

Both exact owner-requested LinkedIn posts were read and their three branded document pages extracted. The post ending `7408078590912774147` records Qaiser Ahmed Sheikh’s summit address and has its own gallery story rather than replacing Daniyal Chaudhry’s identity. The post ending `7409170356218863616` records a Bahria fireside discussion; its group and panel pages are added to that story. A repeated collage is excluded to avoid duplicate photographs. The exact original Daniyal welcome photo with branding comes from the already approved Ecosystem PDF’s full page three, not those two LinkedIn posts. Media manifests and originals are preserved under the G: review directory.

Sunburst generated two original editorial illustrations from `G:/Pictures/utility.png` as a style reference; it is not copied into the page. New case artwork for E Deviser, AegisOps and Family OS uses a warm-white studio background and responsive 768/1600/3840-pixel exports. The unmodified CLI accepts only legacy sizes for the configured deployment alias; `auto` returned 1672×941. The 3840×2160 files are upscaled derivatives, not native 4K generation. Prompts, source dimensions and hashes are in `output/imagegen/case-4k/`.

Sunburst’s Cosmo and Digital Dynasty Blueprint-style images are explanatory reconstructions based on the CV/report, not original project graphs or screenshots. Text explanations remain HTML. Sora clips use concept imagery, explicit labels, silent playback and no autoplay. The Cosmo main reel now removes the approved first 20 seconds: 52 seconds remain, with the earlier 72-second edit preserved privately on G:.

The owner’s final homepage direction uses a consistent original illustration for each project, softly blended into the dark background. `homeCover` is distinct from each case’s evidence-oriented `cover`: opening Cosmo or Digital Dynasty still shows actual development captures. Native homepage players use illustrated posters and play the original approved recordings on request. The liked gameplay illustration is the Cosmo cover, so its repeated capability-section copy is removed. The CV is available in desktop/mobile navigation only; duplicate About/contact download cards and the standalone About illustration are removed at the owner’s request. The biography follows the supplied “I started by building worlds” narrative.

The separate personal Calendly event is `https://calendly.com/attaulhaqsheikh/connect-with-sheikh-atta-ul-haq`: 30 minutes, Google Meet, owner’s existing weekday availability. It was created through the authenticated owner account at the explicit request and its public description and booking availability were checked. The Cuevo event is retained separately in Calendly.

Final refinements: the owner asked to show the Fiverr photo, so a focused, lossless metrics crop is published in the Fiverr block. It preserves the original six cells without editing values; private balance and status panels remain outside the crop. Its caption is historical. The Subrickzz certificate remains separate. QSTP’s team photo is now first, and the portrait second. The approved Google Cloud pointing portrait leads an eight-image event collection; all additions retain actual photography.

The owner further removed seconds 4–12 from the 52-second Cosmo edit. The final reel is 44 seconds, H.264, 1280×720 at 30fps, silent and fully decoded; the prior edits remain privately preserved. All five cases now use shared decorative Sunburst stage sculptures. Detailed game Blueprint reconstruction maps sit in native disclosures rather than repeating the same explanation as a second full block. The stage controls and text remain the source of meaning.

On October 11, 2026, the owner requested a more interesting character pose and correction of awkward arms. The standing rig now uses an open-hand greeting and a relaxed opposite arm. Wrists, palms and fingers use the model's original pre-animation orientations instead of inheriting typing bends. An authored outward lowering waypoint keeps the greeting hand clear of the face; arms approach the source placement as the desk arrives. The fallback is regenerated from the same actual model and pose. No source model geometry, textures or claims of owner likeness changed; reduced motion holds the greeting and native scroll still restores the supplied seated animation.

The owner later explicitly requested the entire original Fiverr screenshot, including its top/profile photograph, in both portfolios. The new `fiverr-level-overview.webp` is a lossless, uncropped 1280×638 conversion of the supplied image; its source/output hashes and publication scope are recorded in `output/career/fiverr-full-manifest.json`. The original balance, Level 2 progress panel and account-status notice remain unaltered. The caption identifies a historical record and does not certify current seller status. Both variants now show achievement text and metrics to the left, complete screenshot to the right on desktop, and stack the image beneath on narrow screens. Subrickzz employment/certificate remain a separate area. Earlier metrics-only export and historical provenance entries remain retained.
