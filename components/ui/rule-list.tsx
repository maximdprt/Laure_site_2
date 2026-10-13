import type { ComponentProps, ReactNode } from "react";
import type { Href } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Liste à filets : commence par un filet encre, chaque ligne est séparée par un filet fin.
 * Utilisée pour les étapes, les tarifs, la FAQ, la sélection de prestation et les coordonnées.
 */
export function RuleList({ className, tone = "light", ...props }: ComponentProps<"ul"> & { tone?: "light" | "dark" }) {
  return (
    <ul
      className={cn(
        "border-t",
        tone === "dark" ? "border-white/70 [&>li]:border-white/20" : "border-ink [&>li]:border-line",
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
          className,
        )}
      >
        {children}
      </Link>
    </li>
  );
}
