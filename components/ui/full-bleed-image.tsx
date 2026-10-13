import type { ReactNode } from "react";
import type { ImageKey, ImageRatio } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import { imageExists } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Media } from "./media";
import { delayStyle } from "./reveal";

type FullBleedImageProps = {
  imageKey: ImageKey;
  locale: Locale;
  sizes: string;
  ratio?: ImageRatio;
  priority?: boolean;
  /** Voile en dégradé noir pour poser du texte blanc */
  veil?: boolean | "strong";
  /** Contenu posé sur l'image (texte blanc) */
  children?: ReactNode;
  className?: string;
  hoverZoom?: boolean;
  decorative?: boolean;
  /** L'image remplit le conteneur (hauteur définie par className) au lieu de suivre son ratio */
  fill?: boolean;
  /** Légère dérive verticale au défilement (désactivée par défaut sur les packshots à zoom) */
  drift?: boolean;
  /** Délai (s) avant le dévoilement, pour décaler des images voisines */
  revealDelay?: number;
};

/**
 * Image bord à bord, sans arrondi, voile et placeholder.
 * À l'apparition : rideau qui se lève + zoom arrière (1,12 → 1) ; ensuite, légère dérive au défilement.
 */
export function FullBleedImage({
  imageKey,
  locale,
  sizes,
  ratio,
  priority,
  veil,
  children,
  className,
  hoverZoom,
  decorative,
  fill,
  drift = !hoverZoom || Boolean(children),
  revealDelay,
}: FullBleedImageProps) {
  const available = imageExists(imageKey);
  const media = (
    <Media
      imageKey={imageKey}
      locale={locale}
      available={available}
      sizes={sizes}
      priority={priority}
      ratio={fill ? "fill" : ratio}
      hoverZoom={hoverZoom}
      decorative={decorative}
      drift={drift && !priority}
    />
  );
  return (
    <div
      data-tone={children ? "dark" : undefined}
      data-reveal={priority ? undefined : "image"}
      style={delayStyle(revealDelay)}
      className={cn(
        "group relative overflow-hidden",
        veil === "strong" ? "photo-veil-strong" : veil ? "photo-veil" : undefined,
        className,
      )}
    >
      <div className={cn("reveal-zoom", fill ? "absolute inset-0" : "h-full w-full")}>{media}</div>
      {children && <div className="absolute inset-0 z-10 text-white">{children}</div>}
    </div>
  );
}
