import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const ffmpeg = resolve(root, 'output/imagegen/python-deps/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe');
const names = process.argv.slice(2);
const known = {
  'aegis-voice-concept': { caption: 'AI-generated concept animation: a voice signal flows into connected retrieval nodes. This is a visual metaphor, not footage of the AegisOps interface.', description: 'A stylized microphone, glass waveform and three connected nodes glow with cyan and violet light.' },
  'family-approval-concept': { caption: 'AI-generated concept animation: light moves between connected glass homes. This is a visual metaphor for household coordination, not footage of the Family OS interface.', description: 'Three glass homes connected by illuminated paths on a reflective studio pedestal.' },
};
const run = args => new Promise((resolve, reject) => {
  const child = spawn(ffmpeg, args, { windowsHide: true });
  let diagnostic = '';
  child.stderr.on('data', chunk => { diagnostic += chunk.toString(); });
  child.on('error', reject);
  child.on('exit', code => code === 0 ? resolve(diagnostic) : reject(new Error(diagnostic)));
});
await mkdir(resolve(root, 'output/sora/qa'), { recursive: true });
await mkdir(resolve(root, 'public/media'), { recursive: true });
for (const name of names) {
  if (!known[name]) throw new Error('Use aegis-voice-concept or family-approval-concept.');
  const source = resolve(root, `output/sora/raw/${name}.mp4`);
  const output = resolve(root, `public/media/${name}.mp4`);
  const sourceBytes = await readFile(source);
  const grade = "curves=r='0/0.045 0.35/0.42 1/1':g='0/0.025 0.35/0.395 1/1':b='0/0.08 0.35/0.49 1/1'";
  const encoding = await run(['-hide_banner','-loglevel','error','-i',source,'-map','0:v:0','-vf',grade,'-an','-c:v','libx264','-preset','medium','-crf','22','-pix_fmt','yuv420p','-r','30','-movflags','+faststart','-map_metadata','-1','-y',output]);
  const decoded = await run(['-hide_banner','-loglevel','error','-i',output,'-map','0:v:0','-f','null','-']);
  const info = await run(['-hide_banner','-i',output,'-f','null','-']);
  const duration = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(info);
  const dimensions = /Video:.*?,\s*(\d+)x(\d+)/.exec(info);
  const durationSeconds = duration ? Number(duration[1])*3600+Number(duration[2])*60+Number(duration[3]) : null;
  const width = dimensions ? Number(dimensions[1]) : null;
  const height = dimensions ? Number(dimensions[2]) : null;
  if (width !== 1280 || height !== 720 || !durationSeconds || durationSeconds < 3.9 || /Audio:/.test(info)) throw new Error('Unexpected dimensions, duration or audio stream in concept export.');
  const panels=[];
  const timestamps=[0,.75,1.5,2.25,3,3.75];
  for(const [index,timestamp] of timestamps.entries()) {
    const png=resolve(root,`output/sora/qa/${name}-sample-${index+1}.png`);
    await run(['-hide_banner','-loglevel','error','-ss',String(timestamp),'-i',output,'-frames:v','1','-y',png]);
    panels.push({input:await sharp(png).resize(426,240).png().toBuffer(),left:(index%3)*426,top:Math.floor(index/3)*270});
    if(index===2)await sharp(png).webp({quality:91}).toFile(resolve(root,`public/images/${name}-poster.webp`));
  }
  const sheet=resolve(root,`output/sora/qa/${name}-contact-sheet.webp`);
  await sharp({create:{width:1278,height:540,channels:3,background:'#211731'}}).composite(panels).webp({quality:92}).toFile(sheet);
  const bytes=await readFile(output);
  const manifest={
    provider:'Microsoft Foundry',model:'sora-2',source:{path:`output/sora/raw/${name}.mp4`,bytes:sourceBytes.length,sha256:createHash('sha256').update(sourceBytes).digest('hex')},
    output:{path:`public/media/${name}.mp4`,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),durationSeconds,width,height,frameRate:30,codec:'H264',pixelFormat:'yuv420p',audio:'Removed; deliberately silent concept animation.',faststart:true,fullDecode:'exit 0 no decode errors'},
    poster:{path:`public/images/${name}-poster.webp`,timestamp:1.5,width,height,bytes:(await stat(resolve(root,`public/images/${name}-poster.webp`))).size},
    qa:{contactSheet:`output/sora/qa/${name}-contact-sheet.webp`,timestamps,encodingDiagnostic:encoding,decodeDiagnostic:decoded},
    edit:{colorGrade:'Gentle violet shadow lift and brightened glass midtones.',filter:grade,geometry:'No geometry, labels or UI added during processing.',audio:'Removed from public export.'},
    ...known[name],scope:'Original generated visual metaphor. Not actual product UI, footage, deployed architecture or a verified product behavior. Display with explicit playback controls, no autoplay and preload none.',
  };
  await writeFile(resolve(root,`output/sora/${name}-processing.json`),JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify(manifest.output,null,2));
}
