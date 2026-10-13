import Image from "next/image";
import { images, type ImageKey, type ImageRatio } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Flou neutre affiché pendant le chargement */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA4IDgnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzgnIGZpbGw9JyNkOGQ0Y2MnLz48L3N2Zz4=";

export const ratioClass: Record<ImageRatio, string> = {
  "16/9": "aspect-video",
  "9/16": "aspect-[9/16]",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "3/2": "aspect-[3/2]",
};

type MediaProps = {
  imageKey: ImageKey;
  locale: Locale;
  /** Le fichier existe-t-il dans public/ ? (résolu côté serveur) */
  available: boolean;
  sizes: string;
  priority?: boolean;
  /** Ratio imposé ; "fill" = remplit le parent (positionné) */
  ratio?: ImageRatio | "fill";
  className?: string;
  /** Zoom léger au survol d'un parent `.group` */
  hoverZoom?: boolean;
  /** Image décorative (le texte alternatif est déjà porté par le lien parent) */
  decorative?: boolean;
};

/**
 * Image du site, sans arrondi. Si le fichier n'a pas encore été déposé,
 * affiche un dégradé évoquant la photo + l'étiquette « IMAGE 0X — NOM ».
 */
export function Media({
  imageKey,
  locale,
  available,
  sizes,
  priority,
  ratio,
  className,
  hoverZoom,
  decorative,
}: MediaProps) {
  const image: (typeof images)[ImageKey] = images[imageKey];
  const r = ratio ?? image.ratio;
  const alt = decorative ? "" : image.alt[locale];
  const zoom = hoverZoom && "transition-transform duration-[1.2s] ease-soft group-hover:scale-[1.03]";
  return (
    <div className={cn("relative overflow-hidden", r === "fill" ? "absolute inset-0" : ratioClass[r], className)}>
      {available ? (
        <Image
          src={image.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className={cn("object-cover", zoom)}
        />
      ) : (
        <div
          role={decorative ? undefined : "img"}
          aria-label={decorative ? undefined : alt}
          className={cn("absolute inset-0", zoom)}
          style={{
            background: `radial-gradient(70% 55% at 50% 42%, ${image.placeholder[1]}, transparent 75%), linear-gradient(180deg, ${image.placeholder[0]}, ${image.placeholder[2]})`,
          }}
        >
          <span
            aria-hidden
            className="absolute bottom-3 right-3 max-w-[calc(100%-1.5rem)] truncate font-mono text-[10px] uppercase tracking-[0.1em] text-white/80 md:text-[11px]"
          >
            Image {image.number} — {image.name}
          </span>
        </div>
      )}
    </div>
  );
}
