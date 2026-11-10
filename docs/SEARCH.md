# Search publication

The canonical portfolio is https://atta.edeviser.com/. Its existing sitemap is
https://atta.edeviser.com/sitemap.xml. Google Search Console and Bing Webmaster
Tools ownership verification are managed outside this repository. Preserve their
DNS records when changing hosting.

## IndexNow

IndexNow reports changed public URLs to participating search engines. It is a
publication command, not browser analytics. No visitor script, tracking cookie,
Bing account credential or private URL Submission API key is required.

First-time setup on the release workstation:

Set `PUBLIC_SITE_URL=https://atta.edeviser.com` in the process/build environment
before building. The Astro configuration reads `process.env`; an `.env` file
alone does not set this configuration value. A build without this setting omits
canonical links and sitemap entries. CI uses the confirmed domain; artifact-based
publication must use it too.

In PowerShell, set `$env:PUBLIC_SITE_URL = 'https://atta.edeviser.com'` in the same
terminal before running the build commands below.

```sh
npm run indexnow -- prepare
npm run check
npm run test:indexnow
npm run build
npm test
```

The prepare command creates `public/indexnow-key.txt`, excluded from Git. Astro
copies it into `dist/`. Upload it with the verified production artifact; keep it
when deploying later releases. This domain-verification value is served publicly
by the protocol, but is kept out of repository history and log output. Account
credentials and private service keys must never be substituted for it.

On another release workstation, recover the existing verification file from the
live `/indexnow-key.txt` endpoint into that ignored location before building.
Generating a different value is a deliberate rotation, not a normal deployment
step. A CI build without the local file does not contain the verification file;
provision it separately before promoting a CI artifact.

After production promotion, validate only the pages that changed:

```sh
npm run indexnow -- https://atta.edeviser.com/ https://atta.edeviser.com/freelance-work/
```

This is a dry run. It requires the matching live verification file, HTTP 200 HTML
pages, exact canonical URLs and no `noindex` directives. It rejects redirects,
preview hosts, query strings and fragments. To send the validated public URLs:

```sh
npm run indexnow -- https://atta.edeviser.com/ https://atta.edeviser.com/freelance-work/ --submit
```

For the initial submission of the recently published site, `--all` reads its
live sitemap. Do not repeatedly submit the whole site or run submissions on page
visits, every test/build or unpublished branch pushes. There is no automatic
retry loop. Diagnose non-200/202 responses and respect rate limits.

HTTP 200 confirms receipt. HTTP 202 means receipt with key validation pending.
Neither confirms indexing or rankings. Check the IndexNow report in Bing
Webmaster Tools after processing. IndexNow does not replace Search Console or
Google sitemap submission.

The helper handles added/updated pages. For removed pages, use the protocol's
documented removal flow; the helper intentionally refuses non-200 URLs.

Official documentation: https://www.indexnow.org/documentation and
https://www.bing.com/indexnow/getstarted.
