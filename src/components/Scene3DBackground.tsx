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
type Mode = "hero" | "contact";

type GlobeProps = {
  // Hero: 0 = formed/visible, 1 = scattered/invisible
  // Contact: 0 = entry, 1 = end-of-section (drives explosion -> neutron star)
  progressRef: React.MutableRefObject<number>;
  isMobile: boolean;
  mode: Mode;
};

function ParticleGlobe({ progressRef, isMobile, mode }: GlobeProps) {
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

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.15;

    const p = Math.max(0, Math.min(1, progressRef.current));

    let targetScatter = 0;
    let targetScale = 1;
    let targetOpacity = 0.95;
    let targetSize = 0.06;

    if (mode === "hero") {
      // existing behavior: outward scatter + fade as you scroll away
      targetScatter = p * 1.5;
      targetScale = 1 + p * 0.6;
      targetOpacity = Math.max(0, 1 - p) * 0.95;
      targetSize = 0.06;
    } else {
      // contact: explosion -> collapse -> neutron star
      // Phases tuned so neutron-star state locks in by the time the
      // section is fully docked in the viewport (p ~ 0.7+).
      if (p < 0.45) {
        // mini explosion: rapid outward expand as section enters
        const k = p / 0.45; // 0..1
        targetScatter = k * 1.2;
        targetScale = 1 + k * 0.35;
        targetOpacity = 0.95;
      } else if (p < 0.7) {
        // violent collapse inward
        const k = (p - 0.45) / 0.25; // 0..1
        const ease = k * k; // accelerating
        targetScatter = 1.2 - ease * 1.7; // 1.2 -> -0.5
        targetScale = 1.35 - ease * 1.0; // 1.35 -> 0.35
        targetOpacity = 0.95;
      } else {
        // dense neutron star — stable, rotating
        targetScatter = -0.5;
        targetScale = 0.35;
        targetOpacity = 1.0;
        targetSize = 0.075;
      }
    }

    // smooth toward target
    const lerp = Math.min(1, delta * 6);
    smoothScatter.current += (targetScatter - smoothScatter.current) * lerp;
    smoothScale.current += (targetScale - smoothScale.current) * lerp;
    smoothOpacity.current += (targetOpacity - smoothOpacity.current) * lerp;

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

// --- A single mounted instance bound to a target section ---------------------
type InstanceProps = {
  targetId: string;
  isMobile: boolean;
  mode: Mode;
};

function GlobeInstance({ targetId, isMobile, mode }: InstanceProps) {
  const progressRef = useRef(0);
  const [active, setActive] = useState(false);
  const [containerRect, setContainerRect] = useState<{ top: number; height: number } | null>(null);

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
        const vh = window.innerHeight;
        if (mode === "hero") {
          const sectionCenter = rect.top + rect.height / 2;
          const viewportCenter = vh / 2;
          const distance = Math.abs(sectionCenter - viewportCenter);
          progressRef.current = Math.min(1, distance / (vh * 0.9));
        } else {
          // contact: anchor progress to section TOP crossing the viewport.
          // 0 = section top at viewport bottom (just entering)
          // 1 = section top at viewport top (fully docked)
          // This makes the explosion+collapse happen as the section scrolls
          // into view, so by the time the form is fully visible the globe
          // is already a small neutron star.
          const traveled = vh - rect.top;
          progressRef.current = Math.max(0, Math.min(1, traveled / vh));
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [targetId, mode]);

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
            <ParticleGlobe progressRef={progressRef} isMobile={isMobile} mode={mode} />
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
      <GlobeInstance targetId="hero" isMobile={isMobile} mode="hero" />
      <GlobeInstance targetId="contact" isMobile={isMobile} mode="contact" />
    </>
  );
};

export default Scene3DBackground;
