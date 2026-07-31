import { useEffect, useState } from "react";

/**
 * Soft neon spotlight that trails the pointer. Desktop + fine-pointer only,
 * disabled for reduced-motion users. Purely decorative (pointer-events: none).
 */
const CursorSpotlight = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const apply = () => {
      raf = 0;
      document.documentElement.style.setProperty("--spotlight-x", `${x}px`);
      document.documentElement.style.setProperty("--spotlight-y", `${y}px`);
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return <div aria-hidden="true" className="cursor-spotlight" />;
};

export default CursorSpotlight;
