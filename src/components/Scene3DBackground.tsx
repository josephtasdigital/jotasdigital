import React, { Component, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

// --- Error boundary ----------------------------------------------------------
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[ParticleGlobe] WebGL/R3F failed, using fallback:", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// --- Particle globe (Fibonacci sphere point cloud) ---------------------------
type GlobeProps = {
  // 0 = fully formed/visible, 1 = fully scattered/invisible
  dispersionRef: React.MutableRefObject<number>;
  isMobile: boolean;
};

function ParticleGlobe({ dispersionRef, isMobile }: GlobeProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const count = isMobile ? 1400 : 2600;
  const radius = 2.2;

  // Base positions on a Fibonacci sphere + per-point outward direction for scatter
  const { basePositions, directions } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const dirs = new Float32Array(count * 3);
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      base[i * 3] = x * radius;
      base[i * 3 + 1] = y * radius;
      base[i * 3 + 2] = z * radius;
      dirs[i * 3] = x;
      dirs[i * 3 + 1] = y;
      dirs[i * 3 + 2] = z;
    }
    return { basePositions: base, directions: dirs };
  }, [count]);

  // Live position buffer (mutated each frame)
  const livePositions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(livePositions, 3));
    return g;
  }, [livePositions]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    // Continuous Y-axis rotation
    pointsRef.current.rotation.y += delta * 0.12;

    const d = dispersionRef.current; // 0..1
    // Scale slightly up as it scatters
    const scale = 1 + d * 0.6;
    pointsRef.current.scale.setScalar(scale);

    // Scatter points outward along their normal as d grows
    const scatter = d * 1.5;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      livePositions[i3] = basePositions[i3] + directions[i3] * scatter;
      livePositions[i3 + 1] = basePositions[i3 + 1] + directions[i3 + 1] * scatter;
      livePositions[i3 + 2] = basePositions[i3 + 2] + directions[i3 + 2] * scatter;
    }
    (geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

    if (matRef.current) {
      matRef.current.opacity = Math.max(0, 1 - d) * 0.95;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={matRef}
        color={new THREE.Color("hsl(175, 80%, 60%)")}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// --- A single mounted instance bound to a target section ---------------------
type InstanceProps = {
  targetId: string;
  isMobile: boolean;
};

function GlobeInstance({ targetId, isMobile }: InstanceProps) {
  const dispersionRef = useRef(0);
  const [active, setActive] = useState(false);
  const [containerRect, setContainerRect] = useState<{ top: number; height: number } | null>(null);

  // Track section position + visibility
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setContainerRect({ top: rect.top + window.scrollY, height: rect.height });
    };
    measure();

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setActive(e.isIntersecting)),
      { rootMargin: "200px 0px", threshold: 0.01 }
    );
    io.observe(el);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        // dispersion: 0 when section center is at viewport center, grows as it leaves
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        const norm = Math.min(1, distance / (window.innerHeight * 0.9));
        dispersionRef.current = norm;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      measure();
      onScroll();
    });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [targetId]);

  if (!containerRect) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute left-0 right-0 pointer-events-none overflow-hidden"
      style={{ top: containerRect.top, height: containerRect.height, zIndex: -1 }}
    >
      {active && (
        <CanvasErrorBoundary>
          <Canvas
            style={{ width: "100%", height: "100%" }}
            dpr={[1, isMobile ? 1 : 1.25]}
            camera={{ position: [0, 0, 6], fov: 55 }}
            performance={{ min: 0.5 }}
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          >
            <ambientLight intensity={0.6} />
            <ParticleGlobe dispersionRef={dispersionRef} isMobile={isMobile} />
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  );
}

// --- Public component --------------------------------------------------------
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

  if (reducedMotion) return null;

  return (
    <>
      <GlobeInstance targetId="hero" isMobile={isMobile} />
      <GlobeInstance targetId="contact" isMobile={isMobile} />
    </>
  );
};

export default Scene3DBackground;
