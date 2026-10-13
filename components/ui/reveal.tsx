"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  /** Position dans une liste : léger décalage entre éléments */
  index?: number;
  className?: string;
  as?: "div" | "li";
};

/** Apparition au défilement : fondu + translation de 16 px, 0,8 s, une seule fois */
export function Reveal({ children, index = 0, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, ease: EASE, delay: Math.min(index, 6) * 0.09 }}
    >
      {children}
    </Component>
  );
}

/** Titre qui apparaît ligne par ligne (animation CSS : visible sans attendre l'hydratation) */
export function RevealLines({ lines, className }: { lines: ReactNode[]; className?: string }) {
  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em]">
          <span className="line-rise" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Très léger zoom-out des images à l'apparition (1,06 → 1, 1,4 s) */
export function ZoomIn({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("h-full w-full", className)}
      initial={{ scale: 1.06 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={reduce ? { duration: 0 } : { duration: 1.4, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Léger parallaxe (10 % maximum) pour l'image du hero */
export function Parallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "10%"]);
  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div className="absolute inset-0" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
