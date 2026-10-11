import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporary = resolve(root, '.local/studio-character-builder.mjs');
await mkdir(resolve(root, '.local'), { recursive: true });
await mkdir(resolve(root, 'public/models'), { recursive: true });
await build({ entryPoints: [resolve(root, 'src/islands/StudioCharacter.tsx')], outfile: temporary, bundle: true, packages: 'external', platform: 'node', format: 'esm', jsx: 'automatic' });
class ExportFileReader {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(result => { this.result = `data:${blob.type};base64,${Buffer.from(result).toString('base64')}`; this.onloadend?.(); }); }
}
globalThis.FileReader = ExportFileReader;
try {
  const { createStudioCharacter, disposeStudioCharacter } = await import(pathToFileURL(temporary).href);
  const { root: character } = createStudioCharacter();
  const result = await new GLTFExporter().parseAsync(character, { binary: true, onlyVisible: true });
  const destination = resolve(root, 'public/models/studio-character.glb');
  await writeFile(destination, Buffer.from(result));
  const bytes = await readFile(destination);
  const jsonLength = bytes.readUInt32LE(12);
  const gltf = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString('utf8').trim());
  if (bytes.toString('utf8', 0, 4) !== 'glTF' || gltf.asset.version !== '2.0' || !gltf.meshes?.length) throw new Error('Studio character export failed validation.');
  console.log(JSON.stringify({ file: destination, bytes: bytes.length, meshDefinitions: gltf.meshes.length, nodes: gltf.nodes.length, materials: gltf.materials.length, images: gltf.images?.length ?? 0 }, null, 2));
  disposeStudioCharacter(character);
} finally {
  await rm(temporary, { force: true });
}
