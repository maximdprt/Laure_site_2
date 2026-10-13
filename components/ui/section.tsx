import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionLabel } from "./typography";

type SectionProps = ComponentProps<"section"> & {
  tone?: "bg" | "paper" | "dark";
  /** Espacement vertical réduit */
  tight?: boolean;
  /** Pas de conteneur (contenu bord à bord) */
  bleed?: boolean;
  containerClassName?: string;
};

const tones = {
  bg: "bg-bg text-ink",
  paper: "bg-paper text-ink",
  dark: "bg-dark text-white",
} as const;

/** Section très espacée : 140 à 180 px en desktop, 80 à 100 px en mobile */
export function Section({ tone = "bg", tight, bleed, className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section
      className={cn(tones[tone], tight ? "py-16 md:py-24" : "py-20 md:py-32 lg:py-[150px]", className)}
      {...props}
    >
      {bleed ? children : <div className={cn("container-site", containerClassName)}>{children}</div>}
    </section>
  );
}

/** En-tête de section : repère (01) + titre + intro, sur une grille éditoriale */
export function SectionHeader({
  number,
  label,
  title,
  intro,
  className,
}: {
  number?: string;
  label?: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-12 grid gap-6 md:mb-20 lg:grid-cols-12 lg:gap-8", className)}>
      {label && (
        <Reveal className="lg:col-span-3">
          <SectionLabel number={number}>{label}</SectionLabel>
        </Reveal>
      )}
      <div className={label ? "lg:col-span-9" : "lg:col-span-12"}>
        {title}
        {intro && (
          <Reveal delay={0.25} className="mt-6 max-w-2xl text-lead text-ink-muted">
            {intro}
          </Reveal>
        )}
      </div>
    </header>
  );
}
