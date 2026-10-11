import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporary = resolve(root, '.local/source-character-render.js');
await mkdir(resolve(root, '.local'), { recursive: true });
const sceneCode = `
import { prepareSourceCharacter, disposeSourceCharacter } from './src/islands/SourceCharacter';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace, AmbientLight, HemisphereLight, DirectionalLight } from 'three';
const scene = new Scene();
const renderer = new WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(768, 1152); renderer.setPixelRatio(2); renderer.setClearColor('#100b18', 0); renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08; renderer.outputColorSpace = SRGBColorSpace;
document.body.appendChild(renderer.domElement);
const camera = new PerspectiveCamera(20, 768/1152, .05, 100); camera.position.set(0, 9, 50); camera.lookAt(0, 8, 0);
scene.add(new AmbientLight('#dbd4ec', .5), new HemisphereLight('#e2dcf5', '#24192f', .82));
for (const [position, intensity, color] of [[[10,17,20],2.25,'#fff0df'],[[-10,13,10],.6,'#b3a7e9'],[[-6,17,-12],3.5,'#b38aff'],[[8,10,-10],2,'#e2a0e9']]) {
  const light = new DirectionalLight(color, intensity); light.position.set(...position); scene.add(light);
}
const character = prepareSourceCharacter(await new GLTFLoader().loadAsync('/models/source-character.glb'));
scene.add(character.root); renderer.render(scene, camera); window.renderReady = true;
window.releaseRender = async () => {
  const before = { ...renderer.info.memory };
  scene.remove(character.root); character.mixer.stopAllAction(); character.mixer.uncacheRoot(character.root); disposeSourceCharacter(character.root);
  const after = { ...renderer.info.memory };
  const reopened = prepareSourceCharacter(await new GLTFLoader().loadAsync('/models/source-character.glb'));
  scene.add(reopened.root); renderer.render(scene, camera);
  const reopen = { ...renderer.info.memory };
  scene.remove(reopened.root); reopened.mixer.stopAllAction(); reopened.mixer.uncacheRoot(reopened.root); disposeSourceCharacter(reopened.root);
  const afterReopen = { ...renderer.info.memory }; renderer.dispose(); renderer.forceContextLoss();
  return { before, after, reopen, afterReopen };
};
`;
await build({ stdin: { contents: sceneCode, resolveDir: root, sourcefile: 'source-poster.ts', loader: 'ts' }, outfile: temporary, bundle: true, platform: 'browser', format: 'esm', target: 'es2022', minify: true });
const javascript = await readFile(temporary);
const model = await readFile(resolve(root, 'public/models/source-character.glb'));
const server = createServer((request, response) => {
  if (request.url === '/scene.js') { response.writeHead(200, { 'Content-Type': 'text/javascript' }); response.end(javascript); return; }
  if (request.url === '/models/source-character.glb') { response.writeHead(200, { 'Content-Type': 'model/gltf-binary' }); response.end(model); return; }
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end('<!DOCTYPE html><html><head><style>html,body{margin:0;background:transparent;width:768px;height:1152px;overflow:hidden}canvas{display:block}</style></head><body><script type="module" src="/scene.js"></script></body></html>');
});
await new Promise(resolve => server.listen(4337, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 768, height: 1152 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4337/');
  await page.waitForFunction(() => window.renderReady === true);
  const dataUrl = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  const destination = resolve(root, 'public/images/source-character-poster.webp');
  await sharp(png).resize(768, 1152).webp({ quality: 94, alphaQuality: 100 }).toFile(destination);
  await writeFile(resolve(root, '.local/source-character-render.png'), png);
  const resources = await page.evaluate(() => window.releaseRender());
  // Three retains its internal fallback texture until renderer/context teardown.
  if (resources.after.geometries || resources.afterReopen.geometries || resources.afterReopen.textures !== resources.after.textures || resources.reopen.textures !== resources.before.textures) {
    throw new Error('Model resources grew after teardown and reopen.');
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(JSON.stringify({ file: destination, bytes: (await readFile(destination)).length, width: 768, height: 1152, source: 'Owner-approved original model, rendered with the exact runtime pose in Chromium', resources, errors }, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
  await rm(temporary, { force: true });
}
