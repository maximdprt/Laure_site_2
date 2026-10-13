import type { ShopContent } from "../types";

/** Boutique — section 7.6 */
export const shop: ShopContent = {
  seo: {
    title: "Boutique : flacons d'élixirs thématiques et préparations personnalisées | NLIGHT",
    description:
      "Des flacons thématiques prêts à l'emploi, élaborés par Laure Dupuch, et le renouvellement de votre préparation personnalisée. Livraison en France ou retrait à Lacanau.",
  },
  label: "Boutique",
  title: { lead: "Les flacons", accent: "thématiques" },
  intro:
    "Des flacons thématiques prêts à l'emploi, élaborés par Laure, pour accompagner un besoin du moment. Pour une préparation entièrement adaptée à votre profil, commencez par le Test de Profil Chromatique.",
  pack: {
    label: "Première préparation",
    title: { lead: "Pack Test", accent: "+ préparation personnalisée" },
    text: "Votre première préparation commence par le Test de Profil Chromatique. Le pack se réserve directement dans l'agenda.",
    cta: "Réserver le pack",
  },
  renewal: {
    label: "Déjà testé(e) ?",
    title: { lead: "Renouveler", accent: "votre préparation" },
    text: "Réservé aux personnes ayant déjà réalisé leur Test de Profil Chromatique. Première préparation ? Choisissez le Pack Test + préparation.",
  },
  final: {
    title: { lead: "Une préparation", accent: "rien que pour vous ?" },
    primary: "Prendre rendez-vous",
    secondary: "Découvrir le test",
  },
};
