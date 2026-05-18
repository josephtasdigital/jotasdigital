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

// --- Particle globe ---------------------------------------------------------
type GlobeProps = {
  // 0 = top of page, 1 = bottom of page (absolute window scroll depth)
  progressRef: React.MutableRefObject<number>;
  isMobile: boolean;
};

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smoothstep = (k: number) => {
  const c = Math.max(0, Math.min(1, k));
  return c * c * (3 - 2 * c);
};

function ParticleGlobe({ progressRef, isMobile }: GlobeProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const count = isMobile ? 1400 : 2600;
  const radius = 2.2;

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

  const livePositions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(livePositions, 3));
    return g;
  }, [livePositions]);

  // Smoothed values
  const smoothScatter = useRef(0);
  const smoothScale = useRef(1);
  const smoothOpacity = useRef(0.95);
  const smoothRotSpeed = useRef(0.15);

  // Targets for each phase
  // Phase 1 (0 - 0.30):  scale 1 → 1.6 (Red Giant grow), scatter 0 → 1.5
  // Phase 2 (0.30 - 0.75): hold Red Giant
  // Phase 3 (0.75 - 0.90): contraction → 0.5 scale, scatter → 0
  // Phase 4 (0.90 - 0.95): explosion spike (+20% then violent collapse to 0.1)
  // Phase 5 (0.95 - 1.00): neutron star, tiny dense, faster spin

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const p = Math.max(0, Math.min(1, progressRef.current));

    let targetScatter = 0;
    let targetScale = 1;
    let targetOpacity = 0.95;
    let targetSize = 0.06;
    let targetRotSpeed = 0.15;

    if (p < 0.30) {
      // Phase 1: grow to Red Giant
      const k = smoothstep(p / 0.30);
      targetScatter = lerp(0, 1.5, k);
      targetScale = lerp(1.0, 1.6, k);
      targetOpacity = 0.95;
      targetSize = 0.06;
      targetRotSpeed = 0.15;
    } else if (p < 0.75) {
      // Phase 2: hold Red Giant
      targetScatter = 1.5;
      targetScale = 1.6;
      targetOpacity = 0.95;
      targetSize = 0.06;
      targetRotSpeed = 0.18;
    } else if (p < 0.90) {
      // Phase 3: smooth contraction
      const k = smoothstep((p - 0.75) / 0.15);
      targetScatter = lerp(1.5, 0.0, k);
      targetScale = lerp(1.6, 0.5, k);
      targetOpacity = lerp(0.95, 1.0, k);
      targetSize = lerp(0.06, 0.07, k);
      targetRotSpeed = lerp(0.18, 0.3, k);
    } else if (p < 0.95) {
      // Phase 4: explosion spike then violent collapse
      const k = (p - 0.90) / 0.05; // 0 → 1
      if (k < 0.4) {
        // Rapid expand (+20%)
        const e = k / 0.4;
        targetScatter = lerp(0.0, 0.6, e);
        targetScale = lerp(0.5, 1.92, e); // 1.6 * 1.20
        targetSize = lerp(0.07, 0.085, e);
      } else {
        // Violent collapse down to 10% of original (0.1 scale)
        const e = (k - 0.4) / 0.6;
        const ee = e * e; // accelerate inward
        targetScatter = lerp(0.6, -0.6, ee);
        targetScale = lerp(1.92, 0.1, ee);
        targetSize = lerp(0.085, 0.08, ee);
      }
      targetOpacity = 1.0;
      targetRotSpeed = lerp(0.3, 0.6, k);
    } else {
      // Phase 5: Neutron Star — dense, tiny, faster spin
      targetScatter = -0.6;
      targetScale = 0.1;
      targetOpacity = 1.0;
      targetSize = 0.085;
      targetRotSpeed = 0.9;
    }

    const sm = Math.min(1, delta * 7);
    smoothScatter.current += (targetScatter - smoothScatter.current) * sm;
    smoothScale.current += (targetScale - smoothScale.current) * sm;
    smoothOpacity.current += (targetOpacity - smoothOpacity.current) * sm;
    smoothRotSpeed.current += (targetRotSpeed - smoothRotSpeed.current) * sm;

    pointsRef.current.rotation.y += delta * smoothRotSpeed.current;
    pointsRef.current.scale.setScalar(smoothScale.current);

    const scatter = smoothScatter.current;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      livePositions[i3] = basePositions[i3] + directions[i3] * scatter;
      livePositions[i3 + 1] = basePositions[i3 + 1] + directions[i3 + 1] * scatter;
      livePositions[i3 + 2] = basePositions[i3 + 2] + directions[i3 + 2] * scatter;
    }
    (geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

    if (matRef.current) {
      matRef.current.opacity = smoothOpacity.current;
      matRef.current.size = targetSize;
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

// --- Public component --------------------------------------------------------
const Scene3DBackground: React.FC = () => {
  const isMobile = useIsMobile();
  const [reducedMotion, setReducedMotion] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let ticking = false;
    const compute = () => {
      const doc = document.documentElement;
      const scrollable = (doc.scrollHeight - window.innerHeight) || 1;
      const p = window.scrollY / scrollable;
      progressRef.current = Math.max(0, Math.min(1, p));
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    >
      <CanvasErrorBoundary>
        <Canvas
          style={{ width: "100%", height: "100%" }}
          dpr={[1, isMobile ? 1 : 1.25]}
          camera={{ position: [0, 0, 6], fov: 55 }}
          performance={{ min: 0.5 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.6} />
          <ParticleGlobe progressRef={progressRef} isMobile={isMobile} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

export default Scene3DBackground;
