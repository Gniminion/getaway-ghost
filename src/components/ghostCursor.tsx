import React, { useEffect, useRef } from "react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export default function GhostCursor() {
  const wispRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia(FINE_POINTER).matches) return;
    const wisp = wispRef.current;
    if (!wisp) return;

    document.body.classList.add("ghost-cursor-active");
    const move = (e: MouseEvent) => {
      wisp.style.left = `${e.clientX}px`;
      wisp.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("ghost-cursor-active");
    };
  }, []);

  return <div ref={wispRef} aria-hidden className="ghost-cursor-wisp" />;
}
