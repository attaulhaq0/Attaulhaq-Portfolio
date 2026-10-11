#!/usr/bin/env node
// Microsoft Foundry Sora 2 v1 API. No network is used by --check or --dry-run.
import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync, createWriteStream } from 'node:fs';
import { resolve, relative, dirname, basename, isAbsolute, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_NAMES = ['AZURE_SORA_ENDPOINT', 'AZURE_SORA_DEPLOYMENT', 'AZURE_SORA_API_KEY'];
const sleep = ms => new Promise(done => setTimeout(done, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const print = value => console.log(JSON.stringify(value, null, 2));

export function normalizeEndpoint(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('AZURE_SORA_ENDPOINT must be a valid Azure HTTPS resource URL.'); }
  assert(url.protocol === 'https:' && !url.port && !url.username && !url.password && !url.search && !url.hash, 'Endpoint must use HTTPS without credentials, port, query, or fragment.');
  assert(/^[a-z0-9-]+\.(openai\.azure\.com|services\.ai\.azure\.com)$/i.test(url.hostname), 'Use your Azure OpenAI or Foundry resource endpoint.');
  assert(['/', '/openai/v1', '/openai/v1/'].includes(url.pathname), 'Use a resource root or /openai/v1/ endpoint; deployment and legacy job paths are unsupported.');
  return `${url.origin}/openai/v1/`;
}

export function readConfig(env) {
  const endpoint = (env.AZURE_SORA_ENDPOINT || '').trim();
  const deployment = (env.AZURE_SORA_DEPLOYMENT || 'sora-2').trim();
  const key = (env.AZURE_SORA_API_KEY || '').trim();
  assert(/^[a-zA-Z0-9_.-]+$/.test(deployment), 'AZURE_SORA_DEPLOYMENT must be a deployment name.');
  assert(!/[\r\n]/.test(key), 'AZURE_SORA_API_KEY must be a single line.');
  return { base: endpoint ? normalizeEndpoint(endpoint) : '', deployment, key };
}

export function safeSummary(config) {
  return { provider: 'Microsoft Foundry', modelFamily: 'sora-2', endpointConfigured: Boolean(config.base), deployment: config.deployment, apiKeyConfigured: Boolean(config.key), ready: Boolean(config.base && config.key), networkUsed: false };
}

export function redact(value, config = {}) {
  let text = String(value);
  if (config.key) text = text.split(config.key).join('[REDACTED]');
  return text.replace(/Bearer\s+[^\s"']+/gi, 'Bearer [REDACTED]').replace(/(api[-_]?key\s*[=:]\s*)[^\s"',}]+/gi, '$1[REDACTED]');
}

export function workspacePath(root, value) {
  const target = resolve(root, value);
  const rel = relative(root, target);
  assert(rel && rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel), 'File path must stay inside the workspace.');
  const actualRoot = realpathSync(root);
  let ancestor = target;
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  const actualRel = relative(actualRoot, realpathSync(ancestor));
  assert(actualRel !== '..' && !actualRel.startsWith(`..${sep}`) && !isAbsolute(actualRel), 'File path resolves outside the workspace.');
  assert(!existsSync(target) || !lstatSync(target).isSymbolicLink(), 'Symlink file targets are unsupported.');
  return target;
}

export function buildManifest(config, { prompt, seconds = '4', size = '1280x720', reference }) {
  assert(config.base, 'Set AZURE_SORA_ENDPOINT in .env.local.');
  assert(prompt?.trim() && [...prompt].length <= 4000, 'Prompt must contain 1–4,000 characters.');
  assert(['4', '8', '12'].includes(String(seconds)), 'Foundry Sora 2 seconds must be 4, 8, or 12.');
  assert(['1280x720', '720x1280'].includes(size), 'Foundry Sora 2 size must be 1280x720 or 720x1280.');
  return { provider: 'Microsoft Foundry', method: 'POST', url: `${config.base}videos`, encoding: 'multipart/form-data', authorization: 'Bearer [REDACTED]', fields: { model: config.deployment, prompt, seconds: String(seconds), size }, ...(reference && { input_reference: reference }), networkUsed: false };
}

function imageDimensions(bytes, extension) {
  if (extension === '.png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
  if (extension === '.jpg' || extension === '.jpeg') {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 255) break;
      const marker = bytes[offset + 1], length = bytes.readUInt16BE(offset + 2);
      if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker)) return [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
      if (length < 2) break;
      offset += length + 2;
    }
  }
  if (extension === '.webp' && bytes.toString('ascii', 0, 4) === 'RIFF') {
    const tag = bytes.toString('ascii', 12, 16);
    if (tag === 'VP8X') return [bytes.readUIntLE(24, 3) + 1, bytes.readUIntLE(27, 3) + 1];
    if (tag === 'VP8 ') return [bytes.readUInt16LE(26) & 16383, bytes.readUInt16LE(28) & 16383];
    if (tag === 'VP8L') { const bits = bytes.readUInt32LE(21); return [(bits & 16383) + 1, ((bits >>> 14) & 16383) + 1]; }
  }
  throw new Error('Unable to read reference dimensions. Use a valid PNG, JPEG, or WebP image.');
}

function parseArgs(argv) {
  const options = {};
  const flags = new Set(['check', 'dry-run', 'create', 'wait', 'help']);
  const values = new Set(['poll', 'download', 'prompt-file', 'input-reference', 'seconds', 'size', 'out', 'metadata', 'poll-seconds', 'timeout-seconds']);
  for (let index = 0; index < argv.length; index++) {
    const name = argv[index].replace(/^--/, '');
    assert(argv[index].startsWith('--') && (flags.has(name) || values.has(name)), 'Unknown option; run with --help.');
    assert(!(name in options), 'Duplicate option.');
    if (flags.has(name)) options[name] = true;
    else { assert(argv[index + 1] && !argv[index + 1].startsWith('--'), `--${name} requires a value.`); options[name] = argv[++index]; }
  }
  const modes = ['check', 'dry-run', 'create', 'poll', 'download'].filter(mode => mode in options);
  assert(options.help || modes.length === 1, 'Choose exactly one action: --check, --dry-run, --create, --poll ID, or --download ID.');
  assert(!options.wait || options.create || options.poll, '--wait requires --create or --poll.');
  return options;
}

export async function apiRequest(config, path, { method = 'GET', body } = {}) {
  const response = await fetch(`${config.base}${path}`, { method, body, headers: { Authorization: `Bearer ${config.key}` }, redirect: 'error', signal: AbortSignal.timeout(120000) });
  if (!response.ok) {
    const detail = redact((await response.text()).slice(0, 2000), config);
    throw new Error(`Foundry HTTP ${response.status}. ${detail}`);
  }
  return response;
}

const safeJob = job => Object.fromEntries(['id', 'status', 'progress', 'model', 'seconds', 'size', 'created_at', 'completed_at', 'expires_at', 'error'].filter(field => field in job).map(field => [field, job[field]]));
const validateId = id => { assert(/^video_[a-zA-Z0-9_-]+$/.test(id), 'Use the video_ ID returned by Foundry.'); return id; };

export async function main(argv = process.argv.slice(2)) {
  let config = {};
  try {
    const options = parseArgs(argv);
    if (options.help) { console.log('Foundry Sora 2: --check | --dry-run --prompt-file FILE | --create --prompt-file FILE [--wait] | --poll ID [--wait] | --download ID\nOptions: --seconds 4|8|12 --size 1280x720|720x1280 --input-reference FILE --out FILE.mp4 --metadata FILE.json --poll-seconds 20 --timeout-seconds 1200'); return; }
    const envPath = workspacePath(ROOT, '.env.local');
    const local = existsSync(envPath) ? parseEnv(readFileSync(envPath, 'utf8')) : {};
    const env = Object.fromEntries(ENV_NAMES.map(name => [name, Object.hasOwn(process.env, name) ? process.env[name] : local[name]]));
    config = readConfig(env);
    if (options.check) { print(safeSummary(config)); return; }
    assert(config.base, 'Set AZURE_SORA_ENDPOINT in .env.local.');
    const out = workspacePath(ROOT, options.out || 'public/animation/hero.mp4');
    assert(extname(out).toLowerCase() === '.mp4', '--out must be an MP4 file.');
    const metadata = workspacePath(ROOT, options.metadata || (options['dry-run'] ? 'output/sora/hero-manifest.json' : 'output/sora/hero-job.json'));
    assert(extname(metadata).toLowerCase() === '.json', '--metadata must be a JSON file.');
    assert(!relative(ROOT, metadata).startsWith(`public${sep}`), 'Store job metadata outside public/.');
    const interval = Number(options['poll-seconds'] || 20), timeout = Number(options['timeout-seconds'] || 1200);
    assert(Number.isFinite(interval) && interval >= 10 && interval <= 60 && Number.isFinite(timeout) && timeout >= interval && timeout <= 7200, 'Polling interval must be 10–60 seconds; timeout must be between the interval and 7,200 seconds.');
    const save = data => { mkdirSync(dirname(metadata), { recursive: true }); writeFileSync(metadata, redact(JSON.stringify(data, null, 2), config)); };
    let manifest, referenceBytes;
    if (options.create || options['dry-run']) {
      assert(options['prompt-file'], '--prompt-file is required.');
      const promptPath = workspacePath(ROOT, options['prompt-file']);
      const size = options.size || '1280x720';
      let reference;
      if (options['input-reference']) {
        const file = workspacePath(ROOT, options['input-reference']);
        const type = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }[extname(file).toLowerCase()];
        assert(type, 'Reference must be PNG, JPEG, or WebP.');
        referenceBytes = readFileSync(file);
        assert(referenceBytes.length < 50 * 1024 * 1024, 'Reference image exceeds the local 50 MB limit.');
        const dimensions = imageDimensions(referenceBytes, extname(file).toLowerCase());
        assert(dimensions.join('x') === size, `Reference dimensions ${dimensions.join('x')} must match --size ${size} exactly.`);
        reference = { file: relative(ROOT, file), mimeType: type, size };
      }
      manifest = buildManifest(config, { prompt: readFileSync(promptPath, 'utf8').replace(/^\uFEFF/, '').trim(), seconds: options.seconds || '4', size, reference });
      if (options['dry-run']) { save({ ...manifest, output: relative(ROOT, out), reviewedAt: new Date().toISOString() }); print({ ...manifest, metadata: relative(ROOT, metadata), output: relative(ROOT, out) }); return; }
    }
    assert(config.key, 'Set AZURE_SORA_API_KEY in .env.local before a live command.');
    let job, id;
    if (options.create) {
      assert(!existsSync(metadata), 'Job metadata already exists. Choose a new --metadata path to prevent accidental duplicate creation.');
      if (options.wait) assert(!existsSync(out), 'Output already exists; choose a new --out path.');
      const form = new FormData();
      for (const [name, value] of Object.entries(manifest.fields)) form.set(name, value);
      if (manifest.input_reference) form.set('input_reference', new Blob([referenceBytes], { type: manifest.input_reference.mimeType }), basename(manifest.input_reference.file));
      job = await (await apiRequest(config, 'videos', { method: 'POST', body: form })).json();
      id = validateId(job.id);
    } else {
      id = validateId(options.poll || options.download);
      job = await (await apiRequest(config, `videos/${encodeURIComponent(id)}`)).json();
    }
    const persist = () => { save({ provider: 'Microsoft Foundry', endpoint: config.base, output: relative(ROOT, out), request: manifest?.fields, job: safeJob(job), updatedAt: new Date().toISOString() }); print(JSON.parse(redact(JSON.stringify(safeJob(job)), config))); };
    persist();
    const started = Date.now();
    while (options.wait && ['queued', 'in_progress'].includes(job.status)) {
      assert(Date.now() - started < timeout * 1000, `Polling timed out; resume with --poll ${id} --wait.`);
      await sleep(interval * 1000);
      job = await (await apiRequest(config, `videos/${encodeURIComponent(id)}`)).json(); persist();
    }
    assert(job.status !== 'failed' && job.status !== 'cancelled', `Video ${job.status}: ${redact(job.error?.message || 'Check saved job metadata.', config)}`);
    assert(['queued', 'in_progress', 'completed'].includes(job.status), 'Unexpected job status; inspect saved metadata.');
    if (options.download || options.wait) {
      assert(job.status === 'completed', `Video is ${job.status}; poll until completed before downloading.`);
      assert(!existsSync(out), 'Output already exists; choose a new --out path.');
      const response = await apiRequest(config, `videos/${encodeURIComponent(id)}/content?variant=video`);
      assert(response.body && response.headers.get('content-type')?.startsWith('video/'), 'Foundry did not return video content.');
      mkdirSync(dirname(out), { recursive: true });
      await pipeline(Readable.fromWeb(response.body), createWriteStream(out, { flags: 'wx' }));
      print({ saved: relative(ROOT, out), id, networkUsed: true });
    }
  } catch (error) { console.error(redact(error.message, config)); process.exitCode = 1; }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
