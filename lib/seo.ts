import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export type Href = Parameters<typeof getPathname>[0]["href"];

/** Chemin public localisé, ex. ("/tarifs", "en") → "/en/pricing" */
export function localizedPath(href: Href, locale: Locale): string {
  return getPathname({ href, locale });
}

export function absolute(path: string): string {
  return `${siteConfig.url}${path === "/" ? "" : path}` || siteConfig.url;
}

type BuildMetadataInput = {
  locale: Locale;
  href: Href;
  title: string;
  description?: string;
  /** Chemins alternatifs explicites (articles de blog aux slugs traduits) */
  alternates?: Partial<Record<Locale, string>>;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Title, description, canonical, hreflang (fr/en/x-default), Open Graph et Twitter Card */
export function buildMetadata({
  locale,
  href,
  title,
  description,
  alternates,
  noIndex,
  type = "website",
  publishedTime,
}: BuildMetadataInput): Metadata {
  const paths: Record<Locale, string> = {
    fr: alternates?.fr ?? localizedPath(href, "fr"),
    en: alternates?.en ?? localizedPath(href, "en"),
  };
  const canonical = absolute(paths[locale]);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = absolute(paths[l]);
  languages["x-default"] = absolute(paths[routing.defaultLocale]);

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: siteConfig.fullName,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_FR"],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
