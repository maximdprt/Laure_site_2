import type { Locale } from "@/i18n/routing";
import { about as aboutEn } from "./en/about";
import { blends as blendsEn } from "./en/blends";
import { faq as faqEn } from "./en/faq";
import { home as homeEn } from "./en/home";
import { pricing as pricingEn } from "./en/pricing";
import { shop as shopEn } from "./en/shop";
import { support as supportEn } from "./en/support";
import { test as testEn } from "./en/test";
import { about as aboutFr } from "./fr/about";
import { blends as blendsFr } from "./fr/blends";
import { faq as faqFr } from "./fr/faq";
import { home as homeFr } from "./fr/home";
import { pricing as pricingFr } from "./fr/pricing";
import { shop as shopFr } from "./fr/shop";
import { support as supportFr } from "./fr/support";
import { test as testFr } from "./fr/test";
import type { FaqId, PageContents } from "./types";

const contents: Record<Locale, PageContents> = {
  fr: {
    home: homeFr,
    test: testFr,
    support: supportFr,
    blends: blendsFr,
    about: aboutFr,
    pricing: pricingFr,
    shop: shopFr,
    faq: faqFr,
  },
  en: {
    home: homeEn,
    test: testEn,
    support: supportEn,
    blends: blendsEn,
    about: aboutEn,
    pricing: pricingEn,
    shop: shopEn,
    faq: faqEn,
  },
};

export function getContent(locale: Locale): PageContents {
  return contents[locale];
}

/** Sélectionne des questions de la banque de FAQ et remplace les variables ({hours}, {deposit}…) */
export function pickFaq(locale: Locale, ids: FaqId[], vars: Record<string, string> = {}) {
  return ids.map((id) => {
    const item = contents[locale].faq[id];
    return { question: fill(item.question, vars), answer: fill(item.answer, vars) };
  });
}

/** Remplace {cle} par sa valeur */
export function fill(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}
