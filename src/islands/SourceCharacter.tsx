import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import {
  AnimationClip, AnimationMixer, BufferGeometry, Group, LoopOnce, Material, MathUtils,
  Mesh, Object3D, Quaternion, Skeleton, SkinnedMesh, Texture, Vector3,
} from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';

export const sourceCharacterUrl = '/models/source-character.glb';

/** Authored rig pose; the supplied asset does not contain a standing animation. */
function createStandingPose(root: Group, relaxedHands: { bone: Object3D; quaternion: Quaternion }[]) {
  const names = ['spine', 'thighL', 'thighR', 'shinL', 'shinR', 'footL', 'footR', 'upper_armL', 'upper_armR', 'forearmL', 'forearmR'];
  const bones = names.map(name => root.getObjectByName(name)).filter((bone): bone is Object3D => Boolean(bone));
  bones.push(...relaxedHands.map(({ bone }) => bone));
  const saved = bones.map(bone => ({ bone, quaternion: bone.quaternion.clone(), position: bone.position.clone() }));
  // Typing wrists/fingers must not leak into the standing greeting. Retain the
  // asset's natural hand axes instead of straightening every finger to zero.
  relaxedHands.forEach(({ bone, quaternion }) => { bone.quaternion.copy(quaternion); });
  const orientLimb = (name: string, direction: Vector3, twist = 0) => {
    const limb = root.getObjectByName(name)!;
    root.updateMatrixWorld(true);
    direction.normalize();
    const desired = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction);
    desired.premultiply(new Quaternion().setFromAxisAngle(direction, twist));
    limb.quaternion.copy(limb.parent!.getWorldQuaternion(new Quaternion()).invert().multiply(desired));
  };
  const hip = root.getObjectByName('spine')!;
  hip.rotation.set(0, 0, 0); hip.position.y = 7.3; hip.position.z = 0;
  for (const side of ['L', 'R']) {
    root.getObjectByName(`thigh${side}`)!.rotation.set(Math.PI, 0, 0);
    root.getObjectByName(`shin${side}`)!.rotation.set(0, 0, 0);
    root.getObjectByName(`foot${side}`)!.rotation.set(-Math.PI / 2, 0, 0);
  }
  // A small open-hand greeting gives the silhouette purpose. The relaxed arm
  // has its own elbow bend and roll so the sleeve and palm do not turn inward.
  orientLimb('upper_armL', new Vector3(.6, -.85, .1));
  orientLimb('forearmL', new Vector3(.22, .92, .24));
  orientLimb('upper_armR', new Vector3(-.20, -1, .04), -.45);
  orientLimb('forearmR', new Vector3(-.12, -1, .18), 1.35);
  const standing = saved.map(({ bone }) => ({ bone, quaternion: bone.quaternion.clone(), position: bone.position.clone(), arm: /^(?:upper_arm|forearm|hand|palm|thumb|f_)/.test(bone.name), loweredQuaternion: undefined as Quaternion | undefined }));
  // Route the greeting hand outside the face while lowering. A direct shortest
  // rotation from greeting to typing would sweep the palm across the mouth.
  orientLimb('upper_armL', new Vector3(.75, -.66, .14));
  orientLimb('forearmL', new Vector3(.8, -.25, .58));
  for (const entry of standing) {
    if (entry.bone.name === 'upper_armL' || entry.bone.name === 'forearmL') entry.loweredQuaternion = entry.bone.quaternion.clone();
  }
  saved.forEach(({ bone, quaternion, position }) => { bone.quaternion.copy(quaternion); bone.position.copy(position); });
  return standing;
}

export function applyStandingBlend(model: { root: Group; standing: ReturnType<typeof createStandingPose> }, seated: number) {
  model.standing.forEach(({ bone, quaternion, position, arm, loweredQuaternion }) => {
    // Settle hands toward their source placement as the desk arrives, before
    // the hips finish sitting; otherwise a relaxed hand passes below the desk.
    const blend = arm ? Math.min(1, seated / .65) : seated;
    if (loweredQuaternion) {
      if (blend < .45) bone.quaternion.copy(quaternion).slerp(loweredQuaternion, blend / .45);
      else bone.quaternion.slerp(loweredQuaternion, (1 - blend) / .55);
    } else bone.quaternion.slerp(quaternion, 1 - blend);
    bone.position.lerp(position, 1 - seated);
  });
  for (const object of model.root.children) if (object.name !== 'metarig002' && object.name !== 'Plane004' && object.name !== 'screenlight') object.visible = seated > .58;
  model.root.updateMatrixWorld(true);
}

