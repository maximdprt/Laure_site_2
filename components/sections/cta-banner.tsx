import type { ReactNode } from "react";
import type { ImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import type { Href } from "@/lib/seo";
import { ButtonLink, LinkUnderline } from "@/components/ui/button";
import { FullBleedImage } from "@/components/ui/full-bleed-image";
import { Reveal } from "@/components/ui/reveal";

type CtaFinalProps = {
  locale: Locale;
  image?: ImageKey;
  title: ReactNode;
  text?: ReactNode;
  primary: { label: string; href: Href };
  secondary?: { label: string; href: Href };
};

/** Section finale plein écran : photo, titre blanc, bouton blanc + lien souligné */
export function CtaFinal({ locale, image = "cta", title, text, primary, secondary }: CtaFinalProps) {
  return (
    <FullBleedImage
      imageKey={image}
      locale={locale}
      sizes="100vw"
      veil="strong"
      decorative
      fill
      className="min-h-[88svh]"
    >
      <div className="container-site flex h-full flex-col justify-end pb-16 md:pb-24">
        <Reveal>
          <h2 className="max-w-5xl text-h2 font-light">{title}</h2>
          {text && <div className="mt-6 max-w-xl text-lead text-white/90">{text}</div>}
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <ButtonLink href={primary.href} variant="light" size="lg">
              {primary.label}
            </ButtonLink>
            {secondary && <LinkUnderline href={secondary.href}>{secondary.label}</LinkUnderline>}
          </div>
        </Reveal>
      </div>
    </FullBleedImage>
  );
}
