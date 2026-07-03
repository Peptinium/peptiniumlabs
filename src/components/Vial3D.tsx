import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF, ContactShadows, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Mesh } from "three";
import vialAsset from "@/assets/peptinium_vial.glb.asset.json";

useGLTF.preload(vialAsset.url);

type Variant = "product" | "hero";

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

function VialModel({
  autoRotate,
  interactive,
  variant,
}: {
  autoRotate: boolean;
  interactive: boolean;
  variant: Variant;
}) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(vialAsset.url);

  // Clone once so multiple instances don't share material state
  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Upgrade materials: glass for the outer body, translucent amber for the liquid,
  // subtle metal for the aluminium cap.
  useMemo(() => {
    const glass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f4f7fb"),
      transmission: 1,
      thickness: 0.6,
      roughness: 0.05,
      metalness: 0,
      ior: 1.48,
      attenuationColor: new THREE.Color("#dfe8f5"),
      attenuationDistance: 1.4,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      transparent: true,
      envMapIntensity: 1.2,
    });
    const liquid = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#7fb8ff"),
      transmission: 0.85,
      thickness: 1.2,
      roughness: 0.15,
      metalness: 0,
      ior: 1.33,
      attenuationColor: new THREE.Color("#5ea0ff"),
      attenuationDistance: 0.6,
      transparent: true,
      envMapIntensity: 1,
    });
    const cap = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#c9ccd1"),
      metalness: 0.95,
      roughness: 0.28,
      clearcoat: 0.4,
      envMapIntensity: 1.1,
    });
    const label = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0a0d12"),
      roughness: 0.55,
      metalness: 0.1,
    });

    cloned.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const name = (mesh.name || "").toLowerCase();
      if (name.includes("cap") || name.includes("lid") || name.includes("cork") || name.includes("top") || name.includes("crimp")) {
        mesh.material = cap;
      } else if (name.includes("liquid") || name.includes("water") || name.includes("fluid") || name.includes("content")) {
        mesh.material = liquid;
      } else if (name.includes("label") || name.includes("sticker")) {
        mesh.material = label;
      } else {
        // Default to glass for the vial body
        mesh.material = glass;
      }
    });
  }, [cloned]);

  const scrollY = useScrollY();
  const scrollRot = scrollY * 0.0025;

  useFrame((_state, delta) => {
    if (!ref.current) return;
    if (autoRotate) ref.current.rotation.y += delta * 0.25;
    if (!interactive) {
      // For hero background: fully driven by scroll
      ref.current.rotation.y = scrollRot;
      ref.current.rotation.x = Math.sin(scrollRot * 0.5) * 0.1;
    }
  });

  const scale = variant === "hero" ? 2.1 : 1.6;
  const posY = variant === "hero" ? -0.9 : -0.6;

  return (
    <group ref={ref} scale={scale} position={[0, posY, 0]}>
      <primitive object={cloned} />
    </group>
  );
}

function Vial3DInner({ variant = "product" }: { variant?: Variant }) {
  const [interacting, setInteracting] = useState(false);
  const interactive = variant === "product";
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 3.6], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#a5b4fc" />
        <directionalLight position={[0, -2, 3]} intensity={0.35} color="#67e8f9" />
        <Float
          speed={1.2}
          rotationIntensity={interactive ? 0.15 : 0.05}
          floatIntensity={interactive ? 0.3 : 0.15}
          enabled={!interacting}
        >
          <VialModel autoRotate={interactive && !interacting} interactive={interactive} variant={variant} />
        </Float>
        {interactive && (
          <ContactShadows position={[0, -1.35, 0]} opacity={0.35} scale={6} blur={2.8} far={2} />
        )}
        <Environment preset="studio" />
        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.7}
            onStart={() => setInteracting(true)}
            onEnd={() => setInteracting(false)}
          />
        )}
      </Suspense>
    </Canvas>
  );
}

export default Vial3DInner;
