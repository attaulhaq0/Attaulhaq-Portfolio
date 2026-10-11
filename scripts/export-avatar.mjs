import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { DataTexture, RGBAFormat, SRGBColorSpace } from 'three';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporary = resolve(root, '.local/avatar-builder.mjs');
await mkdir(resolve(root, '.local'), { recursive: true });
await mkdir(resolve(root, 'public/models'), { recursive: true });
await build({
  entryPoints: [resolve(root, 'src/islands/PersonalAvatar.tsx')],
  outfile: temporary, bundle: true, packages: 'external', platform: 'node', format: 'esm', jsx: 'automatic',
});

// Three's exporter uses browser primitives; these small adapters only serialize PNG images.
class ExportFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(result => {
      this.result = `data:${blob.type};base64,${Buffer.from(result).toString('base64')}`;
      this.onloadend?.();
    });
  }
}
class ExportImageData {
  constructor(data, width, height) { this.data = data; this.width = width; this.height = height; }
}
class ExportCanvas {
  constructor() { this.width = 1; this.height = 1; this.pixels = null; }
  getContext() {
    return {
      putImageData: image => { this.pixels = Buffer.from(image.data); },
      translate() {}, scale() {},
    };
  }
  async convertToBlob({ type = 'image/png' } = {}) {
    const png = await sharp(this.pixels, { raw: { width: this.width, height: this.height, channels: 4 } }).png().toBuffer();
    return new Blob([png], { type });
  }
}
globalThis.FileReader = ExportFileReader;
globalThis.ImageData = ExportImageData;
globalThis.OffscreenCanvas = ExportCanvas;

try {
  const { createPersonalAvatar, disposePersonalAvatar } = await import(pathToFileURL(temporary).href);
  const model = createPersonalAvatar();
  const { data, info } = await sharp(resolve(root, 'public/images/atta-avatar-face.webp')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const texture = new DataTexture(new Uint8Array(data), info.width, info.height, RGBAFormat);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = true;
  texture.needsUpdate = true;
  model.portraitMaterial.map = texture;
  model.portraitMaterial.color.set('#ded0c3');
  model.fallbackFace.visible = false;
  const result = await new GLTFExporter().parseAsync(model.root, { binary: true, onlyVisible: true });
  const destination = resolve(root, 'public/models/atta-avatar.glb');
  await writeFile(destination, Buffer.from(result));
  const bytes = await readFile(destination);
  const jsonLength = bytes.readUInt32LE(12);
  const document = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString('utf8').trim());
  if (bytes.toString('utf8', 0, 4) !== 'glTF' || document.asset.version !== '2.0' || !document.images?.length) throw new Error('Avatar export validation failed.');
  console.log(JSON.stringify({ file: destination, bytes: bytes.length, meshes: document.meshes.length, nodes: document.nodes.length, materials: document.materials.length, embeddedImages: document.images.length }, null, 2));
  disposePersonalAvatar(model.root);
} finally {
  await rm(temporary, { force: true });
}
