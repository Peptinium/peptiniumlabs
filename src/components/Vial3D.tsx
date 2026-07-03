import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF, ContactShadows, Float, OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import vialAsset from "@/assets/peptinium_vial.glb.asset.json";

useGLTF.preload(vialAsset.url);

function VialModel({ autoRotate }: { autoRotate: boolean }) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(vialAsset.url);

  useFrame((_state, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={ref} scale={1.6} position={[0, -0.6, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Vial3DInner() {
  const [interacting, setInteracting] = useState(false);
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 3.6], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 3]} intensity={1.1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#a5b4fc" />
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3} enabled={!interacting}>
          <VialModel autoRotate={!interacting} />
        </Float>
        <ContactShadows position={[0, -1.35, 0]} opacity={0.35} scale={6} blur={2.8} far={2} />
        <Environment preset="studio" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.7}
          onStart={() => setInteracting(true)}
          onEnd={() => setInteracting(false)}
        />
      </Suspense>
    </Canvas>
  );
}

// Default export so React.lazy can pick it up
export default Vial3DInner;
