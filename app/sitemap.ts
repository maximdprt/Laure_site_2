import type { MetadataRoute } from "next";
import { products } from "@/config/products";
import { routing, type Locale, type StaticPathname } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";
import { absolute, localizedPath, type Href } from "@/lib/seo";

/** Pages indexables (ni styleguide, ni pages de confirmation) */
const staticPages: { href: StaticPathname; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { href: "/", priority: 1, changeFrequency: "weekly" },
  { href: "/test-profil-chromatique", priority: 0.9, changeFrequency: "monthly" },
  { href: "/rendez-vous", priority: 0.9, changeFrequency: "monthly" },
  { href: "/preparations-personnalisees", priority: 0.8, changeFrequency: "monthly" },
  { href: "/accompagnement-emotionnel", priority: 0.8, changeFrequency: "monthly" },
  { href: "/boutique", priority: 0.8, changeFrequency: "weekly" },
  { href: "/tarifs", priority: 0.7, changeFrequency: "monthly" },
  { href: "/a-propos", priority: 0.6, changeFrequency: "monthly" },
  { href: "/journal", priority: 0.6, changeFrequency: "weekly" },
  { href: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
  { href: "/cgv", priority: 0.2, changeFrequency: "yearly" },
  { href: "/confidentialite", priority: 0.2, changeFrequency: "yearly" },
];

function entry(
  paths: Record<Locale, string>,
  priority: number,
  changeFrequency: "weekly" | "monthly" | "yearly",
  lastModified?: string,
): MetadataRoute.Sitemap {
  const languages = {
    fr: absolute(paths.fr),
    en: absolute(paths.en),
    "x-default": absolute(paths[routing.defaultLocale]),
  };
  return routing.locales.map((locale) => ({
    url: absolute(paths[locale]),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

const both = (href: Href): Record<Locale, string> => ({
  fr: localizedPath(href, "fr"),
  en: localizedPath(href, "en"),
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = staticPages.flatMap((p) => entry(both(p.href), p.priority, p.changeFrequency));

  const productPages = products.flatMap((p) =>
    entry(both({ pathname: "/boutique/[slug]", params: { slug: p.slug } }), 0.6, "monthly"),
  );

  const [fr, en] = await Promise.all([getAllPosts("fr"), getAllPosts("en")]);
  const articles = fr.flatMap((post) => {
    const translation = en.find((e) => e.translationKey === post.translationKey);
    const paths: Record<Locale, string> = {
      fr: localizedPath({ pathname: "/journal/[slug]", params: { slug: post.slug } }, "fr"),
      en: translation
        ? localizedPath({ pathname: "/journal/[slug]", params: { slug: translation.slug } }, "en")
        : localizedPath("/journal", "en"),
    };
    return entry(paths, 0.6, "yearly", post.date);
  });

  return [...pages, ...productPages, ...articles];
}
