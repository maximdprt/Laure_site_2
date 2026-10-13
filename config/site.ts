/**
 * Informations générales du site.
 * ➜ Modifier ici : coordonnées, réseaux sociaux, horaires indicatifs.
 */
export const siteConfig = {
  brand: "NLIGHT",
  practitioner: "Laure Dupuch",
  fullName: "NLIGHT – Laure Dupuch",
  /** Passer à true une fois public/brand/logo.svg et logo-blanc.svg déposés [À COMPLÉTER] */
  logo: { useSvg: false },
  jobTitle: {
    fr: "Thérapeute holistique – Praticienne en Chromobioénergie®",
    en: "Holistic therapist – Chromobioénergie® practitioner",
  },
  baseline: {
    fr: "Découvrez votre Profil Chromatique. Comprenez vos besoins. Recevez votre préparation personnalisée.",
    en: "Discover your Chromatic Profile. Understand your needs. Receive your personalised blend.",
  },
  /** URL publique, sans slash final. Définie par NEXT_PUBLIC_SITE_URL. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  contact: {
    email: "[À COMPLÉTER : e-mail]",
    phone: "[À COMPLÉTER : téléphone]",
    /** Format international pour les liens tel: (ex. +33600000000). Laisser vide tant qu'inconnu. */
    phoneHref: "",
    address: {
      street: "[À COMPLÉTER : adresse du cabinet]",
      postalCode: "33680",
      city: "Lacanau",
      region: "Gironde",
      country: "FR",
    },
    /** Lien Google Maps (pas d'iframe, pour éviter les cookies tiers) */
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Lacanau+33680",
    /** Coordonnées approximatives de Lacanau (à affiner avec l'adresse réelle) */
    geo: { latitude: 45.0016, longitude: -1.0797 },
  },
  hours: {
    fr: "[À COMPLÉTER : horaires indicatifs]",
    en: "[TO COMPLETE: indicative opening hours]",
  },
  social: {
    instagram: "https://www.instagram.com/laure_dupuch/",
    linkedin: "https://www.linkedin.com/in/laure-dupuch-179019207/",
  },
} as const;

export function isPlaceholder(value: string): boolean {
  return value.includes("[À COMPLÉTER") || value.includes("[TO COMPLETE") || value.includes("[À VALIDER");
}
