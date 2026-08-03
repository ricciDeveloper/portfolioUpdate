"use client";

import { useEffect, useRef } from "react";

export function HeroBackground() {
  const background = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = { x: 50, y: 45 };
    const current = { ...target };
    let frame = 0;

    function followCursor(event: PointerEvent) {
      target.x = (event.clientX / window.innerWidth) * 100;
      target.y = (event.clientY / window.innerHeight) * 100;
    }

    function animate() {
      current.x += (target.x - current.x) * 0.07;
      current.y += (target.y - current.y) * 0.07;
      background.current?.style.setProperty("--cursor-x", `${current.x}%`);
      background.current?.style.setProperty("--cursor-y", `${current.y}%`);
      frame = window.requestAnimationFrame(animate);
    }

    window.addEventListener("pointermove", followCursor, { passive: true });
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("pointermove", followCursor);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="hero-background" aria-hidden ref={background} />;
}
