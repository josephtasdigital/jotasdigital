import React, { Component, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

// Module-level scroll tracker (updated by passive listener)
const scrollState = { current: 0, progress: 0, sectionIndex: 0, active: true };

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
    console.warn("[Scene3DBackground] WebGL/R3F failed, using fallback:", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// --- Geometry factory: build a list of shape geometries ----------------------
function useShapeGeometries(detail: 0 | 1) {
  return useMemo(() => {
    const radius = 2.2;
    return [
      new THREE.IcosahedronGeometry(radius, detail === 0 ? 1 : 2),
      new THREE.TorusKnotGeometry(radius * 0.75, 0.55, detail === 0 ? 64 : 128, detail === 0 ? 8 : 16),
      new THREE.OctahedronGeometry(radius, detail === 0 ? 1 : 2),
      new THREE.TorusGeometry(radius * 0.85, 0.5, detail === 0 ? 10 : 16, detail === 0 ? 32 : 64),
      new THREE.DodecahedronGeometry(radius, detail === 0 ? 0 : 1),
      new THREE.SphereGeometry(radius, detail === 0 ? 16 : 28, detail === 0 ? 12 : 20),
    ];
  }, [detail]);
}

// --- Dotted morphing shape ---------------------------------------------------
function DottedShape({ detail }: { detail: 0 | 1 }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const geometries = useShapeGeometries(detail);

  // Pre-extract position arrays for all shapes; pad to same length for morphing.
  const { mergedPositions, maxCount } = useMemo(() => {
    const positionsList = geometries.map((g) => {
      const pos = g.getAttribute("position") as THREE.BufferAttribute;
      return new Float32Array(pos.array);
    });
    const maxCount = Math.max(...positionsList.map((p) => p.length / 3));
    // Pad each to maxCount points by repeating
    const padded = positionsList.map((arr) => {
      if (arr.length / 3 === maxCount) return arr;
      const out = new Float32Array(maxCount * 3);
      for (let i = 0; i < maxCount; i++) {
        const src = (i % (arr.length / 3)) * 3;
        out[i * 3] = arr[src];
        out[i * 3 + 1] = arr[src + 1];
        out[i * 3 + 2] = arr[src + 2];
      }
      return out;
    });
    return { mergedPositions: padded, maxCount };
  }, [geometries]);

  // Active geometry buffer that we lerp into
  const activePositions = useMemo(() => new Float32Array(maxCount * 3), [maxCount]);
  useEffect(() => {
    activePositions.set(mergedPositions[0]);
  }, [activePositions, mergedPositions]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(activePositions, 3));
    return g;
  }, [activePositions]);

  const lastIndex = useRef(0);
  const transitionT = useRef(1); // 1 = settled

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const scrollBoost = scrollState.current * 0.0006;
    groupRef.current.rotation.x += delta * 0.08 + scrollBoost;
    groupRef.current.rotation.y += delta * 0.12 + scrollBoost * 1.4;

    // Pulsing scale tied to scroll progress for "morph" feel
    const pulse = 1 + Math.sin(performance.now() * 0.0008) * 0.04 + scrollState.progress * 0.08;
    groupRef.current.scale.setScalar(pulse);

    // Detect section change → start a fresh transition
    const targetIndex = scrollState.sectionIndex % mergedPositions.length;
    if (targetIndex !== lastIndex.current) {
      lastIndex.current = targetIndex;
      transitionT.current = 0;
    }

    // Animate morph between previous active positions and new target
    if (transitionT.current < 1) {
      transitionT.current = Math.min(1, transitionT.current + delta * 0.6);
      const target = mergedPositions[targetIndex];
      const t = transitionT.current;
      // ease-in-out cubic
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      for (let i = 0; i < activePositions.length; i++) {
        activePositions[i] = activePositions[i] + (target[i] - activePositions[i]) * e * 0.15;
      }
      (geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          color={new THREE.Color("hsl(175, 80%, 55%)")}
          size={0.06}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// --- Scene --------------------------------------------------------------------
function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <fog attach="fog" args={["#0a0f1a", 5, 14]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="hsl(175, 80%, 50%)" />
      <pointLight position={[-5, -3, -2]} intensity={0.6} color="hsl(175, 80%, 60%)" />
      <DottedShape detail={isMobile ? 0 : 1} />
    </>
  );
}

// --- Public component ---------------------------------------------------------
const Scene3DBackground: React.FC = () => {
  const isMobile = useIsMobile();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  // Observe Hero and Contact sections — only render Canvas when one is in view
  useEffect(() => {
    const ids = ["hero", "contact"];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;

    const visibility = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visibility.set(e.target, e.isIntersecting));
        const anyVisible = Array.from(visibility.values()).some(Boolean);
        setActive(anyVisible);
        scrollState.active = anyVisible;
      },
      { rootMargin: "0px", threshold: 0.01 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const computeSection = () => {
      // Only Hero (0) and Contact (1) drive shape choice now
      const hero = document.getElementById("hero");
      const contact = document.getElementById("contact");
      if (!hero || !contact) return 0;
      const center = window.scrollY + window.innerHeight / 2;
      const dHero = Math.abs(center - (hero.offsetTop + hero.offsetHeight / 2));
      const dContact = Math.abs(center - (contact.offsetTop + contact.offsetHeight / 2));
      return dContact < dHero ? 1 : 0;
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight || 1;
        scrollState.current = window.scrollY;
        scrollState.progress = Math.min(1, Math.max(0, window.scrollY / max));
        scrollState.sectionIndex = computeSection();
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const showCanvas = !reducedMotion && active;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      {/* Fallback gradient — always rendered underneath */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-background to-slate-950" />

      {showCanvas && (
        <CanvasErrorBoundary>
          <Canvas
            style={{ width: "100vw", height: "100vh" }}
            dpr={[1, isMobile ? 1 : 1.25]}
            camera={{ position: [0, 0, 6], fov: 55 }}
            performance={{ min: 0.5 }}
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          >
            <Scene isMobile={isMobile} />
          </Canvas>
        </CanvasErrorBoundary>
      )}

      {/* Lighter overlay — keeps shape visible without competing with text */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-background/10" />
    </div>
  );
};

export default Scene3DBackground;
