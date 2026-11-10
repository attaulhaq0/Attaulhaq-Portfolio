import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildPayload, sitemapUrls, notifyIndexNow } from './indexnow.mjs';

const origin = 'https://atta.edeviser.com';
const key = 'a'.repeat(32);
const home = `${origin}/`;
const page = `${origin}/freelance-work/`;
const xml = `<urlset><url><loc>${home}</loc></url><url><loc>${page}</loc></url></urlset>`;

test('sitemap URLs retain order and omit duplicates', () => {
  assert.deepEqual(sitemapUrls(xml.replace('</urlset>', `<url><loc>${home}</loc></url></urlset>`)), [home, page]);
});

test('submission rejects foreign, preview and non-canonical URLs', () => {
  for (const url of ['https://example.com/', 'https://attaulhaq-spatial-portfolio.vercel.app/',
    `${origin}/#work`, `${origin}/?test=1`, `${origin}/freelance-work`, 'http://atta.edeviser.com/']) {
    assert.throws(() => buildPayload(key, [url]), /canonical/);
  }
});

test('submission requires a valid key and a non-empty bounded URL list', () => {
  assert.throws(() => buildPayload('invalid', [home]), /key/);
  assert.throws(() => buildPayload(key, []), /URLs/);
  assert.throws(() => buildPayload(key, Array.from({ length: 10001 }, (_, i) => `${origin}/${i}/`)), /URLs/);
});

function transport({ keyText = key, canonical = home, robots = '', status = 200 } = {}) {
  const calls = [];
  return {
    calls,
    fetch: async (url, options = {}) => {
      calls.push({ url, options });
      if (url.endsWith('/indexnow-key.txt')) return new Response(keyText);
      if (url === home) return new Response(`<html><head><link rel="canonical" href="${canonical}">${robots}</head></html>`,
        { headers: { 'content-type': 'text/html' } });
      if (url === 'https://api.indexnow.org/indexnow') return new Response('', { status });
      throw new Error(`Unexpected request: ${url}`);
    },
  };
}

test('dry run validates live pages without notifying a search engine', async () => {
  const http = transport();
  const result = await notifyIndexNow(buildPayload(key, [home]), { fetch: http.fetch });
  assert.equal(result.status, 'dry-run');
  assert.equal(http.calls.length, 2);
  assert.ok(http.calls.every(call => !call.options.method));
});

test('wrong live verification file stops submission', async () => {
  const http = transport({ keyText: 'wrong' });
  await assert.rejects(notifyIndexNow(buildPayload(key, [home]), { fetch: http.fetch, submit: true }), /verification/);
  assert.equal(http.calls.length, 1);
});

test('a noindex page stops submission', async () => {
  const http = transport({ robots: '<meta name="robots" content="noindex, follow">' });
  await assert.rejects(notifyIndexNow(buildPayload(key, [home]), { fetch: http.fetch, submit: true }), /noindex/);
  assert.equal(http.calls.length, 2);
});

test('a different canonical stops submission', async () => {
  const http = transport({ canonical: page });
  await assert.rejects(notifyIndexNow(buildPayload(key, [home]), { fetch: http.fetch, submit: true }), /canonical/);
  assert.equal(http.calls.length, 2);
});

test('a successful request sends exactly the validated public URLs', async () => {
  const http = transport();
  const payload = buildPayload(key, [home, home]);
  const result = await notifyIndexNow(payload, { fetch: http.fetch, submit: true });
  assert.equal(result.status, 200);
  assert.deepEqual(JSON.parse(http.calls.at(-1).options.body).urlList, [home]);
});

test('202 is reported as pending validation rather than completed indexing', async () => {
  const http = transport({ status: 202 });
  const result = await notifyIndexNow(buildPayload(key, [home]), { fetch: http.fetch, submit: true });
  assert.equal(result.status, 202);
});

test('rate limits and validation errors fail without automatic resubmission', async () => {
  for (const status of [400, 403, 422, 429, 500]) {
    const http = transport({ status });
    await assert.rejects(notifyIndexNow(buildPayload(key, [home]), { fetch: http.fetch, submit: true }), new RegExp(`${status}`));
    assert.equal(http.calls.length, 3);
  }
});
