import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Délai d'animation (en secondes) passé au CSS via la variable --d */
export function delayStyle(seconds?: number): CSSProperties | undefined {
  return seconds ? ({ "--d": `${seconds}s` } as CSSProperties) : undefined;
}

type RevealProps = {
  children: ReactNode;
  /** Position dans une liste : léger décalage entre éléments */
  index?: number;
  /** Délai explicite (s), prioritaire sur index */
  delay?: number;
  className?: string;
  as?: "div" | "li";
};

/**
 * Apparition au défilement : fondu + translation, une seule fois.
 * Composant serveur : l'animation est en CSS ([data-reveal] dans globals.css),
 * déclenchée par components/motion/reveal-observer.tsx.
 */
export function Reveal({ children, index = 0, delay, className, as: Tag = "div" }: RevealProps) {
  return (
    <Tag data-reveal="up" className={className} style={delayStyle(delay ?? Math.min(index, 6) * 0.09)}>
      {children}
    </Tag>
  );
}

/** Titre qui apparaît ligne par ligne (animation CSS : visible sans attendre l'hydratation) */
export function RevealLines({ lines, className }: { lines: ReactNode[]; className?: string }) {
  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em]">
          <span className="line-rise" style={{ animationDelay: `${0.15 + i * 0.13}s` }}>
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
