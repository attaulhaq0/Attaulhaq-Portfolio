import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporary = resolve(root, '.local/studio-character-render.js');
await mkdir(resolve(root, '.local'), { recursive: true });
const characterSource = await readFile(resolve(root, 'src/islands/StudioCharacter.tsx'), 'utf8');
// Use the exact authored geometry while omitting its React interaction wrapper.
const pureBuilder = characterSource.replace(/^import.*?from '@react-three\/fiber';\s*/s, '').replace(/^import.*?from 'react';\s*/s, '').split('export default function StudioCharacter')[0];
const sceneCode = `${pureBuilder}
import { Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace, AmbientLight, HemisphereLight, DirectionalLight, PointLight } from 'three';
const scene = new Scene();
const renderer = new WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(768, 1152); renderer.setPixelRatio(2); renderer.setClearColor('#100b18', 0); renderer.toneMapping=ACESFilmicToneMapping; renderer.toneMappingExposure=1.08; renderer.outputColorSpace=SRGBColorSpace;
document.body.appendChild(renderer.domElement);
const camera = new PerspectiveCamera(20, 768/1152, .05, 30); camera.position.set(.04,1.30,7.1); camera.lookAt(0,1.12,0);
scene.add(new AmbientLight('#dbd4ec',.5),new HemisphereLight('#e2dcf5','#24192f',.82));
for(const [position,intensity,color] of [[[2.8,3.6,4],2.25,'#fff0df'],[[-2.2,1.8,1.5],.6,'#b3a7e9'],[[-1.4,2.7,-2.3],3.5,'#b38aff'],[[1.8,1.5,-1.6],2,'#e2a0e9']]){const light=new DirectionalLight(color,intensity);light.position.set(...position);scene.add(light);}
const character=createStudioCharacter();scene.add(character.root);renderer.render(scene,camera);window.renderReady=true;
`;
await build({ stdin: { contents: sceneCode, resolveDir: root, sourcefile: 'studio-poster.ts', loader: 'ts' }, outfile: temporary, bundle: true, platform: 'browser', format: 'esm', target: 'es2022', minify: true });
const javascript = await readFile(temporary);
const server = createServer((request, response) => {
  if (request.url === '/scene.js') { response.writeHead(200, { 'Content-Type': 'text/javascript' }); response.end(javascript); return; }
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
  // Read the actual WebGL drawing buffer, avoiding screenshot compositor alpha artefacts.
  const dataUrl = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  const destination = resolve(root, 'public/images/studio-character-poster.webp');
  // Blend the supersampled edge against the site's ink, then let the page's mask feather it.
  await sharp(png).flatten({ background: '#09080d' }).resize(768, 1152).webp({ quality: 94 }).toFile(destination);
  await writeFile(resolve(root, '.local/studio-character-render.png'), png);
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(JSON.stringify({ file: destination, bytes: (await readFile(destination)).length, width: 768, height: 1152, source: 'Actual Three.js authored geometry, rendered in Chromium', errors }, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
  await rm(temporary, { force: true });
}
