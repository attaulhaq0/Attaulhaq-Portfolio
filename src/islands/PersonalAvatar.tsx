import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  BufferGeometry, CapsuleGeometry, CatmullRomCurve3, Color, CylinderGeometry,
  DoubleSide, ExtrudeGeometry, Float32BufferAttribute, Group, MathUtils,
  Mesh, MeshStandardMaterial, Quaternion, Shape, SphereGeometry,
  SRGBColorSpace, TextureLoader, TorusGeometry, TubeGeometry, Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

type Point = [number, number, number];
type Profile = [y: number, width: number, depth: number, offsetZ?: number];

/** Original sculptural portrait, built from owner photographs rather than a borrowed avatar. */
export function createPersonalAvatar() {
  const root = new Group();
  root.name = 'Atta-ul-Haq — original portrait study';
  const body = new Group();
  body.name = 'Tailored seated figure';
  body.position.z = -.14;
  root.add(body);
  const head = new Group();
  head.name = 'Portrait head pivot';
  head.position.set(0, 1.48, -.015);
  body.add(head);

  const material = (name: string, color: string, roughness = .75, metalness = 0) => {
    const result = new MeshStandardMaterial({ color, roughness, metalness });
    result.name = name;
    return result;
  };
  const skin = material('Warm natural skin', '#b97855', .73);
  const skinLight = material('Skin highlights', '#c98964', .78);
  const skinShadow = material('Skin folds', '#975d43');
  const suit = material('Midnight pinstripe wool', '#181820', .88);
  const lapel = material('Tailored lapel wool', '#22222c', .82);
  const stripe = material('Fine woven pinstripes', '#4a4651', .89);
  const shirt = material('Warm ivory cotton', '#cfc5af', .88);
  const seam = material('Ivory seams', '#bbac93', .86);
  const hair = material('Sculpted espresso hair', '#101013', .83);
  const hairSheen = material('Swept hair grooves', '#18161d', .72);
  const beard = material('Shaped black beard', '#131518', .92);
  const trousers = material('Black tailored trousers', '#15151d', .88);
  const leather = material('Black loafer leather', '#15151b', .44);
  const sole = material('Loafer soles', '#08090b', .85);
  const gold = material('Brushed brass details', '#bd9f6b', .34, .8);
  const desk = material('Warm graphite workstation', '#28222f', .43, .48);
  const metal = material('Anodised lavender aluminium', '#898097', .36, .78);
  const darkMetal = material('Dark graphite aluminium', '#34303e', .44, .72);
  const screen = material('Quiet lavender display', '#1c1830', .38, .12);
  screen.emissive = new Color('#ac87e6');
  screen.emissiveIntensity = .18;
  const chair = material('Upholstered studio chair', '#211c29', .96);
  const portraitMaterial = material('Atta face — photographic reference', '#c28a66', .89);

  const sharedSphere = new SphereGeometry(1, 36, 24);
  const add = (parent: Group, name: string, geometry: BufferGeometry, mat: MeshStandardMaterial, position: Point = [0, 0, 0]) => {
    const mesh = new Mesh(geometry, mat);
    mesh.name = name;
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  };
  const ellipsoid = (parent: Group, name: string, mat: MeshStandardMaterial, position: Point, scale: Point) => {
    const mesh = add(parent, name, sharedSphere, mat, position);
    mesh.scale.set(...scale);
    return mesh;
  };
  const curve = (points: Point[], radius = .001, segments = 28) => new TubeGeometry(
    new CatmullRomCurve3(points.map(point => new Vector3(...point))), segments, radius, 5, false,
  );
  const between = (parent: Group, name: string, start: Point, end: Point, radius: number, mat: MeshStandardMaterial, flatten = 1) => {
    const a = new Vector3(...start);
    const b = new Vector3(...end);
    const vector = b.clone().sub(a);
    const length = vector.length();
    const mesh = add(parent, name, new CapsuleGeometry(radius, Math.max(.001, length - radius * 2), 8, 18), mat);
    mesh.position.copy(a.add(b).multiplyScalar(.5));
    mesh.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), vector.normalize()));
    mesh.scale.z = flatten;
    return mesh;
  };
  const tailoredLimb = (parent: Group, name: string, points: Point[], radii: number[], mat: MeshStandardMaterial, pinstripes = false) => {
    const path = new CatmullRomCurve3(points.map(point => new Vector3(...point)), false, 'catmullrom', .28);
    const frames = path.computeFrenetFrames(36, false);
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const lines: Point[][] = Array.from({ length: 20 }, () => []);
    for (let row = 0; row <= 36; row++) {
      const t = row / 36;
      const interpolation = t * (radii.length - 1);
      const lower = Math.floor(interpolation);
      const radius = MathUtils.lerp(radii[lower], radii[Math.min(lower + 1, radii.length - 1)], interpolation - lower);
      const center = path.getPointAt(t);
      for (let column = 0; column <= 40; column++) {
        const angle = column / 40 * Math.PI * 2;
        const position = center.clone().addScaledVector(frames.normals[row], Math.cos(angle) * radius)
          .addScaledVector(frames.binormals[row], Math.sin(angle) * radius * .88);
        positions.push(position.x, position.y, position.z);
        uvs.push(column / 40, t);
        if (column < 40 && column % 2 === 0) {
          const raised = center.clone().addScaledVector(frames.normals[row], Math.cos(angle) * (radius + .001))
            .addScaledVector(frames.binormals[row], Math.sin(angle) * (radius * .88 + .001));
          lines[column / 2].push([raised.x, raised.y, raised.z]);
        }
        if (row < 36 && column < 40) {
          const i = row * 41 + column;
          indices.push(i, i + 41, i + 1, i + 1, i + 41, i + 42);
        }
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    add(parent, name, geometry, mat);
    if (pinstripes) {
      const lineGeometries = lines.map(points => curve(points, .00062, 36));
      const merged = mergeGeometries(lineGeometries);
      if (merged) add(parent, `${name} woven pinstripes`, merged, stripe);
      lineGeometries.forEach(item => item.dispose());
    }
  };
  const roundedBoxes = new Map<string, BufferGeometry>();
  const roundedBox = (width: number, height: number, depth: number, radius = .012) => {
    const key = `${width}/${height}/${depth}/${radius}`;
    const cached = roundedBoxes.get(key);
    if (cached) return cached;
    const x = -width / 2;
    const y = -height / 2;
    const shape = new Shape();
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    const geometry = new ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: Math.min(.004, depth / 3), bevelThickness: Math.min(.003, depth / 3), curveSegments: 10 });
    geometry.translate(0, 0, -depth / 2);
    roundedBoxes.set(key, geometry);
    return geometry;
  };
  const profileGeometry = (profile: Profile[], segments = 48) => {
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    profile.forEach(([y, width, depth, offsetZ = 0], row) => {
      for (let column = 0; column <= segments; column++) {
        const angle = column / segments * Math.PI * 2;
        positions.push(Math.sin(angle) * width, y, Math.cos(angle) * depth + offsetZ);
        uvs.push(column / segments, row / (profile.length - 1));
        if (row < profile.length - 1 && column < segments) {
          const i = row * (segments + 1) + column;
          indices.push(i, i + 1, i + segments + 1, i + 1, i + segments + 2, i + segments + 1);
        }
      }
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  };
  const panel = (parent: Group, name: string, points: [number, number][], mat: MeshStandardMaterial, z: number) => {
    const shape = new Shape();
    shape.moveTo(...points[0]);
    points.slice(1).forEach(point => shape.lineTo(...point));
    shape.closePath();
    const geometry = new ExtrudeGeometry(shape, { depth: .008, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .003, bevelThickness: .002, curveSegments: 8 });
    return add(parent, name, geometry, mat, [0, 0, z]);
  };

  // A continuous head profile supplies cheek, temple, jaw and chin volume.
  const headProfile: Profile[] = [
    [-.215, .002, .005, -.01], [-.198, .058, .059, .009],
    [-.165, .096, .084, .004], [-.115, .123, .100, 0],
    [-.056, .139, .111, -.002], [.012, .140, .117, -.007],
    [.078, .137, .116, -.009], [.139, .124, .103, -.01],
    [.184, .091, .082, -.011], [.213, .039, .041, -.014], [.224, .001, .002, -.016],
  ];
  add(head, 'Continuous sculpted head', profileGeometry(headProfile, 64), skin);
  add(body, 'Natural neck and open collar chest', profileGeometry([
    [1.086, .025, .035, .105], [1.115, .043, .048, .115],
    [1.150, .070, .054, .103], [1.190, .074, .061, .085],
    [1.230, .069, .066, .049], [1.280, .067, .064, .007],
    [1.320, .070, .063, -.017], [1.350, .075, .066, -.023], [1.370, .078, .065, -.023],
  ]), skin);
  for (const side of [-1, 1]) {
    const ear = ellipsoid(head, `${side < 0 ? 'Left' : 'Right'} ear`, skinLight, [side * .140, -.046, -.004], [.023, .052, .022]);
    ear.rotation.z = side * -.13;
    ellipsoid(head, 'Ear concha', skinShadow, [side * .150, -.043, .013], [.005, .025, .003]);
    ellipsoid(head, 'Ear inner ridge', skin, [side * .152, -.047, .018], [.003, .021, .003]);
  }

  // Curved photo projection gives the sculpt its real eyes and facial proportions.
  // The silhouette, nose, ears, hair, beard, body, hands and clothing are geometry.
  const faceRows = [
    [-.211, .008, .030], [-.198, .044, .060], [-.177, .070, .078], [-.152, .093, .093], [-.133, .104, .098],
    [-.088, .122, .112], [-.035, .131, .118], [.021, .133, .119],
    [.079, .128, .115], [.133, .117, .107], [.164, .105, .098],
  ];
  const facePositions: number[] = [];
  const faceUVs: number[] = [];
  const faceIndices: number[] = [];
  const columns = 32;
  faceRows.forEach(([y, width, depth], row) => {
    for (let column = 0; column <= columns; column++) {
      const normalized = column / columns * 2 - 1;
      const x = normalized * width;
      const z = depth * Math.sqrt(1 - normalized * normalized * .66) + .004;
      facePositions.push(x, y, z);
      faceUVs.push(.5 + x / .282, (y + .211) / .375);
      if (row < faceRows.length - 1 && column < columns) {
        const i = row * (columns + 1) + column;
        faceIndices.push(i, i + 1, i + columns + 1, i + 1, i + columns + 2, i + columns + 1);
      }
    }
  });
  const faceGeometry = new BufferGeometry();
  faceGeometry.setAttribute('position', new Float32BufferAttribute(facePositions, 3));
  faceGeometry.setAttribute('uv', new Float32BufferAttribute(faceUVs, 2));
  faceGeometry.setIndex(faceIndices);
  faceGeometry.computeVertexNormals();
  const photoSurface = add(head, 'Curved reference face surface', faceGeometry, portraitMaterial);

  const noseGeometry = new SphereGeometry(1, 28, 18);
  noseGeometry.scale(.017, .049, .011);
  noseGeometry.translate(0, -.018, .119);
  const nosePosition = noseGeometry.getAttribute('position');
  const noseUV: number[] = [];
  for (let i = 0; i < nosePosition.count; i++) noseUV.push(.5 + nosePosition.getX(i) / .282, (nosePosition.getY(i) + .211) / .375);
  noseGeometry.setAttribute('uv', new Float32BufferAttribute(noseUV, 2));
  add(head, 'Sculpted nasal bridge', noseGeometry, portraitMaterial);

  const fallbackFace = new Group();
  fallbackFace.name = 'Sculpted expression fallback';
  head.add(fallbackFace);
  const sclera = material('Warm eye whites', '#d9c9b1', .5);
  const iris = material('Brown irises', '#3b241d', .43);
  const pupil = material('Dark pupils', '#100f12', .37);
  const lip = material('Natural lips', '#a96352', .7);
  for (const side of [-1, 1]) {
    ellipsoid(fallbackFace, 'Almond eye', sclera, [side * .055, .025, .114], [.032, .010, .006]);
    ellipsoid(fallbackFace, 'Brown eye iris', iris, [side * .055, .025, .120], [.010, .009, .003]);
    ellipsoid(fallbackFace, 'Eye pupil', pupil, [side * .055, .026, .123], [.004, .005, .0018]);
    add(fallbackFace, 'Shaped brow', curve([[side * .026, .050, .120], [side * .053, .059, .118], [side * .085, .052, .099]], .006), hair);
    add(fallbackFace, 'Upper eyelid', curve([[side * .025, .025, .116], [side * .053, .035, .122], [side * .085, .025, .104]], .002), skinShadow);
  }
  add(fallbackFace, 'Upper lip', curve([[-.048, -.109, .108], [-.018, -.105, .119], [0, -.110, .120], [.018, -.105, .119], [.048, -.109, .108]], .004), lip);
  add(fallbackFace, 'Lower lip', curve([[-.041, -.113, .110], [0, -.119, .120], [.041, -.113, .110]], .005), lip);

  const hairCap = new SphereGeometry(1, 48, 30, 0, Math.PI * 2, 0, Math.PI * .57);
  hairCap.scale(.145, .128, .116);
  hairCap.translate(-.004, .108, -.019);
  add(head, 'Short side fade and crown', hairCap, hair);
  ellipsoid(head, 'Side swept quiff', hair, [-.009, .183, .020], [.134, .048, .099]).rotation.z = -.08;
  const hairStrands: BufferGeometry[] = [];
  for (let index = 0; index < 26; index++) {
    const fraction = index / 25;
    const x = -.126 + fraction * .245;
    const arch = Math.sqrt(Math.max(.05, 1 - (x / .14) ** 2));
    hairStrands.push(curve([
      [x, .134 + arch * .020, .094 - Math.abs(x) * .20],
      [x - .008, .178 + arch * .046, .059 - Math.abs(x) * .18],
      [x - .012, .180 + arch * .048, -.006],
      [x - .012, .150 + arch * .039, -.084 + Math.abs(x) * .18],
    ], .00065 + .00015 * (index % 3), 18));
  }
  const mergedHair = mergeGeometries(hairStrands);
  if (mergedHair) add(head, 'Fine swept hair ridges', mergedHair, hairSheen);
  hairStrands.forEach(geometry => geometry.dispose());

  const beardPositions: number[] = [];
  const beardIndices: number[] = [];
  const beardColumns = 48;
  const beardRows = 9;
  for (let row = 0; row <= beardRows; row++) {
    const fraction = row / beardRows;
    for (let column = 0; column <= beardColumns; column++) {
      const angle = (column / beardColumns * 2 - 1) * 1.58;
      const side = Math.abs(Math.sin(angle));
      const top = -.137 + .143 * side ** 1.2;
      const bottom = -.211 + .053 * side ** 1.7;
      const y = bottom + (top - bottom) * fraction;
      const width = .052 + .089 * Math.min(1, (y + .211) / .17);
      const depth = .060 + .055 * Math.min(1, (y + .211) / .13);
      const frontRecess = Math.max(0, 1 - Math.abs(angle) / 1.0) * .022;
      beardPositions.push(Math.sin(angle) * width, y, Math.cos(angle) * depth - frontRecess);
      if (row < beardRows && column < beardColumns) {
        const i = row * (beardColumns + 1) + column;
        beardIndices.push(i, i + 1, i + beardColumns + 1, i + 1, i + beardColumns + 2, i + beardColumns + 1);
      }
    }
  }
  const beardGeometry = new BufferGeometry();
  beardGeometry.setAttribute('position', new Float32BufferAttribute(beardPositions, 3));
  beardGeometry.setIndex(beardIndices);
  beardGeometry.computeVertexNormals();
  add(head, 'Tapered full beard', beardGeometry, beard);
  add(fallbackFace, 'Trimmed moustache left', curve([[-.056, -.100, .106], [-.035, -.095, .120], [-.012, -.102, .124]], .006), beard);
  add(fallbackFace, 'Trimmed moustache right', curve([[.012, -.102, .124], [.035, -.095, .120], [.056, -.100, .106]], .006), beard);

  const torsoProfile: Profile[] = [[.57, .185, .115], [.61, .220, .140], [.72, .222, .146], [.89, .225, .143], [1.04, .260, .153], [1.15, .305, .135], [1.205, .270, .113], [1.24, .106, .060]];
  add(body, 'Shaped tailored jacket', profileGeometry(torsoProfile), suit);
  panel(body, 'Ivory open shirt front', [[-.080, 1.215], [-.109, 1.182], [-.072, 1.068], [0, .882], [.072, 1.068], [.109, 1.182], [.080, 1.215], [.042, 1.125], [0, 1.096], [-.042, 1.125]], shirt, .154);
  for (const side of [-1, 1]) {
    panel(body, 'Open shirt collar', [[side * .062, 1.240], [side * .109, 1.192], [side * .071, 1.108], [side * .034, 1.183]], shirt, .171);
    panel(body, 'Sculpted notched jacket lapel', [[side * .131, 1.215], [side * .217, 1.158], [side * .181, 1.129], [side * .197, 1.107], [side * .012, .884], [side * .060, 1.070]], lapel, .162);
    add(body, 'Lapel tailored piping', curve([[side * .130, 1.213, .178], [side * .067, 1.063, .178], [side * .015, .890, .178]], .0013), stripe);
    add(body, 'Waist pocket welt', roundedBox(.109, .012, .009, .005), lapel, [side * .126, .730, .139]);
  }
  add(body, 'Single jacket button', new CylinderGeometry(.008, .008, .005, 16), darkMetal, [.018, .866, .160]).rotation.x = Math.PI / 2;
  for (const y of [1.075, 1.015, .962]) add(body, 'Ivory shirt button', new SphereGeometry(.003, 10, 8), seam, [0, y, .171]);
  add(body, 'Small brass lapel pin', roundedBox(.015, .015, .004, .003), gold, [.176, 1.155, .180]).rotation.z = -.18;

  const torsoStripes: BufferGeometry[] = [];
  for (let index = 0; index < 72; index++) {
    const angle = index / 72 * Math.PI * 2;
    const points: Point[] = [];
    torsoProfile.slice(0, -1).forEach(([y, width, depth]) => {
      const x = Math.sin(angle) * (width + .0008);
      const z = Math.cos(angle) * (depth + .001);
      const shirtWidth = Math.max(0, (y - .88) * .32);
      if (z > 0 && y > .88 && Math.abs(x) < shirtWidth + .034) return;
      points.push([x, y, z]);
    });
    if (points.length > 1) torsoStripes.push(curve(points, .00072, 20));
  }
  const mergedStripes = mergeGeometries(torsoStripes);
  if (mergedStripes) add(body, 'Continuous fine jacket pinstripes', mergedStripes, stripe);
  torsoStripes.forEach(geometry => geometry.dispose());

  for (const side of [-1, 1]) {
    const shoulder: Point = [side * .263, 1.172, -.012];
    const elbow: Point = [side * .350, .871, .020];
    const wrist: Point = [side * .166, .823, .369];
    tailoredLimb(body, 'Continuous tailored sleeve', [shoulder, [side * .325, 1.025, -.002], elbow, [side * .270, .835, .210], wrist], [.061, .073, .065, .052, .036], suit, true);
    ellipsoid(body, 'Soft sleeve shoulder seam', suit, [side * .267, 1.159, -.017], [.061, .055, .061]);
    between(body, 'Ivory shirt cuff', [wrist[0], wrist[1], wrist[2] - .025], [wrist[0], wrist[1], wrist[2] + .005], .041, shirt, .64);
    ellipsoid(body, 'Resting palm', skinLight, [side * .153, .812, .403], [.052, .022, .062]).rotation.z = side * -.10;
    for (let finger = 0; finger < 4; finger++) {
      const x = side * .153 + (finger - 1.5) * .019;
      const length = [.051, .066, .062, .049][finger];
      between(body, 'Individual finger', [x, .809, .435], [x + side * .003, .800, .435 + length], .0078, skinLight, .85);
      ellipsoid(body, 'Natural fingernail', shirt, [x + side * .002, .805, .435 + length - .010], [.005, .0017, .009]);
    }
    between(body, 'Relaxed thumb', [side * .111, .815, .399], [side * .095, .799, .450], .011, skinLight, .9);
    const hip: Point = [side * .123, .598, -.014];
    const knee: Point = [side * .145, .472, .318];
    tailoredLimb(body, 'Continuous tailored trouser', [hip, [side * .134, .562, .165], knee, [side * .149, .350, .317], [side * .153, .113, .297]], [.090, .090, .078, .059, .048], trousers);
    add(body, 'Pressed trouser crease', curve([[side * .144, .483, .380], [side * .151, .284, .350], [side * .153, .127, .338]], .0011), darkMetal);
    ellipsoid(body, 'Exposed ankle', skin, [side * .153, .095, .299], [.041, .043, .039]);
    const shoe = new Group();
    shoe.name = 'Sculpted black loafer';
    shoe.position.set(side * .155, 0, .340);
    shoe.rotation.y = side * -.075;
    body.add(shoe);
    ellipsoid(shoe, 'Loafer last', leather, [0, .042, .022], [.065, .040, .126]);
    const shoeSole = add(shoe, 'Flat loafer sole', roundedBox(.131, .242, .012, .045), sole, [0, .012, .022]);
    shoeSole.rotation.x = -Math.PI / 2;
    ellipsoid(shoe, 'Loafer tongue', leather, [0, .068, .010], [.048, .011, .067]);
    add(shoe, 'Brass loafer horsebit', curve([[-.032, .077, .025], [-.014, .078, .028], [.014, .078, .028], [.032, .077, .025]], .0032), gold);
    for (const x of [-.038, .038]) {
      const ring = add(shoe, 'Horsebit ring', new TorusGeometry(.008, .0024, 7, 16), gold, [x, .075, .025]);
      ring.rotation.x = Math.PI / 2;
    }
  }
  add(body, 'Brass wristwatch case', new CylinderGeometry(.022, .022, .010, 24), gold, [-.165, .857, .357]);
  add(body, 'Graphite watch dial', new CylinderGeometry(.017, .017, .011, 24), darkMetal, [-.165, .859, .357]);

  const seat = add(root, 'Upholstered chair seat', roundedBox(.446, .404, .060, .056), chair, [0, .572, -.206]);
  seat.rotation.x = -Math.PI / 2;
  add(root, 'Curved upholstered chair back', roundedBox(.440, .560, .052, .082), chair, [0, .875, -.427]).rotation.x = -.08;
  between(root, 'Chair stem', [0, .074, -.224], [0, .548, -.224], .023, darkMetal);
  for (let index = 0; index < 5; index++) {
    const angle = index / 5 * Math.PI * 2;
    between(root, 'Chair foot', [0, .070, -.224], [Math.cos(angle) * .245, .038, -.224 + Math.sin(angle) * .245], .012, darkMetal);
  }

  const worktop = add(root, 'Minimal floating workstation', roundedBox(1.085, .640, .030, .040), desk, [0, .766, .300]);
  worktop.rotation.x = -Math.PI / 2;
  for (const side of [-1, 1]) {
    between(root, 'Slender desk leg', [side * .459, .028, .318], [side * .459, .746, .318], .014, darkMetal);
    between(root, 'Desk foot', [side * .459, .026, .090], [side * .459, .026, .515], .011, darkMetal);
  }
  const base = add(root, 'Laptop aluminium base', roundedBox(.414, .279, .011, .012), metal, [0, .793, .288]);
  base.rotation.x = -Math.PI / 2;
  const keyboard = add(root, 'Laptop keyboard inset', roundedBox(.354, .132, .003, .006), darkMetal, [0, .801, .218]);
  keyboard.rotation.x = -Math.PI / 2;
  const trackpad = add(root, 'Laptop trackpad', roundedBox(.105, .065, .002, .005), desk, [0, .802, .354]);
  trackpad.rotation.x = -Math.PI / 2;
  const keys: BufferGeometry[] = [];
  for (let row = 0; row < 4; row++) for (let column = 0; column < 13; column++) {
    const geometry = roundedBox(.020, .017, .0015, .003).clone();
    geometry.rotateX(-Math.PI / 2);
    geometry.translate((column - 6) * .025, .804, .171 + row * .028);
    keys.push(geometry);
  }
  const mergedKeys = mergeGeometries(keys);
  if (mergedKeys) add(root, 'Individually spaced keyboard keys', mergedKeys, metal);
  keys.forEach(geometry => geometry.dispose());
  const lid = new Group();
  lid.name = 'Open aluminium laptop';
  lid.position.set(0, .802, .158);
  lid.rotation.x = -.20;
  root.add(lid);
  add(lid, 'Laptop sculpted display shell', roundedBox(.415, .271, .009, .013), metal, [0, .134, 0]);
  add(lid, 'Inset display', roundedBox(.384, .239, .003, .008), screen, [0, .139, -.006]);
  add(lid, 'Subtle laptop emblem', new TorusGeometry(.018, .0019, 8, 32), darkMetal, [0, .147, .005]);
  const ground = add(root, 'Sculpted studio plinth', new CylinderGeometry(.685, .704, .016, 80), darkMetal, [0, -.009, .04]);
  ground.material = material('Quiet plinth surface', '#18121f', .88, .16);
  const rim = material('Lavender studio rim', '#6b4692', .65, .34);
  rim.emissive = new Color('#9c6bbd');
  rim.emissiveIntensity = .14;
  add(root, 'Thin lavender plinth rim', new TorusGeometry(.690, .0025, 7, 80), rim, [0, .001, .04]).rotation.x = Math.PI / 2;

  [shirt, lapel, beard, portraitMaterial, suit, trousers].forEach(mat => { mat.side = DoubleSide; });
  root.updateMatrixWorld(true);
  return { root, body, head, photoSurface, portraitMaterial, fallbackFace };
}

export function disposePersonalAvatar(root: Group) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<MeshStandardMaterial>();
  root.traverse(object => {
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry);
    const list = Array.isArray(object.material) ? object.material : [object.material];
    list.forEach(mat => materials.add(mat as MeshStandardMaterial));
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(mat => { mat.map?.dispose(); mat.dispose(); });
}

export default function PersonalAvatar({ onReady }: { onReady: () => void }) {
  const model = useMemo(() => createPersonalAvatar(), []);
  const target = useRef({ x: 0, y: 0 });
  const ready = useRef(onReady);
  const textureReady = useRef(false);
  const readinessSent = useRef(false);
  ready.current = onReady;
  const { gl, invalidate } = useThree();

  useEffect(() => {
    let active = true;
    const texture = new TextureLoader().load('/images/atta-avatar-face.webp', loaded => {
      if (!active) { loaded.dispose(); return; }
      loaded.colorSpace = SRGBColorSpace;
      loaded.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
      model.portraitMaterial.map = loaded;
      model.portraitMaterial.color.set('#ded0c3');
      model.portraitMaterial.needsUpdate = true;
      model.fallbackFace.visible = false;
      invalidate();
      textureReady.current = true;
    }, undefined, () => {
      if (!active) return;
      invalidate();
      textureReady.current = true;
    });
    return () => { active = false; texture.dispose(); };
  }, [gl, invalidate, model]);

  useEffect(() => {
    const canvas = gl.domElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const leave = () => { target.current = { x: 0, y: 0 }; invalidate(); };
    const move = (event: PointerEvent) => {
      if (reduced.matches || event.pointerType === 'touch') return;
      const bounds = canvas.getBoundingClientRect();
      target.current = {
        x: MathUtils.clamp(((event.clientY - bounds.top) / bounds.height - .5) * .12, -.055, .055),
        y: MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - .5) * .42, -.21, .21),
      };
      invalidate();
    };
    const preferenceChange = () => { if (reduced.matches) leave(); };
    canvas.addEventListener('pointermove', move, { passive: true });
    canvas.addEventListener('pointerleave', leave);
    reduced.addEventListener('change', preferenceChange);
    return () => {
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      reduced.removeEventListener('change', preferenceChange);
    };
  }, [gl, invalidate]);

  useEffect(() => () => disposePersonalAvatar(model.root), [model]);
  useFrame((_, delta) => {
    if (document.hidden) return;
    if (textureReady.current && !readinessSent.current) {
      readinessSent.current = true;
      // The next browser frame follows this scene render, with its texture already uploaded.
      requestAnimationFrame(() => ready.current());
    }
    const blend = 1 - Math.exp(-7 * Math.min(delta, .1));
    model.head.rotation.x = MathUtils.lerp(model.head.rotation.x, target.current.x, blend);
    model.head.rotation.y = MathUtils.lerp(model.head.rotation.y, target.current.y, blend);
    model.body.rotation.y = MathUtils.lerp(model.body.rotation.y, target.current.y * .14, blend);
    const difference = Math.abs(model.head.rotation.y - target.current.y) + Math.abs(model.head.rotation.x - target.current.x);
    if (difference > .0006) invalidate();
  });
  return <primitive object={model.root} dispose={null} />;
}
