"""Extract only existing generated concept art to transparent sibling WebPs."""
from pathlib import Path
import argparse
import hashlib
import json
import numpy as np
from scipy import ndimage as ndi
from PIL import Image, ImageDraw, ImageOps
from rembg import new_session, remove

ROOT = Path('G:/Portfolio Website/Attaulhaq-Portfolio')
REVIEW = Path('G:/Portfolio Website/.review/theme-implementation/transparent-art')
MANIFEST = ROOT / 'output/toolkit-mini/transparent-art-manifest.json'


def rec(path):
    im = Image.open(path)
    a = np.array(im.getchannel('A')) if im.mode == 'RGBA' else None
    return {'path': str(path).replace('\\', '/'), 'dimensions': list(im.size),
            'bytes': path.stat().st_size, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'mode': im.mode, 'alphaExtrema': list(im.getchannel('A').getextrema()) if a is not None else None,
            'transparentPixelFraction': round(float(np.mean(a == 0)), 6) if a is not None else 0}


def extract(path, session):
    original = Image.open(path).convert('RGBA')
    arr = np.array(original).astype(float)
    rgb = arr[:, :, :3]
    lum = rgb.max(2)
    model_mask = np.array(remove(original.convert('RGB'), session=session, only_mask=True)).astype(float)/255
    # Topology and the model select object geometry. Pure luminance deletion is
    # never applied inside enclosed shapes: their original dark pixels survive.
    is_workflow = path.parent.name == 'workflow'
    floor = 30 if is_workflow else 55
    confidence = .25 if is_workflow else .35
    support = ((model_mask > confidence) & (lum > floor)) | (lum > 150)
    support = ndi.binary_closing(support, iterations=3)
    filled = ndi.binary_fill_holes(support)
    holes, _ = ndi.label(filled & ~support)
    hole_sizes = np.bincount(holes.ravel())
    support |= (holes > 0) & (hole_sizes[holes] < (700 if path.stem == 'toolkit-ecosystem' else 5000))
    labels, _ = ndi.label(support)
    sizes = np.bincount(labels.ravel())
    cores = np.bincount(labels.ravel(), weights=(lum > 125).ravel())
    support[(sizes[labels] < max(6, rgb.shape[0]*rgb.shape[1]*.000055)) | (cores[labels] < 5)] = False
    # The learned segmentation occasionally cuts a notch out of a glossy flat
    # cube face. Reinstate its original raster pixels within that known contour.
    if path.parent.name == 'workflow' and path.stem == 'decision':
        repair = Image.new('1', original.size)
        ImageDraw.Draw(repair).polygon(((136,145),(180,143),(216,164),(217,187),(179,205),(137,186)), fill=1)
        support |= np.array(repair, dtype=bool) & (lum > 25)
    if path.stem == 'cosmo-conqueror-illustration':
        repair = Image.new('1', original.size)
        rd = ImageDraw.Draw(repair)
        for polygon in (
            ((491,545),(575,584),(641,556),(640,595),(576,634),(491,594)),
            ((573,601),(768,535),(824,563),(824,595),(705,655),(625,626)),
            ((774,607),(834,639),(885,607),(885,628),(834,659),(773,631)),
            ((675,553),(790,501),(857,489),(857,520),(797,561),(714,585)),
        ):
            rd.polygon(polygon, fill=1)
        support |= np.array(repair, dtype=bool)
    if path.stem == 'edeviser-illustration':
        support[690:735, 425:475] = False
        repair = Image.new('1', original.size)
        rd = ImageDraw.Draw(repair)
        for polygon in (
            ((352,466),(530,529),(699,472),(780,491),(783,521),(600,611),(352,501)),
            ((247,384),(312,350),(382,382),(382,406),(312,438),(247,407)),
            ((372,620),(450,591),(528,621),(528,653),(450,683),(372,651)),
            ((613,516),(673,489),(731,518),(731,542),(674,568),(613,541)),
            ((797,460),(901,421),(1018,457),(1018,495),(902,544),(797,501)),
        ):
            rd.polygon(polygon, fill=1)
        support |= np.array(repair, dtype=bool)
    support = ndi.binary_closing(support, iterations=2)
    alpha = ndi.gaussian_filter(support.astype(float), .70)
    alpha = np.minimum(alpha, arr[:, :, 3]/255)
    alpha[alpha < .015] = 0
    # Black studio pixels are not part of the published image. Defringe those
    # compositing remnants at the single-pixel silhouette transition.
    colors = rgb.copy()
    interior = ndi.binary_erosion(support, iterations=1)
    nearest = ndi.distance_transform_edt(~interior, return_distances=False, return_indices=True)
    edge = (alpha > 0) & ~interior
    colors[edge] = colors[nearest[0][edge], nearest[1][edge]]
    colors[alpha == 0] = 0
    out = Image.fromarray(np.concatenate((colors, np.rint(alpha[:,:,None]*255)), 2).astype('uint8'), 'RGBA')
    dest = path.with_name(path.stem+'-transparent.webp')
    out.save(dest, 'WEBP', quality=94, method=6, exact=True)
    return {'source': rec(path), 'output': rec(dest), 'method': 'u2netp foreground support plus bright geometry, enclosed-dark-pixel fill, subpixel alpha, nearest-interior color at silhouette to prevent black/gray fringe'}


