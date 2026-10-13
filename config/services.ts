import type { Localized } from "@/lib/i18n-types";

/**
 * Prestations réservables dans l'agenda + tarifs.
 * ➜ Modifier un prix : changer `priceCents` (en centimes : 6500 = 65 €).
 * [À VALIDER : prix proposés, acompte et politique d'annulation]
 */

/** "deposit" = acompte payé en ligne, solde en séance · "full" = totalité payée en ligne */
export const PAYMENT_MODE: "deposit" | "full" = "deposit";
/** Montant de l'acompte en centimes (déduit du prix de la séance) */
export const DEPOSIT_CENTS = 2000;
/** Annulation gratuite jusqu'à X heures avant le rendez-vous [À VALIDER] */
export const FREE_CANCELLATION_HOURS = 48;
/** Durée de blocage d'un créneau pendant le paiement (minutes, ≥ 31 car Stripe impose 30 min minimum) */
export const HOLD_MINUTES = 32;
/** Statut TVA affiché sous les prix [À COMPLÉTER : statut — supprimer si Laure facture la TVA] */
export const VAT_NOTICE: Localized = {
  fr: "TVA non applicable, art. 293 B du CGI",
  en: "VAT not applicable, art. 293 B of the French General Tax Code",
};

export type ServiceId = "decouverte" | "test" | "pack" | "suivi";
export type BookingFormat = "cabinet" | "distance" | "telephone";

export type Service = {
  id: ServiceId;
  name: Localized;
  shortDescription: Localized;
  /** Format affiché sur la page Tarifs */
  formatSummary: Localized;
  /** Prix total en centimes (0 = offert) */
  priceCents: number;
  /** Formats proposés pour cette prestation */
  formats: BookingFormat[];
  /** Durée bloquée dans l'agenda (minutes) – non affichée au client */
  blockMinutes: number;
  /** Paiement en ligne requis ? */
  requiresPayment: boolean;
  featured?: boolean;
};

export const services: Service[] = [
  {
    id: "decouverte",
    name: { fr: "Appel découverte", en: "Discovery call" },
    shortDescription: {
      fr: "Quinze minutes au téléphone pour faire connaissance et répondre à vos questions.",
      en: "Fifteen minutes on the phone to get to know each other and answer your questions.",
    },
    formatSummary: { fr: "Téléphone, 15 min", en: "Phone, 15 min" },
    priceCents: 0,
    formats: ["telephone"],
    blockMinutes: 15,
    requiresPayment: false,
  },
  {
    id: "test",
    name: { fr: "Test de Profil Chromatique", en: "Chromatic Profile Test" },
    shortDescription: {
      fr: "Votre profil établi à partir de vos choix de couleurs, puis une lecture partagée.",
      en: "Your profile, drawn from your colour choices, followed by a shared reading.",
    },
    formatSummary: {
      fr: "Cabinet à Lacanau ou à distance (téléphone + support couleurs envoyé)",
      en: "At the Lacanau practice or remotely (phone + colour cards sent to you)",
    },
    priceCents: 6500,
    formats: ["cabinet", "distance"],
    blockMinutes: 120,
    requiresPayment: true,
  },
  {
    id: "pack",
    name: { fr: "Pack Test + préparation personnalisée", en: "Test + personalised blend package" },
    shortDescription: {
      fr: "Le Test de Profil Chromatique, puis votre flacon unique créé à partir de votre profil.",
      en: "The Chromatic Profile Test, then your unique bottle created from your profile.",
    },
    formatSummary: {
      fr: "Cabinet ou à distance, flacon envoyé ou remis en main propre",
      en: "In person or remotely, bottle posted or handed over",
    },
    priceCents: 8500,
    formats: ["cabinet", "distance"],
    blockMinutes: 120,
    requiresPayment: true,
    featured: true,
  },
  {
    id: "suivi",
    name: { fr: "Séance de suivi", en: "Follow-up session" },
    shortDescription: {
      fr: "Un temps d'accompagnement émotionnel pour faire le point et ajuster votre préparation.",
      en: "A session of emotional support to take stock and adjust your blend.",
    },
    formatSummary: { fr: "Cabinet ou téléphone", en: "In person or by phone" },
    priceCents: 5000,
    formats: ["cabinet", "telephone"],
    blockMinutes: 90,
    requiresPayment: true,
  },
];

export function isServiceId(value: unknown): value is ServiceId {
  return typeof value === "string" && services.some((s) => s.id === value);
}

export function getService(id: ServiceId): Service {
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error(`Prestation inconnue : ${id}`);
  return service;
}

/** Montant payé en ligne à la réservation (centimes) */
export function onlineAmountCents(service: Service): number {
  if (!service.requiresPayment) return 0;
  return PAYMENT_MODE === "deposit" ? Math.min(DEPOSIT_CENTS, service.priceCents) : service.priceCents;
}

export const formatLabels: Record<BookingFormat, Localized> = {
  cabinet: { fr: "Au cabinet à Lacanau", en: "At the Lacanau practice" },
  distance: { fr: "À distance (téléphone)", en: "Remotely (by phone)" },
  telephone: { fr: "Par téléphone", en: "By phone" },
};

/** Le support couleurs doit être envoyé avant la séance */
export function needsPostalAddress(serviceId: ServiceId, format: BookingFormat): boolean {
  return format === "distance" && (serviceId === "test" || serviceId === "pack");
}
