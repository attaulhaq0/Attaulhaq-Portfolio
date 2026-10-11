# Hostinger deployment

The current site is a static build. WebGL runs in the visitor's browser; you do not need a VPS just for the hero. Exact hPanel labels and server capabilities depend on the purchased plan. No Hostinger account/server has been changed by this project.

## Build

Use Node.js 24 LTS (minimum 22.12). On your computer or CI:

```sh
npm ci
npm run check
npm run build
npm run preview
```

Production files are in **`dist/`**. Do not upload `node_modules`, source, `.env`, test reports, `.git` or the restricted inspiration project.

For confirmed domain metadata, set `PUBLIC_SITE_URL=https://your-actual-domain` in the build environment or an uncommitted `.env`. Rebuild after changing it. Without a configured domain, canonical/absolute social URL metadata and sitemap entries are intentionally omitted rather than guessed. Use a PNG/JPEG social card for social platforms that do not support SVG cards.

## File Manager / FTP upload

1. Confirm the domain's document root in hPanel; it is commonly `public_html`, but verify rather than assuming.
2. Back up any existing website and configuration. Do not delete another site's files blindly.
3. Upload the **contents** of `dist/` to the selected document root, preserving directory structure (`_astro`, `images`, `work`, etc.).
4. Enable HTTPS through the hosting controls. Verify HTTP-to-HTTPS redirect and your preferred hostname.
5. Open the homepage, all five `/work/<slug>/` routes and an invalid URL directly. Test media and the optional 3D view.
6. Check mobile navigation and a hard refresh of a case-study page. Review browser console/network errors.

The output has physical per-project `index.html` files; it is NOT a client-side SPA and does not need a catch-all rewrite to the homepage. Configure a 404 handler pointing to `/404.html` only if your web server/plan supports it; verify the HTTP status remains 404.

A Git-connected deployment is also possible if the plan supports an appropriate build command and publishing directory. Do not assume a connected repository automatically builds Astro. The GitHub Actions workflow creates a downloadable `hostinger-static-site` artifact after successful checks; manual upload is available without storing FTP credentials in GitHub.

## Caching and delivery

Use long-lived immutable caching for hashed `_astro/` files. For HTML and stable-named images, use revalidation or shorter caching so edits appear. Enable Brotli/gzip through the provider where supported. Do not apply immutable year-long caching to every filename indiscriminately.

The initial artwork is lightweight SVG. Keep video masters out of Git and avoid making page load depend on large clips. A dedicated video host may be preferable for long recordings or adaptive streaming.

## Rollback

Retain the previous known-good build or regenerate it from its Git commit. Restore the complete build consistently; mixing old HTML and new assets can break references. Never roll back by force-pushing fabricated Git history.

## Before public launch

- Verify actual Hostinger plan/domain and document root.
- Confirm all public copy, project scope and media rights.
- Set canonical domain, create PNG social preview, review metadata and sitemap.
- Add real CV/LinkedIn only when approved; no placeholder links.
- Check HTTPS, caching, direct routes and 404 behavior on the actual host.
- Re-measure performance on the deployed site; localhost is not hosting performance.