def extract_white(path, session):
    original = Image.open(path).convert('RGBA')
    arr = np.array(original).astype(float)
    rgb = arr[:, :, :3]
    model = np.array(remove(original.convert('RGB'), session=session, only_mask=True)).astype(float)/255
    saturation = rgb.max(2)-rgb.min(2)
    value = rgb.min(2)
    object_color = (saturation > 58) | (value < 135)
    support = ((model > .42) & object_color) | ((saturation > 70) & (model > .08))
    support = ndi.binary_closing(support, iterations=3)
    support = ndi.binary_fill_holes(support)
    if path.stem == 'edeviser-1600':
        # Retain original pixels in the deliberately pale/glass geometry.
        repair = Image.new('1', original.size)
        rd = ImageDraw.Draw(repair)
        polygons = (
            ((166,715),(270,660),(398,698),(408,744),(282,814),(168,753)),
            ((359,624),(479,574),(589,616),(590,668),(479,724),(358,666)),
            ((537,539),(651,489),(774,532),(770,580),(648,631),(538,584)),
            ((520,232),(608,199),(608,340),(529,376)),
            ((649,202),(699,210),(741,236),(803,279),(839,316),(841,439),(678,381)),
            ((654,207),(668,212),(691,405),(680,402)),
            ((674,186),(731,200),(798,245),(838,288),(839,415),(678,340)),
            ((711,152),(755,168),(773,189),(774,208),(741,227),(708,209)),
            ((945,246),(967,228),(1006,216),(1031,216),(1024,253),(1002,282)),
            ((1021,256),(1074,247),(1095,266),(1077,324),(1054,373),(1006,429)),
            ((677,292),(694,292),(695,315),(677,315)),
            ((832,291),(847,284),(862,290),(855,307),(834,312)),
        )
        for polygon in polygons:
            rd.polygon(polygon, fill=1)
        rd.ellipse((814,111,981,186), fill=1)
        rd.polygon(((816,148),(979,148),(977,185),(959,203),(906,212),(843,202),(818,185)), fill=1)
        rd.ellipse((291,256,483,338), fill=1)
        rd.polygon(((292,296),(481,296),(478,344),(455,364),(392,376),(326,364),(292,344)), fill=1)
        rd.ellipse((1155,394,1350,476), fill=1)
        rd.polygon(((1156,436),(1349,436),(1346,477),(1321,495),(1254,508),(1191,493),(1157,476)), fill=1)
        support |= np.array(repair, dtype=bool)
        # Fill sub-20px segmentation cuts in translucent pages, then reapply the
        # original cyan page boundary to avoid creating a pale background band.
        pages = support.copy()
        pages[130:460,640:1108] = ndi.binary_fill_holes(ndi.binary_closing(support,iterations=14))[130:460,640:1108]
        page_color = (rgb[:,:,2]-rgb[:,:,0] > 12) | (rgb[:,:,1]-rgb[:,:,0] > 15)
        support[130:460,640:1108] |= pages[130:460,640:1108] & page_color[130:460,640:1108]
    labels, _ = ndi.label(support)
    sizes = np.bincount(labels.ravel())
    support[sizes[labels] < 90] = False
    alpha = ndi.gaussian_filter(support.astype(float), .55)
    alpha[alpha < .015] = 0
    interior = ndi.binary_erosion(support, iterations=1)
    nearest = ndi.distance_transform_edt(~interior, return_distances=False, return_indices=True)
    edge = (alpha > 0) & ~interior
    rgb[edge] = rgb[nearest[0][edge], nearest[1][edge]]
    rgb[alpha == 0] = 0
    out = Image.fromarray(np.concatenate((rgb, np.rint(alpha[:,:,None]*255)), 2).astype('uint8'), 'RGBA')
    dest = path.with_name(path.stem+'-transparent.webp')
    out.save(dest, 'WEBP', quality=94, method=6, exact=True)
    small_path = dest.with_name(path.stem.replace('-1600', '-768')+'-transparent.webp')
    small = out.resize((768,432), Image.Resampling.LANCZOS)
    small.save(small_path, 'WEBP', quality=94, method=6, exact=True)
    return {'source': rec(path), 'output': rec(dest), 'responsiveExport': rec(small_path), 'method': 'u2netp support and chromatic/tonal white-background selection, enclosed pale geometry fill, subpixel alpha and interior-color edge repair'}