/** The owner confirmed permission to use Moncy Yohannan's supplied avatar. */
export function prepareSourceCharacter(gltf: GLTF) {
  const root = gltf.scene;
  const relaxedHands: { bone: Object3D; quaternion: Quaternion }[] = [];
  root.traverse(bone => {
    if (/^(?:hand|palm|thumb|f_)/.test(bone.name)) relaxedHands.push({ bone, quaternion: bone.quaternion.clone() });
  });
  const mixer = new AnimationMixer(root);
  const intro = gltf.animations.find(clip => clip.name === 'introAnimation');
  let pose;
  if (intro) {
    pose = mixer.clipAction(intro);
    pose.setLoop(LoopOnce, 1);
    pose.clampWhenFinished = true;
    pose.play();
    mixer.setTime(intro.duration);
    pose.paused = true;
  }
  // The source's monitor would cover the face in this portrait composition.
  root.getObjectByName('Plane004')?.traverse(object => { object.visible = false; });
  root.getObjectByName('screenlight')?.traverse(object => { object.visible = false; });
  root.rotation.y = -.08;
  root.updateMatrixWorld(true);
  const head = root.getObjectByName('spine006');
  const rest = head ? { x: head.rotation.x, y: head.rotation.y } : { x: 0, y: 0 };
  const typingClip = gltf.animations.find(clip => clip.name === 'typing');
  const typing = typingClip ? mixer.clipAction(new AnimationClip('Scroll typing', typingClip.duration, typingClip.tracks.filter(track => /(?:arm|hand|palm|thumb|f_|thigh|shin|toe|heel)/i.test(track.name)))) : undefined;
  const keys = gltf.animations.filter(clip => ['key1', 'key2', 'key5', 'key6'].includes(clip.name)).map(clip => mixer.clipAction(clip));
  const standing = createStandingPose(root, relaxedHands);
  const model = { root, head, rest, mixer, pose, typing, keys, standing, introDuration: intro?.duration ?? 0 };
  applyStandingBlend(model, 0);
  return model;
}

/** Each mount owns its parsed model; release shared maps/geometries only once. */
export function disposeSourceCharacter(root: Group) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  const skeletons = new Set<Skeleton>();
  const images = new Set<{ close: () => void }>();
  root.traverse((object: Object3D) => {
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry);
    const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
    meshMaterials.forEach(material => {
      materials.add(material);
      Object.values(material).forEach(value => {
        if (!(value instanceof Texture)) return;
        textures.add(value);
        const image = value.source.data;
        if (image && typeof image.close === 'function') images.add(image);
      });
    });
    if (object instanceof SkinnedMesh) skeletons.add(object.skeleton);
  });
  skeletons.forEach(skeleton => skeleton.dispose());
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
  textures.forEach(texture => texture.dispose());
  images.forEach(image => image.close());
}

type PreparedCharacter = ReturnType<typeof prepareSourceCharacter>;

