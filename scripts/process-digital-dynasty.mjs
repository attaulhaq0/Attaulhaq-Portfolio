import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const ffmpeg = resolve(root, 'output/imagegen/python-deps/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe');
const source = 'F:/Digital Dynasty/.mp4';
const qa = resolve(root, '../.runtime/qa/digital-dynasty');
const reportDirectory = resolve(root, 'output/digital-dynasty');
await mkdir(qa, { recursive: true });
await mkdir(reportDirectory, { recursive: true });
await mkdir(resolve(root, 'public/images/digital-dynasty'), { recursive: true });
await mkdir(resolve(root, 'public/media'), { recursive: true });
const run = args => new Promise((resolve, reject) => {
  const process = spawn(ffmpeg, args, { windowsHide: true });
  let diagnostic = '';
  process.stderr.on('data', chunk => { diagnostic += chunk.toString(); });
  process.on('error', reject);
  process.on('exit', code => code === 0 ? resolve(diagnostic) : reject(new Error(diagnostic)));
});

// Every segment comes from the supplied project recording. Editor chrome and HUD remain intact.
const segments = [
  { start: 44, end: 48, content: 'First-person riverbank exploration with hotbar and survival HUD.' },
  { start: 38, end: 44, content: 'Inventory and character statistics; equipping a stone tool in a test arena.' },
  { start: 48, end: 52, content: 'Crafting demonstration and tool workbench in Unreal Editor.' },
  { start: 62.5, end: 67.5, content: 'AI animal encounter in the forest environment with survival status HUD.' },
  { start: 77, end: 85, content: 'Wooden building placement and navigation in a play-in-editor preview.' },
  { start: 90, end: 98, content: 'Green/red placement previews for structural pieces in the test arena.' },
  { start: 110, end: 116, content: 'Weapon and bow demonstration in the test arena.' },
  { start: 120, end: 128, content: 'Two player windows and character interaction in a multiplayer test.' },
  { start: 141, end: 152, content: 'Tribe interface and session browser demonstrated in the prototype.' },
];
const filter = segments.map((segment, index) => `[0:v]trim=start=${segment.start}:end=${segment.end},setpts=PTS-STARTPTS[v${index}]`).join(';')
  + ';' + segments.map((_, index) => `[v${index}]`).join('') + `concat=n=${segments.length}:v=1:a=0,scale=1280:720:flags=lanczos,setsar=1,format=yuv420p[out]`;
const destination = resolve(root, 'public/media/digital-dynasty-gameplay.mp4');
await run(['-hide_banner', '-loglevel', 'error', '-i', source, '-filter_complex', filter, '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-r', '30', '-movflags', '+faststart', '-map_metadata', '-1', '-y', destination]);

const screenshots = [
  { name: 'exploration', timestamp: 44.5, caption: 'First-person riverbank exploration with the hotbar and survival HUD, from the prototype recording.' },
  { name: 'inventory', timestamp: 40.5, caption: 'Inventory, crafting slots and character statistics in the prototype test arena.' },
  { name: 'structures', timestamp: 84, caption: 'A timber structure and staircase demonstrated in an Unreal Engine play-in-editor window.' },
];
for (const shot of screenshots) {
  const png = resolve(qa, `${shot.name}.png`);
  await run(['-hide_banner', '-loglevel', 'error', '-ss', String(shot.timestamp), '-i', source, '-frames:v', '1', '-y', png]);
  await sharp(png).resize(1280, 720).webp({ quality: 88 }).toFile(resolve(root, `public/images/digital-dynasty/${shot.name}.webp`));
}
await sharp(resolve(qa, 'exploration.png')).resize(1280, 720).webp({ quality: 90 }).toFile(resolve(root, 'public/images/digital-dynasty-gameplay.webp'));
const sourceBytes = await readFile(source);
const outputBytes = await readFile(destination);
const totalDuration = segments.reduce((total, segment) => total + segment.end - segment.start, 0);
const manifest = {
  source: { path: source, bytes: sourceBytes.length, sha256: createHash('sha256').update(sourceBytes).digest('hex'), durationSeconds: 162, width: 1920, height: 1080, frameRate: 30, videoCodec: 'H264 High', audioCodec: 'AAC LC', audioSampleRate: 44100, audioChannels: 2 },
  output: { path: 'public/media/digital-dynasty-gameplay.mp4', bytes: outputBytes.length, sha256: createHash('sha256').update(outputBytes).digest('hex'), durationSeconds: totalDuration, width: 1280, height: 720, frameRate: 30, videoCodec: 'H264', pixelFormat: 'yuv420p', audio: 'removed: deliberately silent edited excerpt', metadata: 'stripped', faststart: true },
  edit: { sourcePreserved: true, chronological: false, segments, cropping: 'None. Full 16:9 source frame retained, including visible editor UI, debug overlays, prototype HUD and labels.', presentation: 'Edited silent prototype demonstration; native controls, no autoplay.' },
  screenshots: screenshots.map(shot => ({ ...shot, path: `public/images/digital-dynasty/${shot.name}.webp`, width: 1280, height: 720 })),
  poster: { path: 'public/images/digital-dynasty-gameplay.webp', sourceTimestamp: 44.5, width: 1280, height: 720 },
};
await writeFile(resolve(reportDirectory, 'media-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
await writeFile(resolve(reportDirectory, 'README.md'), `# Digital Dynasty — actual prototype media\n\nThe original owner-supplied recording remains at its source path, unchanged. The public video is a ${totalDuration}-second edited, deliberately silent excerpt from this recording. Its original audio stream has been removed; this does not claim the source was silent.\n\nThe footage shows prototype gameplay, test arenas and Unreal Engine play-in-editor demonstrations. All source UI, overlays and prototype labels remain visible. No generated scene or product visualization appears in these exports.\n\nExact source hash, selected intervals, output encoding, screenshot timestamps and filenames are recorded in media-manifest.json.\n\nRegenerate with:\n\n    node scripts/process-digital-dynasty.mjs\n\nThe local ffmpeg binary location is explicitly defined in the script.\n`);
console.log(JSON.stringify({ durationSeconds: totalDuration, megabytes: (await stat(destination)).size / 1e6, video: destination, screenshots: screenshots.map(shot => shot.name), manifest: resolve(reportDirectory, 'media-manifest.json') }, null, 2));