def contact(paths, name):
    w, h = 1500, 310*len(paths)
    canvas = Image.new('RGB', (w, h), '#ffffff')
    draw = ImageDraw.Draw(canvas)
    backgrounds = ('#ffffff', '#f4eefb', '#120d1b', 'checker')
    for row, path in enumerate(paths):
        im = Image.open(path).convert('RGBA')
        for col, color in enumerate(backgrounds):
            tile = Image.new('RGBA', (375, 310), color if color != 'checker' else '#e1e1e1')
            td = ImageDraw.Draw(tile)
            if color == 'checker':
                for y in range(0, 310, 20):
                    for x in range(0, 375, 20):
                        if (x//20 + y//20) % 2:
                            td.rectangle((x,y,x+19,y+19),fill='#ffffff')
            small = ImageOps.contain(im, (360, 280), Image.Resampling.LANCZOS)
            tile.alpha_composite(small, ((375-small.width)//2, 8+(280-small.height)//2))
            td.text((8, 292), path.stem.replace('-transparent',''), fill='#cbbde0' if color == '#120d1b' else '#3a294b')
            canvas.paste(tile.convert('RGB'), (col*375,row*310))
    canvas.save(REVIEW / f'{name}-contact.jpg', quality=96)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--group', choices=('home','workflow','toolkit','case','all'), default='all')
    args = parser.parse_args()
    REVIEW.mkdir(parents=True, exist_ok=True)
    paths = []
    if args.group in ('home','all'):
        paths += sorted((ROOT/'public/images/home').glob('*illustration.webp'))
    if args.group in ('workflow','all'):
        paths += [ROOT/f'public/images/workflow/{slug}.webp' for slug in ('context','decision','build','review','outcome')]
    if args.group in ('toolkit','all'):
        paths += [ROOT/'public/images/toolkit-ecosystem.webp']
    if args.group == 'case':
        paths += [ROOT/f'public/images/case-studies/{slug}-1600.webp' for slug in ('edeviser','aegisops','family-os')]
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {
        'date': '2026-10-12', 'scope': 'Existing generated homepage, workflow and toolkit concept artwork only.',
        'originalFilesOverwritten': False, 'photosOrGameFootageProcessed': False, 'apiCalls': 0, 'items': []}
    session = new_session('u2netp')
    done = []
    for path in paths:
        item = extract_white(path, session) if args.group == 'case' else extract(path, session)
        manifest['items'] = [i for i in manifest['items'] if i['source']['path'] != str(path).replace('\\','/')] + [item]
        done.append(Path(item['output']['path']))
        print(item['output']['path'], item['output']['bytes'], flush=True)
        MANIFEST.write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
    contact(done, args.group)


if __name__ == '__main__':
    main()
