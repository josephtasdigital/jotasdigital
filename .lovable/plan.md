

## Add a Scroll-Animated Wireframe 3D Background

A fixed, blurry, abstract wireframe object that sits behind all content and slowly rotates/morphs as the user scrolls. Mobile-safe, layout-safe, with a graceful fallback.

### What you'll see
- A dark, neon-cyan **wireframe Icosahedron** floating behind the entire page
- Subtle **fog + bloom-like glow** in your primary teal (`hsl(175 80% 50%)`)
- Slow continuous auto-rotation, **accelerated by scroll position** (rotates faster/morphs as you scroll down)
- A soft `backdrop-filter: blur()` layer over the canvas to keep it abstract and never compete with text
- Completely **non-interactive** — no scroll/tap interference

### Architecture (layout-safe)

```text
<body>
  ├── <Scene3DBackground />   ← fixed inset-0 z-[-1] pointer-events-none
  │     ├── fallback div     (bg-slate-900 gradient, shown if Canvas fails)
  │     └── <Canvas>         (100vw × 100vh, dpr [1, 1.5])
  │           └── WireframeMesh (Icosahedron, useFrame rotates from scroll ref)
  └── <main> ... existing Index.tsx untouched ...
```

- Wrapper: `fixed inset-0 -z-10 pointer-events-none overflow-hidden`
- A `backdrop-blur-sm` overlay div sits above the canvas inside the wrapper for the "shady/blurry" look
- Mounted **once** at the top of `src/pages/Index.tsx` — zero changes to existing sections

### Scroll → rotation binding
- A module-level `scrollRef = { current: 0 }` updated by a passive `window.scroll` listener
- Inside `useFrame`, the mesh rotates: base auto-rotation + `scrollRef.current * factor`
- A second uniform-like value (scroll progress 0→1) drives a slight **vertex displacement** for the "morph" feel via `MeshDistortMaterial` (wireframe enabled)

### Mobile & tablet safety
- `dpr={[1, 1.5]}` on `<Canvas>`
- Low-poly Icosahedron (`detail={1}` desktop, `detail={0}` mobile via `useIsMobile`)
- `frameloop="always"` but capped — `<Canvas performance={{ min: 0.5 }}>` auto-throttles on weak GPUs
- `prefers-reduced-motion` → renders static fallback gradient instead of Canvas
- Passive scroll listener (no jank)
- `pointer-events: none` on wrapper guarantees no scroll/tap blocking on touch devices

### Graceful fallback
- The fallback `<div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-background to-slate-950">` is rendered **underneath** the Canvas always
- A React **ErrorBoundary** wraps `<Canvas>` — if R3F throws (WebGL unavailable, load failure), the Canvas unmounts and only the gradient remains visible
- No layout shift in either case

### Files to change

1. **New** `src/components/Scene3DBackground.tsx` — wrapper, ErrorBoundary, Canvas, WireframeMesh, scroll listener
2. **Edit** `src/pages/Index.tsx` — add `<Scene3DBackground />` as the first child of `<main>` (1 line)
3. **Install** exact pinned versions:
   - `three@0.160.0`
   - `@react-three/fiber@^8.18.0`
   - `@react-three/drei@^9.122.0`

### Guardrails respected
- No changes to `cookie-consent.ts`, `public/admin/config.yml`, Vite routing, or SurveyJS form logic
- Native scrolling preserved — no `position: sticky`, no `useScroll` section pinning
- Dark theme + Tailwind stack untouched
- Canvas is `pointer-events: none` and `z-[-1]` — cannot push, pull, or interfere with layout

