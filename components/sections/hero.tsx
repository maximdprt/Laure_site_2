import type { ReactNode } from "react";
import type { ImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import { imageExists } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Media } from "@/components/ui/media";
import { Parallax } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/typography";

type HeroProps = {
  locale: Locale;
  /** Image de fond (desktop) et variante mobile facultative */
  image: ImageKey;
  mobileImage?: ImageKey;
  label?: ReactNode;
  title: ReactNode;
  /** Colonne de droite (texte court + boutons) — hero plein écran */
  aside?: ReactNode;
  /** Sous le titre — hero de page */
  children?: ReactNode;
  /** Fil d'Ariane posé en haut de l'image */
  breadcrumbs?: ReactNode;
  /**
   * Visuel alternatif à la place de la photo (prévu pour brancher plus tard
   * un visuel 3D chargé via dynamic(..., { ssr: false })).
   */
  visual?: ReactNode;
  size?: "full" | "page";
};

/**
 * Hero photo : plein écran (accueil) ou demi-hauteur 60vh (pages intérieures).
 * Texte blanc sur voile dégradé noir, léger parallaxe sur l'image.
 */
export function Hero({
  locale,
  image,
  mobileImage,
  label,
  title,
  aside,
  children,
  breadcrumbs,
  visual,
  size = "page",
}: HeroProps) {
  const full = size === "full";
  return (
    <section
      data-hero-photo
      data-tone="dark"
      className={cn(
        "photo-veil-strong relative isolate flex overflow-hidden bg-dark text-white",
        full ? "min-h-[100svh]" : "min-h-[62svh] md:min-h-[60vh]",
      )}
    >
      <div className="absolute inset-0 -z-10">
        {visual ?? (
          <Parallax>
            {mobileImage ? (
              <>
                <Media
                  imageKey={mobileImage}
                  locale={locale}
                  available={imageExists(mobileImage)}
                  sizes="100vw"
                  priority
                  ratio="fill"
                  className="md:hidden"
                />
                <Media
                  imageKey={image}
                  locale={locale}
                  available={imageExists(image)}
                  sizes="100vw"
                  priority
                  ratio="fill"
                  className="hidden md:block"
                />
              </>
            ) : (
              <Media imageKey={image} locale={locale} available={imageExists(image)} sizes="100vw" priority ratio="fill" />
            )}
          </Parallax>
        )}
      </div>

      <div className="container-site relative z-10 flex w-full flex-col pb-12 pt-[calc(var(--header-h)+16px)] md:pb-16">
        {breadcrumbs}
        <div className={cn("mt-auto grid gap-10", full && "lg:grid-cols-12 lg:items-end lg:gap-8")}>
          <div className={full ? "lg:col-span-8" : "max-w-5xl"}>
            {label && (
              <SectionLabel tone="light" className="mb-6 md:mb-8">
                {label}
              </SectionLabel>
            )}
            {title}
            {children && <div className="mt-6 max-w-xl text-lead text-white/90">{children}</div>}
          </div>
          {aside && <div className="lg:col-span-4 lg:pb-2">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
