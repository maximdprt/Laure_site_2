import type { StaticPathname, Locale } from "@/i18n/routing";
import { legalEn } from "./en/legal";
import { legalFr } from "./fr/legal";

/**
 * Contenu des pages légales (mentions légales, CGV, confidentialité).
 * Les données variables (statut, SIRET, prix, délais…) sont lues depuis config/.
 * À faire relire par un professionnel avant mise en ligne.
 */

export type LegalSection = {
  heading: string;
  /** Paragraphes (mise en forme **gras** / *italique* acceptée) */
  paragraphs?: string[];
  /** Liste à filets */
  list?: string[];
  /** Paragraphes après la liste */
  after?: string[];
  links?: { label: string; href: StaticPathname }[];
};

export type LegalDocument = {
  seoTitle: string;
  seoDescription: string;
  label: string;
  titleLead: string;
  titleAccent: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

export type LegalContent = {
  mentions: LegalDocument;
  cgv: LegalDocument;
  privacy: LegalDocument;
};

const content: Record<Locale, LegalContent> = { fr: legalFr, en: legalEn };

export function getLegalContent(locale: Locale): LegalContent {
  return content[locale];
}
