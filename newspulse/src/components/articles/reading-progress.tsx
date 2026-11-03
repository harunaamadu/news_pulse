"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function ReadingProgress({ targetId }: { targetId: string }) {
  const progress = useMotionValue(0);
  const scaleX = useSpring(progress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const update = () => {
      const rect = target.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const value = scrollable <= 0 ? 1 : -rect.top / scrollable;
      progress.set(Math.min(1, Math.max(0, value)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId, progress]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-brand"
    />
  );
}