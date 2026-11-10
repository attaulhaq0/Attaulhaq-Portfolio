# Sculptural toolkit and velvet ambience

Original decorative raster artwork made on October 12, 2026 for the owner's selected velvet-violet portfolio direction. The three sculptures represent the existing toolkit groups without adding tool, brand, employment, release or expertise claims. All meaningful toolkit content remains native HTML.

The owner-authorized Microsoft Foundry `gpt-image-2.5-sunburst` deployment was invoked through the unmodified bundled `image_gen.py` CLI at quality `high`. Each icon is a separate 1024×1024 request using the earlier original toolkit ecosystem solely as a style reference. The empty ambient background is a separate 1536×1024 generation request. No source avatar, personal photograph, inspiration-site asset, vendor logo or product interface was supplied or incorporated.

Private generated originals and review composites remain at `G:/Portfolio Website/.review/theme-implementation/`. Only the reviewed WebP exports live under `public/images/toolkit/` and `public/images/theme/`. The adjacent source inspiration project stays read-only.

Icon processing uses the cached `rembg` `u2netp` model on G:, removes the generated flat black background, defringes black contamination at soft alpha edges, and exports each sculpture into a common 192×192 canvas with a 128×128 sibling. The maximum sculpture extent is 88% of the canvas, intended for a 64–72 CSS-pixel display. WebP exports retain genuine alpha. The ambient image is cropped to 1440×900 and smoothly feathered at the edges so the CSS plum foundation can blend underneath.

The exact prompts are the four `*-prompt.txt` files beside this document. `process_assets.py` only transforms existing rasters; API generation remains with the unchanged bundled CLI. `manifest.json` records original and export dimensions, sizes, SHA-256 values and alpha statistics. This is original conceptual art, not implementation evidence or licensed vendor branding.

### November 10, 2026 — enclosed background and cyan edges

`refine_black_matte.py` processes an explicit allowlist of eleven existing black-studio cutouts: five homepage illustrations, five workflow tiles and the toolkit ecosystem. The earlier segmentation filled some enclosed gaps with opaque studio pixels and retained a dark matte around cyan glow. The refinement estimates the original corner backdrop, caps coverage inside those gaps and restores straight color at cyan silhouette edges. Lossless RGBA WebP prevents another lossy color fringe; dimensions and public paths stay stable.

Run `python output/toolkit-mini/refine_black_matte.py --destination <private-review-directory>` to inspect candidates before applying. Its manifest records the old and new hashes and a decoded alpha check. Restore the recorded previous cutouts before rerunning: applying the matting operation repeatedly would erode alpha. Original source art, white-studio case covers, toolkit symbols, photographs, documentary captures, native media and the 3D character are preserved. Compare the cutouts on white, lavender and plum backgrounds at natural and rendered sizes.
