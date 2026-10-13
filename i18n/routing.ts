import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  // FR à la racine (/), EN sous /en
  localePrefix: "as-needed",
  // Pas de redirection automatique selon la langue du navigateur : / reste en français.
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/test-profil-chromatique": { fr: "/test-profil-chromatique", en: "/chromatic-profile-test" },
    "/accompagnement-emotionnel": { fr: "/accompagnement-emotionnel", en: "/emotional-support" },
    "/preparations-personnalisees": { fr: "/preparations-personnalisees", en: "/personalised-blends" },
    "/boutique": { fr: "/boutique", en: "/shop" },
    "/boutique/[slug]": { fr: "/boutique/[slug]", en: "/shop/[slug]" },
    "/a-propos": { fr: "/a-propos", en: "/about" },
    "/tarifs": { fr: "/tarifs", en: "/pricing" },
    "/rendez-vous": { fr: "/rendez-vous", en: "/book" },
    "/rendez-vous/confirmation": { fr: "/rendez-vous/confirmation", en: "/book/confirmation" },
    "/commande/confirmation": { fr: "/commande/confirmation", en: "/order/confirmation" },
    "/journal": "/journal",
    "/journal/[slug]": "/journal/[slug]",
    "/mentions-legales": { fr: "/mentions-legales", en: "/legal" },
    "/cgv": { fr: "/cgv", en: "/terms" },
    "/confidentialite": { fr: "/confidentialite", en: "/privacy" },
    "/styleguide": "/styleguide",
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
/** Routes sans paramètre dynamique */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}]${string}`>;

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
