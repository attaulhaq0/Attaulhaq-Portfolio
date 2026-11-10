import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const origin = 'https://atta.edeviser.com';
const keyFile = new URL('../public/indexnow-key.txt', import.meta.url);
const endpoint = 'https://api.indexnow.org/indexnow';

export function sitemapUrls(xml) {
  return [...new Set([...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match => match[1].trim()))];
}

export function buildPayload(key, urls) {
  if (!/^[a-f0-9]{32}$/.test(key)) throw new Error('Invalid IndexNow verification key.');
  const urlList = [...new Set(urls)];
  if (!urlList.length || urlList.length > 10000) throw new Error('Submit between 1 and 10,000 URLs.');
  for (const value of urlList) {
    const url = new URL(value);
    if (url.origin !== origin || url.username || url.password || url.search || url.hash ||
        !url.pathname.endsWith('/') || url.href !== value) {
      throw new Error(`Only exact canonical portfolio page URLs are accepted: ${value}`);
    }
  }
  return { host: new URL(origin).host, key, keyLocation: `${origin}/indexnow-key.txt`, urlList };
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map(match => [match[1].toLowerCase(), match[2] ?? match[3] ?? match[4]]));
}

export async function notifyIndexNow(payload, { fetch: request = fetch, submit = false } = {}) {
  const validated = buildPayload(payload.key, payload.urlList);
  const get = async url => {
    const response = await request(url, { redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (response.status !== 200) throw new Error(`Live preflight failed: ${url} returned ${response.status}.`);
    return response;
  };
  const verification = await get(validated.keyLocation);
  if ((await verification.text()).trim() !== validated.key) throw new Error('Live verification file does not match the local key.');
  for (const url of validated.urlList) {
    const response = await get(url);
    if (!response.headers.get('content-type')?.includes('text/html')) throw new Error(`Not an HTML page: ${url}`);
    const html = await response.text();
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
    const tags = [...head.matchAll(/<(?:link|meta)\b[^>]*>/gi)].map(match => attributes(match[0]));
    const canonical = tags.filter(tag => tag.rel?.toLowerCase().split(/\s+/).includes('canonical'));
    if (canonical.length !== 1 || canonical[0].href !== url) throw new Error(`Live canonical does not match ${url}.`);
    const directives = [response.headers.get('x-robots-tag') ?? '', ...tags
      .filter(tag => ['robots', 'bingbot', 'googlebot'].includes(tag.name?.toLowerCase()))
      .map(tag => tag.content ?? '')];
    if (directives.some(value => /\b(noindex|none)\b/i.test(value))) throw new Error(`Live page is noindex: ${url}`);
  }
  if (!submit) return { status: 'dry-run', urls: validated.urlList };
  const response = await request(endpoint, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20000),
    headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(validated),
  });
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow returned HTTP ${response.status}; no automatic retry performed.`);
  return { status: response.status, urls: validated.urlList };
}

async function main(args) {
  if (args[0] === 'prepare' && args.length === 1) {
    try {
      const existing = (await readFile(keyFile, 'utf8')).trim();
      buildPayload(existing, [`${origin}/`]);
      console.log('Existing IndexNow verification file retained.');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await writeFile(keyFile, `${randomBytes(16).toString('hex')}\n`, { flag: 'wx' });
      console.log('Created the ignored verification file. Build and deploy it before submitting URLs.');
    }
    return;
  }
  const submit = args.includes('--submit');
  const all = args.includes('--all');
  const urls = args.filter(arg => !['--submit', '--all'].includes(arg));
  if (urls.some(arg => arg.startsWith('--')) || (all && urls.length) || (!all && !urls.length)) {
    throw new Error('Usage: npm run indexnow -- prepare | [--all | https://atta.edeviser.com/path/] [--submit]');
  }
  if (all) {
    const response = await fetch(`${origin}/sitemap.xml`, { redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (response.status !== 200) throw new Error(`Live sitemap returned HTTP ${response.status}.`);
    urls.push(...sitemapUrls(await response.text()));
  }
  const key = (await readFile(keyFile, 'utf8')).trim();
  const result = await notifyIndexNow(buildPayload(key, urls), { submit });
  console.log(JSON.stringify(result, null, 2));
  console.log(result.status === 'dry-run' ? 'Preflight passed. Nothing was submitted; add --submit to notify search engines.' :
    result.status === 202 ? 'URLs received; IndexNow key validation is pending. This is not confirmation of indexing.' :
    'IndexNow received the URLs. Submission does not guarantee crawling, indexing or ranking.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
}
