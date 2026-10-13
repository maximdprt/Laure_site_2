import type { StaticPathname } from "@/i18n/routing";

/**
 * Navigation principale et liens du pied de page.
 * Les libellés sont dans messages/{fr,en}.json (clé "nav").
 */
export type NavKey =
  | "test"
  | "support"
  | "blends"
  | "shop"
  | "about"
  | "pricing"
  | "book"
  | "journal"
  | "legal"
  | "terms"
  | "privacy"
  | "home";

export type NavItem = { key: NavKey; href: StaticPathname };

export const mainNav: NavItem[] = [
  { key: "test", href: "/test-profil-chromatique" },
  { key: "support", href: "/accompagnement-emotionnel" },
  { key: "blends", href: "/preparations-personnalisees" },
  { key: "shop", href: "/boutique" },
  { key: "about", href: "/a-propos" },
  { key: "pricing", href: "/tarifs" },
];

export const footerNav: NavItem[] = [...mainNav, { key: "book", href: "/rendez-vous" }, { key: "journal", href: "/journal" }];

export const legalNav: NavItem[] = [
  { key: "legal", href: "/mentions-legales" },
  { key: "terms", href: "/cgv" },
  { key: "privacy", href: "/confidentialite" },
];
