import type { ComponentProps, ReactNode } from "react";
import type { Href } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Liste à filets : commence par un filet encre, chaque ligne est séparée par un filet fin.
 * Utilisée pour les étapes, les tarifs, la FAQ, la sélection de prestation et les coordonnées.
 * À l'apparition, le filet de tête se trace et les lignes arrivent l'une après l'autre
 * (reveal=false pour une liste qui change d'état, dans un formulaire par exemple).
 */
export function RuleList({
  className,
  tone = "light",
  reveal = true,
  ...props
}: ComponentProps<"ul"> & { tone?: "light" | "dark"; reveal?: boolean }) {
  return (
    <ul
      data-reveal={reveal ? "rules" : undefined}
      className={cn(
        "rule-line",
        tone === "dark" ? "[--rule:rgb(255_255_255/0.7)] [&>li]:border-white/20" : "[&>li]:border-line",
        "[&>li]:border-b",
        className,
      )}
      {...props}
    />
  );
}

export function RuleItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("py-6 md:py-7", className)} {...props} />;
}

/** Ligne entièrement cliquable, qui se décale de 6 px au survol */
export function RuleLinkItem({
  href,
  children,
  className,
}: {
  href: Href;
  children: ReactNode;
  className?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group flex items-start justify-between gap-6 py-6 transition-[padding] duration-500 ease-soft hover:pl-1.5 md:py-7",
          "focus-visible:pl-1.5",
          className,
        )}
      >
        {children}
      </Link>
    </li>
  );
}