export default function SourceCharacter({ onReady, active }: { onReady: () => void; active: boolean }) {
  const [model, setModel] = useState<PreparedCharacter | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const appliedProgress = useRef(0);
  const ready = useRef(onReady);
  const readyFrame = useRef<number | null>(null);
  ready.current = onReady;
  const { gl, invalidate } = useThree();

  useEffect(() => () => {
    if (readyFrame.current !== null) cancelAnimationFrame(readyFrame.current);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;
    let owned: PreparedCharacter | null = null;
    const load = async () => {
      try {
        const response = await fetch(sourceCharacterUrl, { signal: controller.signal });
        if (!response.ok) throw new Error('The avatar model is unavailable.');
        const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), '/models/');
        owned = prepareSourceCharacter(gltf);
        if (disposed) {
          owned.mixer.stopAllAction();
          owned.mixer.uncacheRoot(owned.root);
          disposeSourceCharacter(owned.root);
          return;
        }
        setModel(owned);
        invalidate();
      } catch (cause) {
        if (!disposed) setError(cause instanceof Error ? cause : new Error('The avatar could not initialize.'));
      }
    };
    void load();
    return () => {
      disposed = true;
      controller.abort();
      if (owned) {
        owned.mixer.stopAllAction();
        owned.mixer.uncacheRoot(owned.root);
        disposeSourceCharacter(owned.root);
      }
    };
  }, [invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = canvas.closest<HTMLElement>('.spatial-hero');
    const syncScroll = () => {
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      const desktop = window.matchMedia('(min-width: 1101px)').matches;
      const progress = reduced.matches ? 0 : MathUtils.clamp(-bounds.top / Math.max(1, bounds.height * (desktop ? 1.6 : .65)), 0, 1);
      if (progress !== scrollProgress.current) { scrollProgress.current = progress; if (active) invalidate(); }
    };
    const leave = () => { target.current = { x: 0, y: 0 }; invalidate(); };
    const move = (event: PointerEvent) => {
      if (!active || reduced.matches || event.pointerType === 'touch') return;
      const bounds = canvas.getBoundingClientRect();
      target.current = {
        x: MathUtils.clamp(((event.clientY - bounds.top) / bounds.height - .5) * .20, -.10, .10),
        y: MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - .5) * .56, -.25, .25),
      };
      invalidate();
    };
    const motionChange = () => { if (reduced.matches) leave(); syncScroll(); };
    window.addEventListener('pointermove', move, { passive: true });
    canvas.addEventListener('pointerleave', leave);
    reduced.addEventListener('change', motionChange);
    window.addEventListener('scroll', syncScroll, { passive: true });
    window.addEventListener('resize', syncScroll, { passive: true });
    syncScroll();
    return () => {
      window.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      reduced.removeEventListener('change', motionChange);
      window.removeEventListener('scroll', syncScroll);
      window.removeEventListener('resize', syncScroll);
    };
  }, [active, gl, invalidate]);

  useFrame((_, delta) => {
    if (!model || !active || document.hidden) return;
    if (readyFrame.current === null) readyFrame.current = requestAnimationFrame(() => ready.current());
    const progress = scrollProgress.current;
    if (Math.abs(appliedProgress.current - progress) > .00001) {
      if (model.pose) {
        model.pose.reset().play();
        model.mixer.setTime(MathUtils.lerp(model.introDuration, Math.min(.75, model.introDuration), progress));
        model.pose.paused = true;
        const typingProgress = MathUtils.clamp((progress - .35) / .65, 0, 1);
        if (model.typing && typingProgress > 0) {
          model.typing.reset().play(); model.typing.time = typingProgress * model.typing.getClip().duration;
          model.typing.paused = true; model.typing.setEffectiveWeight(Math.min(1, typingProgress * 3));
        } else model.typing?.stop();
        model.keys.forEach(key => { if (typingProgress > 0) { key.reset().play(); key.time = typingProgress * key.getClip().duration; key.paused = true; } else key.stop(); });
        model.mixer.update(0);
        const seated = MathUtils.smoothstep(progress, .10, .60);
        applyStandingBlend(model, seated);
        gl.domElement.dataset.pose = seated < .05 ? 'standing' : seated > .95 ? 'seated' : 'transition';
        if (model.head) { model.rest.x = model.head.rotation.x; model.rest.y = model.head.rotation.y; }
      }
      model.root.rotation.y = -.08 + progress * .42;
      model.root.rotation.x = progress * .04;
      model.root.position.y = progress * -.4;
      appliedProgress.current = progress;
    }
    if (!gl.domElement.dataset.pose) gl.domElement.dataset.pose = 'standing';
    if (!model.head) return;
    const blend = 1 - Math.exp(-7 * Math.min(delta, .1));
    const x = model.rest.x + target.current.x;
    const y = model.rest.y + target.current.y;
    model.head.rotation.x = MathUtils.lerp(model.head.rotation.x, x, blend);
    model.head.rotation.y = MathUtils.lerp(model.head.rotation.y, y, blend);
    if (Math.abs(model.head.rotation.x - x) + Math.abs(model.head.rotation.y - y) > .0006) invalidate();
  });
  if (error) throw error;
  return model ? <primitive object={model.root} dispose={null} /> : null;
}
