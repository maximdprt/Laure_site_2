import type { ReactNode } from "react";
import type { ImageKey, ImageRatio } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import { imageExists } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Media } from "./media";
import { ZoomIn } from "./reveal";

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
};

/** Image bord à bord, sans arrondi, avec zoom-out à l'apparition, voile et placeholder */
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
    />
  );
  return (
    <div
      data-tone={children ? "dark" : undefined}
      className={cn(
        "group relative overflow-hidden",
        veil === "strong" ? "photo-veil-strong" : veil ? "photo-veil" : undefined,
        className,
      )}
    >
      {priority ? media : <ZoomIn className={fill ? "absolute inset-0" : undefined}>{media}</ZoomIn>}
      {children && <div className="absolute inset-0 z-10 text-white">{children}</div>}
    </div>
  );
}
