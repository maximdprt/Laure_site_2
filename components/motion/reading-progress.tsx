"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Fine barre de progression de lecture en haut de l'écran (articles du journal) */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-ink"
      style={{ scaleX }}
    />
  );
}
