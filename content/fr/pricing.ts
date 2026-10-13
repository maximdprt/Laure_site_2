import type { PricingContent } from "../types";

/**
 * Tarifs — textes de la section 7.7. Les montants sont lus dans config/services.ts,
 * config/products.ts et config/shipping.ts (ne pas les écrire ici).
 */
export const pricing: PricingContent = {
  seo: {
    title: "Tarifs : Test de Profil Chromatique, accompagnement et préparations | NLIGHT",
    description:
      "Tarifs transparents : appel découverte offert, Test de Profil Chromatique, pack test + préparation personnalisée, séances de suivi et flacons thématiques.",
  },
  hero: {
    label: "Tarifs",
    title: "Tarifs",
    accent: "simples & clairs",
    subtitle: "Des prix transparents, au cabinet à Lacanau comme à distance.",
  },
  services: {
    label: "Prestations",
    title: { lead: "Les", accent: "prestations" },
    mostChosen: "Le plus choisi",
    book: "Réserver",
  },
  products: {
    label: "Flacons",
    title: { lead: "Les", accent: "flacons" },
    readyName: "Flacon thématique prêt à l'emploi",
    readyFormat: "Boutique · 8 thèmes",
    renewalFormat: "Flacon, sans séance · après un premier test",
    shopLink: "Voir la boutique",
  },
  shipping: {
    label: "Livraison",
    title: { lead: "Livraison", accent: "& retrait" },
    homeLabel: "Colissimo suivi (France)",
    freeFrom: "offerte dès {threshold}",
    pickupLabel: "Retrait au cabinet à Lacanau",
    free: "Gratuit",
  },
  deposit: {
    label: "Acompte",
    title: { lead: "L'acompte", accent: "à la réservation" },
    text: "Les séances payantes se réservent avec un acompte de {deposit} payé en ligne et déduit du prix ; le solde est réglé en séance.",
  },
  cancellation: {
    label: "Annulation",
    title: { lead: "Annuler", accent: "ou déplacer" },
    text: "L'annulation est gratuite jusqu'à {hours} h avant le rendez-vous : l'acompte est alors remboursé. Au-delà, l'acompte est conservé. [À VALIDER]",
  },
  payment: {
    label: "Paiement",
    title: { lead: "Moyens", accent: "de paiement" },
    online: "En ligne : carte bancaire, Apple Pay, Google Pay.",
    inPerson: "En séance : [À COMPLÉTER : moyens de paiement acceptés au cabinet].",
  },
  faq: ["which-service", "deposit", "cancel", "payment-methods", "duration"],
  final: {
    title: { lead: "Prêt(e) à découvrir", accent: "votre profil ?" },
    primary: "Prendre rendez-vous",
    secondary: "Appel découverte offert",
  },
};
