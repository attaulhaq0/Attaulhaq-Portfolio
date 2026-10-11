import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import SourceCharacter from './SourceCharacter';

function PortraitCamera() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const sync = () => {
      const hero = document.querySelector<HTMLElement>('.spatial-hero');
      const desktop = window.matchMedia('(min-width: 1101px) and (prefers-reduced-motion: no-preference)').matches;
      const bounds = hero?.getBoundingClientRect();
      const progress = desktop && bounds ? Math.max(0, Math.min(1, -bounds.top / bounds.height)) : 0;
      const distance = size.width / size.height < .6 ? 52 : 50;
      camera.position.set(0, 9 - progress * .3, distance - progress * 5);
      camera.lookAt(0, 8, 0);
      camera.updateProjectionMatrix(); invalidate();
    };
    sync(); window.addEventListener('scroll', sync, { passive: true });
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)'); motion.addEventListener('change', sync);
    return () => { window.removeEventListener('scroll', sync); motion.removeEventListener('change', sync); };
  }, [camera, size.width, size.height, invalidate]);
  return null;
}

export default function SystemScene({ onReady }: { onReady: () => void }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let onScreen = true;
    const sync = () => setVisible(onScreen && !document.hidden && wrapper.current?.closest<HTMLElement>('#hero-canvas')?.dataset.journeyStage !== 'complete');
    const observer = new IntersectionObserver(entries => {
      onScreen = entries[0]?.isIntersecting ?? false;
      sync();
    });
    if (wrapper.current) observer.observe(wrapper.current);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('scroll', sync, { passive: true });
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); window.removeEventListener('scroll', sync); };
  }, []);

  return <div ref={wrapper} style={{ width: '100%', height: '100%' }} aria-hidden="true">
    <Canvas frameloop={visible ? 'demand' : 'never'} dpr={[1, 1.5]}
      camera={{ position: [0, 11.55, 27.5], fov: 20, near: .05, far: 100 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#100b18', 0);
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        gl.outputColorSpace = SRGBColorSpace;
      }}>
      <PortraitCamera />
      <ambientLight intensity={.50} color="#dbd4ec" />
      <hemisphereLight args={['#e2dcf5', '#24192f', .82]} />
      <directionalLight position={[10, 17, 20]} intensity={2.25} color="#fff0df" />
      <directionalLight position={[-10, 13, 10]} intensity={.60} color="#b3a7e9" />
      <directionalLight position={[-6, 17, -12]} intensity={3.5} color="#b38aff" />
      <directionalLight position={[8, 10, -10]} intensity={2.0} color="#e2a0e9" />
      <SourceCharacter onReady={onReady} active={visible} />
    </Canvas>
  </div>;
}
