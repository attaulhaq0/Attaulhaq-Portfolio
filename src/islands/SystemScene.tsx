import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Group, MathUtils } from 'three';

function Assembly() {
  const group = useRef<Group>(null);
  const target = useRef({ x: 0.16, y: -0.55 });
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const move = (event: PointerEvent) => {
      if (reduced.matches || event.pointerType === 'touch') return;
      const bounds = canvas.getBoundingClientRect();
      target.current = { x: 0.16 + ((event.clientY - bounds.top) / bounds.height - .5) * .16, y: -.55 + ((event.clientX - bounds.left) / bounds.width - .5) * .5 };
      invalidate();
    };
    const leave = () => { target.current = { x: .16, y: -.55 }; invalidate(); };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    return () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave); };
  }, [gl, invalidate]);
  useFrame((_, delta) => {
    if (!group.current || document.hidden) return;
    const blend = 1 - Math.exp(-8 * delta);
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, target.current.x, blend);
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, target.current.y, blend);
    if (Math.abs(group.current.rotation.y - target.current.y) + Math.abs(group.current.rotation.x - target.current.x) > .001) invalidate();
  });
  return <group ref={group} rotation={[.16, -.55, 0]}>
    {[-1.1, 0, 1.1].map((y, index) => <group key={y} position={[0, y, 0]}>
      <mesh><boxGeometry args={[3.7, .09, 2.7]} /><meshStandardMaterial color={index === 1 ? '#315e55' : '#66817c'} metalness={.65} roughness={.32} transparent opacity={.52} /></mesh>
      <mesh position={[0, .057, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.66, 2.66]} /><meshBasicMaterial color="#a4dac9" wireframe transparent opacity={.3} /></mesh>
      {[-1.65, 1.65].flatMap(x => [-1.12, 1.12].map(z => <mesh key={`${x}-${z}`} position={[x, .05, z]}><cylinderGeometry args={[.04, .04, .15, 8]} /><meshStandardMaterial color="#d8e9db" metalness={.8} roughness={.2} /></mesh>))}
    </group>)}
    {[-1.65, 1.65].flatMap(x => [-1.12, 1.12].map(z => <mesh key={`${x}-${z}`} position={[x, 0, z]}><cylinderGeometry args={[.013, .013, 2.6, 6]} /><meshStandardMaterial color="#a5c7b8" metalness={.5} roughness={.4} /></mesh>))}
    <mesh position={[0, .53, 0]} rotation={[0, Math.PI / 4, 0]}><octahedronGeometry args={[.73, 0]} /><meshStandardMaterial color="#88d6c4" emissive="#335d50" emissiveIntensity={.55} metalness={.45} roughness={.27} flatShading /></mesh>
    <mesh position={[0, -1.35, 0]}><boxGeometry args={[4, .16, 3]} /><meshStandardMaterial color="#253936" metalness={.6} roughness={.5} /></mesh>
    {[-.7, 0, .7].map(x => <mesh key={x} position={[x, -.52, 0]}><boxGeometry args={[.35, .1, .6]} /><meshStandardMaterial color="#88d6c4" metalness={.3} roughness={.4} /></mesh>)}
  </group>;
}

export default function SystemScene({ onReady }: { onReady: () => void }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let onScreen = true;
    const sync = () => setVisible(onScreen && !document.hidden);
    const observer = new IntersectionObserver(entries => { onScreen = entries[0].isIntersecting; sync(); });
    if (wrapper.current) observer.observe(wrapper.current);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);
  return <div ref={wrapper} style={{ width: '100%', height: '100%' }} aria-hidden="true">
    <Canvas frameloop={visible ? 'demand' : 'never'} dpr={[1, 1.5]} camera={{ position: [5.5, 4, 6.5], fov: 36 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} onCreated={({ gl }) => { gl.setClearColor('#101619', 0); onReady(); }}>
      <ambientLight intensity={1.8} /><directionalLight position={[3, 6, 3]} intensity={3} color="#e9fff0" /><directionalLight position={[-4, 1, -3]} intensity={2} color="#88d6c4" /><Assembly />
    </Canvas>
  </div>;
}
