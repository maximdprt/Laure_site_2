import type { Localized } from "@/lib/i18n-types";

/**
 * Livraison de la boutique.
 * ➜ Modifier ici : tarifs, seuil de gratuité, pays livrés, délais.
 * [À VALIDER : tarifs, zone de livraison (France / UE) et délais]
 */

/** Pays acceptés par Stripe Checkout (codes ISO) [À VALIDER : UE ?] */
export const SHIPPING_COUNTRIES = ["FR"] as const;

/** Livraison offerte à partir de ce sous-total (centimes) */
export const FREE_SHIPPING_THRESHOLD_CENTS = 6000;

export type ShippingMethod = {
  id: "colissimo" | "colissimo-offert" | "retrait";
  label: Localized;
  amountCents: number;
  /** Délai estimé en jours ouvrés */
  delivery?: { min: number; max: number };
};

export const COLISSIMO: ShippingMethod = {
  id: "colissimo",
  label: { fr: "Colissimo suivi (France)", en: "Tracked Colissimo (France)" },
  amountCents: 590,
  delivery: { min: 2, max: 4 },
};

export const COLISSIMO_FREE: ShippingMethod = {
  id: "colissimo-offert",
  label: { fr: "Colissimo suivi – offert", en: "Tracked Colissimo – free" },
  amountCents: 0,
  delivery: { min: 2, max: 4 },
};

export const PICKUP: ShippingMethod = {
  id: "retrait",
  label: { fr: "Retrait au cabinet à Lacanau", en: "Collection from the Lacanau practice" },
  amountCents: 0,
};

/** Options proposées dans Stripe Checkout selon le sous-total */
export function shippingMethodsFor(subtotalCents: number): ShippingMethod[] {
  const home = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? COLISSIMO_FREE : COLISSIMO;
  return [home, PICKUP];
}

export const preparationDelay: Localized = {
  fr: "[À COMPLÉTER : délai de préparation, ex. expédition sous 3 à 5 jours ouvrés]",
  en: "[TO COMPLETE: preparation time]",
};
