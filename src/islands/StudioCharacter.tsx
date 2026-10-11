import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  BufferGeometry, CatmullRomCurve3, CylinderGeometry, DoubleSide,
  ExtrudeGeometry, Float32BufferAttribute, Group, MathUtils, Mesh,
  MeshPhysicalMaterial, MeshStandardMaterial, Shape, SphereGeometry,
  TorusGeometry, TubeGeometry, Vector3,
} from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

type Point = [number, number, number];
type Profile = [number, number, number, number?];

/** An original studio mascot. Every visible surface is mesh geometry, with no portrait textures. */
export function createStudioCharacter() {
  const root = new Group();
  root.name = 'Studio developer — original character';
  const body = new Group();
  body.name = 'Soft tailored studio bust';
  body.rotation.y = -.055;
  root.add(body);
  const head = new Group();
  head.name = 'Expressive head pivot';
  head.position.set(0, 1.58, .015);
  head.rotation.y = -.075;
  head.rotation.z = -.025;
  root.add(head);
  const eyes = new Group();
  eyes.name = 'Pointer gaze';
  head.add(eyes);

  const ceramic = new MeshPhysicalMaterial({ color: '#dfd8e6', roughness: .47, metalness: .02, clearcoat: .20, clearcoatRoughness: .35 });
  ceramic.name = 'Warm porcelain skin';
  const ceramicShade = new MeshStandardMaterial({ color: '#b8aabf', roughness: .66 });
  ceramicShade.name = 'Porcelain detail shadows';
  const ceramicHighlight = new MeshStandardMaterial({ color: '#e7e0eb', roughness: .52 });
  ceramicHighlight.name = 'Porcelain detail highlights';
  const hair = new MeshPhysicalMaterial({ color: '#17131f', roughness: .43, clearcoat: .3, clearcoatRoughness: .3 });
  hair.name = 'Sculpted ink hair';
  const hairRidge = new MeshStandardMaterial({ color: '#21182b', roughness: .55 });
  hairRidge.name = 'Soft swept hair ridges';
  const jacket = new MeshStandardMaterial({ color: '#211929', roughness: .85 });
  jacket.name = 'Midnight plum studio jacket';
  const jacketLapel = new MeshStandardMaterial({ color: '#312439', roughness: .76 });
  jacketLapel.name = 'Soft tailored lapels';
  const tee = new MeshStandardMaterial({ color: '#d6cddc', roughness: .90 });
  tee.name = 'Warm cream cotton tee';
  const trim = new MeshStandardMaterial({ color: '#7c6494', roughness: .65, metalness: .15 });
  trim.name = 'Quiet lavender stitch';
  const earCushion = new MeshStandardMaterial({ color: '#32233e', roughness: .91 });
  earCushion.name = 'Plum headphone cushions';
  const headset = new MeshPhysicalMaterial({ color: '#574068', roughness: .40, metalness: .34, clearcoat: .22 });
  headset.name = 'Satin plum headphones';
  const metal = new MeshStandardMaterial({ color: '#aa8dc7', roughness: .34, metalness: .73 });
  metal.name = 'Brushed lavender aluminium';
  const white = new MeshPhysicalMaterial({ color: '#eee8ef', roughness: .25, clearcoat: .5 });
  white.name = 'Soft eye whites';
  const iris = new MeshPhysicalMaterial({ color: '#654087', roughness: .23, clearcoat: .80 });
  iris.name = 'Expressive lavender irises';
  const irisRim = new MeshStandardMaterial({ color: '#30223e', roughness: .38 });
  irisRim.name = 'Dark iris rims';
  const pupil = new MeshPhysicalMaterial({ color: '#100c18', roughness: .15, clearcoat: 1 });
  pupil.name = 'Glossy dark pupils';
  const glint = new MeshStandardMaterial({ color: '#ffffff', roughness: .12, emissive: '#ffffff', emissiveIntensity: .2 });
  glint.name = 'Eye catchlights';
  const expression = new MeshStandardMaterial({ color: '#766078', roughness: .75 });
  expression.name = 'Gentle smile and eyelid folds';
  const sphere = new SphereGeometry(1, 48, 36);

  const add = (parent: Group, name: string, geometry: BufferGeometry, material: MeshStandardMaterial, position: Point = [0, 0, 0]) => {
    const mesh = new Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  };
  const ellipse = (parent: Group, name: string, material: MeshStandardMaterial, position: Point, scale: Point) => {
    const mesh = add(parent, name, sphere, material, position);
    mesh.scale.set(...scale);
    return mesh;
  };
  const curve = (points: Point[], radius: number, segments = 36, sides = 8) => new TubeGeometry(new CatmullRomCurve3(points.map(point => new Vector3(...point))), segments, radius, sides, false);
  const profileGeometry = (profile: Profile[], segments = 72) => {
    const positions: number[] = [];
    const indices: number[] = [];
    // Catmull-Rom interpolation rounds the silhouette between the authored profile rings.
    const smoothProfile: Profile[] = [];
    const outline = new CatmullRomCurve3(profile.map(([y, width, depth]) => new Vector3(width, y, depth)), false, 'centripetal');
    const offsetOutline = new CatmullRomCurve3(profile.map(([y, , , offset = 0]) => new Vector3(offset, y, 0)), false, 'centripetal');
    const smoothRows = Math.max(48, profile.length * 5);
    for (let row = 0; row <= smoothRows; row++) {
      const fraction = row / smoothRows;
      const point = outline.getPoint(fraction);
      smoothProfile.push([point.y, Math.max(.001, point.x), Math.max(.001, point.z), offsetOutline.getPoint(fraction).x]);
    }
    smoothProfile.forEach(([y, width, depth, offset = 0], row) => {
      for (let column = 0; column <= segments; column++) {
        const angle = column / segments * Math.PI * 2;
        positions.push(Math.sin(angle) * width, y, Math.cos(angle) * depth + offset);
        if (row < smoothProfile.length - 1 && column < segments) {
          const i = row * (segments + 1) + column;
          indices.push(i, i + 1, i + segments + 1, i + 1, i + segments + 2, i + segments + 1);
        }
      }
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    const welded = mergeVertices(geometry, .00001);
    geometry.dispose();
    welded.computeVertexNormals();
    return welded;
  };
  const lapelPanel = (points: [number, number][]) => {
    const shape = new Shape();
    shape.moveTo(...points[0]);
    points.slice(1).forEach(point => shape.lineTo(...point));
    shape.closePath();
    return new ExtrudeGeometry(shape, { depth: .014, bevelEnabled: true, bevelSegments: 4, bevelSize: .012, bevelThickness: .010, curveSegments: 12 });
  };

  // Soft continuous ceramic head: wide temples, rounded cheeks, a tapered chin.
  add(head, 'Continuous rounded face', profileGeometry([
    [-.515, .002, .008], [-.493, .118, .115], [-.453, .215, .191],
    [-.392, .280, .235], [-.302, .331, .265], [-.188, .360, .290],
    [-.047, .372, .307], [.099, .371, .303], [.224, .359, .288],
    [.327, .333, .262], [.411, .286, .223], [.468, .207, .164], [.503, .089, .071], [.510, .002, .005],
  ]), ceramic);
  add(body, 'Sculpted visible neck', profileGeometry([[.986, .136, .042, .269], [1.030, .125, .047, .252], [1.080, .113, .058, .207], [1.140, .115, .087, .091], [1.195, .132, .105, .029]]), ceramic);
  for (const side of [-1, 1]) {
    ellipse(head, 'Rounded ceramic ear', ceramic, [side * .371, -.030, -.006], [.077, .116, .052]);
    ellipse(head, 'Soft ear concha', ceramicShade, [side * .409, -.032, .037], [.035, .071, .012]);
    add(head, 'Sculpted inner ear ridge', curve([[side * .414, .010, .050], [side * .424, -.030, .050], [side * .414, -.063, .050]], .011, 20), ceramicHighlight);
  }

  // Almond eye volumes, coloured irises, tiny catchlights and curved brows.
  for (const side of [-1, 1]) {
    ellipse(head, 'Gentle eye socket', ceramicShade, [side * .153, -.015, .285], [.122, .059, .023]);
    ellipse(head, 'Almond eye white', white, [side * .153, -.011, .304], [.113, .056, .033]);
    ellipse(eyes, 'Dark iris ring', irisRim, [side * .148, -.012, .337], [.052, .052, .013]);
    ellipse(eyes, 'Lavender eye iris', iris, [side * .148, -.012, .348], [.044, .044, .010]);
    ellipse(eyes, 'Eye pupil', pupil, [side * .148, -.013, .357], [.020, .026, .006]);
    ellipse(eyes, 'Large eye catchlight', glint, [side * .148 - .014, .009, .362], [.009, .011, .003]);
    ellipse(eyes, 'Small eye catchlight', glint, [side * .148 + .014, -.031, .362], [.0035, .004, .002]);
    add(head, 'Soft upper eyelid', curve([[side * .045, -.010, .317], [side * .094, .039, .327], [side * .168, .047, .329], [side * .252, -.012, .275]], .008), ceramic);
    add(head, 'Soft lower eyelid', curve([[side * .043, -.019, .310], [side * .127, -.061, .326], [side * .210, -.047, .304], [side * .254, -.013, .271]], .004), ceramicHighlight);
    const brow = add(head, 'Sculpted expressive eyebrow', curve([[side * .060, .137, .300], [side * .112, .163, .311], [side * .185, .157, .299], [side * .248, .119, .270]], .019), hair);
    brow.rotation.z = side * -.02;
  }
  ellipse(head, 'Soft sculpted nose bridge', ceramic, [0, -.080, .303], [.049, .090, .048]);
  ellipse(head, 'Rounded nose tip', ceramic, [0, -.125, .337], [.059, .042, .051]);
  for (const side of [-1, 1]) ellipse(head, 'Nose wing', ceramic, [side * .044, -.136, .311], [.024, .020, .025]);
  add(head, 'Warm asymmetric smile', curve([[-.145, -.267, .230], [-.095, -.281, .270], [0, -.285, .285], [.091, -.267, .276], [.143, -.238, .243]], .008, 40), expression);
  ellipse(head, 'Smile dimple', ceramicShade, [.146, -.237, .244], [.011, .016, .006]);

  // Sculpted sweep: cap geometry with a sloped hairline and a broad organic quiff.
  const cap = new SphereGeometry(1, 128, 64, 0, Math.PI * 2, 0, Math.PI * .62);
  const capPositions = cap.getAttribute('position');
  for (let index = 0; index < capPositions.count; index++) {
    const x = capPositions.getX(index);
    const y = capPositions.getY(index);
    const z = capPositions.getZ(index);
    capPositions.setXYZ(index, x * .382 - .008, y * .280 + .278 + x * .030, z * .306 - .024);
  }
  cap.computeVertexNormals();
  add(head, 'Ink hair cap', cap, hair);
  ellipse(head, 'Soft swept front quiff', hair, [-.025, .364, .146], [.345, .135, .181]).rotation.z = -.10;
  const sweepPaths: Point[][] = [
    [[-.292, .370, .204], [-.248, .448, .236], [-.138, .493, .176], [.057, .510, .044], [.275, .408, -.032]],
    [[-.238, .407, .262], [-.189, .469, .242], [-.054, .511, .190], [.139, .505, .029], [.291, .391, -.056]],
    [[-.163, .429, .288], [-.098, .490, .241], [.031, .526, .157], [.207, .489, -.012], [.314, .347, -.081]],
    [[-.070, .440, .296], [.002, .499, .218], [.128, .521, .110], [.257, .442, -.042], [.332, .299, -.114]],
    [[.035, .435, .285], [.108, .490, .181], [.214, .478, .061], [.311, .375, -.095]],
  ];
  sweepPaths.forEach((points, index) => add(head, 'Organic swept hair ridge', curve(points, .006 + index * .0006, 40, 10), hairRidge));

  // Premium over-ear headphones make this a distinct original studio character.
  const band = new TorusGeometry(.458, .026, 12, 64, Math.PI);
  const bandMesh = add(head, 'Curved headphone headband', band, earCushion, [0, .019, -.120]);
  bandMesh.rotation.z = 0;
  const bandTrim = add(head, 'Satin outer headband', new TorusGeometry(.466, .013, 10, 64, Math.PI), headset, [0, .019, -.122]);
  bandTrim.rotation.z = 0;
  for (const side of [-1, 1]) {
    ellipse(head, 'Headphone oval cushion', earCushion, [side * .437, -.027, -.070], [.061, .141, .106]);
    ellipse(head, 'Satin headphone shell', headset, [side * .480, -.027, -.070], [.043, .132, .097]);
    const hinge = add(head, 'Brushed headphone hinge', new CylinderGeometry(.034, .034, .031, 32), metal, [side * .459, .095, -.068]);
    hinge.rotation.z = Math.PI / 2;
    const emblem = add(head, 'Headphone quiet ring', new TorusGeometry(.042, .0032, 8, 36), metal, [side * .513, -.031, -.069]);
    emblem.rotation.y = Math.PI / 2;
  }

  // Continuous shoulders and jacket silhouette, with rounded lapels and tee neckline.
  add(body, 'Continuous studio jacket silhouette', profileGeometry([
    [.04, .002, .004], [.10, .425, .170], [.18, .628, .229],
    [.31, .712, .274], [.48, .743, .294], [.67, .719, .283],
    [.84, .655, .254], [.975, .550, .215], [1.065, .374, .178],
    [1.105, .177, .131], [1.117, .135, .110],
  ]), jacket);
  const teeShape = new Shape();
  teeShape.moveTo(-.140, 1.008);
  teeShape.lineTo(-.245, .894);
  teeShape.lineTo(-.240, .452);
  teeShape.quadraticCurveTo(-.219, .195, -.160, .172);
  teeShape.quadraticCurveTo(0, .144, .160, .172);
  teeShape.quadraticCurveTo(.219, .195, .240, .452);
  teeShape.lineTo(.245, .894);
  teeShape.lineTo(.140, 1.008);
  teeShape.quadraticCurveTo(0, 1.002, -.140, 1.008);
  add(body, 'Soft rounded cream tee front', new ExtrudeGeometry(teeShape, { depth: .018, bevelEnabled: true, bevelSize: .012, bevelThickness: .006, bevelSegments: 5, curveSegments: 24 }), tee, [0, 0, .278]);
  const neckRing = add(body, 'Tee round collar binding', new TorusGeometry(.136, .012, 10, 56), tee, [0, 1.011, .268]);
  neckRing.rotation.x = Math.PI / 2;
  for (const side of [-1, 1]) {
    const panel = add(body, 'Rounded tailored jacket lapel', lapelPanel([
      [side * .169, 1.090], [side * .362, 1.011], [side * .397, .924],
      [side * .277, .880], [side * .358, .812], [side * .105, .439], [side * .130, .841],
    ]), jacketLapel, [0, 0, .259]);
    panel.rotation.y = side * .15;
    add(body, 'Quiet lapel stitch', curve([[side * .180, 1.047, .290], [side * .330, .946, .294], [side * .270, .885, .300], [side * .326, .810, .300], [side * .120, .450, .280]], .0012), trim);
    add(body, 'Soft jacket shoulder seam', curve([[side * .242, 1.081, .114], [side * .461, 1.006, .133], [side * .608, .868, .176], [side * .704, .656, .157]], .002), jacketLapel);
  }
  const badge = add(body, 'Lavender studio badge', new TorusGeometry(.023, .0032, 8, 32), metal, [.276, .933, .285]);
  badge.rotation.z = Math.PI / 4;
  const plinth = add(root, 'Small rounded bust base', new CylinderGeometry(.420, .435, .035, 72), jacketLapel, [0, .035, 0]);
  plinth.material = jacketLapel;
  [jacket, jacketLapel, tee].forEach(material => { material.side = DoubleSide; });
  root.updateMatrixWorld(true);
  return { root, head, body, eyes };
}

export function disposeStudioCharacter(root: Group) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<MeshStandardMaterial>();
  root.traverse(object => {
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry);
    const list = Array.isArray(object.material) ? object.material : [object.material];
    list.forEach(material => materials.add(material as MeshStandardMaterial));
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
}

export default function StudioCharacter({ onReady }: { onReady: () => void }) {
  const model = useMemo(createStudioCharacter, []);
  const target = useRef({ x: -.035, y: -.075 });
  const ready = useRef(onReady);
  const readyFrame = useRef<number | null>(null);
  ready.current = onReady;
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const leave = () => { target.current = { x: -.035, y: -.075 }; invalidate(); };
    const move = (event: PointerEvent) => {
      if (reduced.matches || event.pointerType === 'touch') return;
      const bounds = canvas.getBoundingClientRect();
      target.current = {
        x: -.035 + MathUtils.clamp(((event.clientY - bounds.top) / bounds.height - .5) * .16, -.075, .075),
        y: -.075 + MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - .5) * .6, -.25, .25),
      };
      invalidate();
    };
    const motionChange = () => { if (reduced.matches) leave(); };
    canvas.addEventListener('pointermove', move, { passive: true });
    canvas.addEventListener('pointerleave', leave);
    reduced.addEventListener('change', motionChange);
    return () => {
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      reduced.removeEventListener('change', motionChange);
      if (readyFrame.current !== null) cancelAnimationFrame(readyFrame.current);
    };
  }, [gl, invalidate]);
  useEffect(() => () => disposeStudioCharacter(model.root), [model]);
  useFrame((_, delta) => {
    if (document.hidden) return;
    if (readyFrame.current === null) readyFrame.current = requestAnimationFrame(() => ready.current());
    const blend = 1 - Math.exp(-7 * Math.min(delta, .1));
    model.head.rotation.x = MathUtils.lerp(model.head.rotation.x, target.current.x, blend);
    model.head.rotation.y = MathUtils.lerp(model.head.rotation.y, target.current.y, blend);
    model.body.rotation.y = MathUtils.lerp(model.body.rotation.y, -.055 + (target.current.y + .075) * .10, blend);
    model.eyes.position.x = MathUtils.lerp(model.eyes.position.x, (target.current.y + .075) * .025, blend);
    model.eyes.position.y = MathUtils.lerp(model.eyes.position.y, -(target.current.x + .035) * .02, blend);
    if (Math.abs(model.head.rotation.x - target.current.x) + Math.abs(model.head.rotation.y - target.current.y) > .0006) invalidate();
  });
  return <primitive object={model.root} dispose={null} />;
}
