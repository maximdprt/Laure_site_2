/* eslint-disable @next/next/no-img-element -- SVG vectoriel, aucune optimisation utile */
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Mot-symbole NLIGHT (Geist 500, letter-spacing 0.32em).
 * Une fois le logo SVG fourni, passer `logo.useSvg` à true dans config/site.ts.
 * La couleur suit `currentColor` (texte) ou la variante de fichier (SVG).
 */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  if (siteConfig.logo.useSvg) {
    return (
      <img
        src={tone === "light" ? "/brand/logo-blanc.svg" : "/brand/logo.svg"}
        alt="NLIGHT – Laure Dupuch"
        width={140}
        height={32}
        className={cn("h-7 w-auto md:h-8", className)}
      />
    );
  }
  return (
    <span className={cn("block text-[17px] font-medium uppercase leading-none tracking-[0.32em]", className)}>
      NLIGHT
      <span className="sr-only"> – Laure Dupuch</span>
    </span>
  );
}
