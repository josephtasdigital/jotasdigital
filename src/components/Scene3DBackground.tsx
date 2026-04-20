import React, { Component, ReactNode, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

// Module-level scroll tracker (updated by passive listener)
const scrollState = { current: 0, progress: 0 };

// --- Error boundary -----------------------------------------------------------
class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    // Silent fail — fallback gradient stays visible
    console.warn("[Scene3DBackground] WebGL/R3F failed, using fallback:", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// --- Wireframe mesh -----------------------------------------------------------
function WireframeMesh({ detail }: { detail: 0 | 1 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const scrollBoost = scrollState.current * 0.0008;
    // Base slow auto-rotation + scroll-accelerated rotation
    meshRef.current.rotation.x += delta * 0.08 + scrollBoost;
    meshRef.current.rotation.y += delta * 0.12 + scrollBoost * 1.4;

    // Morph distortion based on scroll progress (0 → 1)
    if (matRef.current) {
      const target = 0.25 + scrollState.current * 0.0006;
      matRef.current.distort = THREE.MathUtils.lerp(
        matRef.current.distort ?? 0.25,
        Math.min(target, 0.75),
        0.05
      );
    }
  });

  return (
    <Icosahedron ref={meshRef} args={[2.2, detail]}>
      <MeshDistortMaterial
        ref={matRef}
        wireframe
        color="hsl(175, 80%, 50%)"
        emissive="hsl(175, 80%, 50%)"
        emissiveIntensity={0.6}
        distort={0.25}
        speed={1.2}
        transparent
        opacity={0.55}
      />
    </Icosahedron>
  );
}

// --- Scene --------------------------------------------------------------------
function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <fog attach="fog" args={["#0a0f1a", 4, 12]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="hsl(175, 80%, 50%)" />
      <pointLight position={[-5, -3, -2]} intensity={0.6} color="hsl(175, 80%, 60%)" />
      <WireframeMesh detail={isMobile ? 0 : 1} />
    </>
  );
}

// --- Public component ---------------------------------------------------------
const Scene3DBackground: React.FC = () => {
  const isMobile = useIsMobile();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      scrollState.current = window.scrollY;
      scrollState.progress = Math.min(1, Math.max(0, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      {/* Fallback gradient — always rendered underneath */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-background to-slate-950" />

      {!reducedMotion && (
        <CanvasErrorBoundary>
          <Canvas
            style={{ width: "100vw", height: "100vh" }}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 6], fov: 55 }}
            performance={{ min: 0.5 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <Scene isMobile={isMobile} />
          </Canvas>
        </CanvasErrorBoundary>
      )}

      {/* Blur/shade overlay to keep it abstract behind text */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-background/20" />
    </div>
  );
};

export default Scene3DBackground;
