import type { HomeContent } from "../types";

/** Accueil — textes validés par la cliente (section 7.1) */
export const home: HomeContent = {
  seo: {
    title: "Test de Profil Chromatique | Accompagnement émotionnel à Lacanau et à distance",
    description:
      "Profil chromatique, florathérapie et préparations personnalisées à base de fleurs, couleurs, sons et cristaux. À Lacanau et à distance partout en France.",
  },
  hero: {
    label: "Laure Dupuch — Thérapeute holistique · Chromobioénergie®",
    title: "Test de Profil Chromatique",
    accent: "& accompagnement émotionnel",
    text: "Comprendre vos émotions grâce aux couleurs, et recevoir une préparation créée pour vous. À Lacanau et à distance partout en France.",
    primary: "Prendre rendez-vous",
    secondary: "Découvrir le test",
  },
  method: {
    label: "La méthode",
    text: "Certaines couleurs nous attirent immédiatement, d'autres nous laissent indifférents. *Ces réactions racontent quelque chose de nous.* Le Test de Profil Chromatique s'en sert pour mieux vous comprendre, et mieux vous accompagner.",
    link: "Comment se déroule le test",
  },
  how: {
    label: "Comment ça fonctionne",
    title: { lead: "De vos couleurs", accent: "à votre flacon" },
    steps: [
      {
        title: "Vous réalisez votre test.",
        text: "Nous échangeons sur votre situation, puis vous choisissez différentes couleurs selon vos ressentis.",
      },
      {
        title: "Nous découvrons votre profil.",
        text: "Vos choix établissent votre profil chromatique. Nous regardons ensemble ce qu'il met en évidence.",
      },
      {
        title: "Je crée votre préparation.",
        text: "Fleurs, couleurs, sons et cristaux, sélectionnés à partir de votre profil.",
      },
    ],
  },
  universes: {
    label: "Les quatre familles",
    title: { lead: "Fleurs, couleurs,", accent: "sons & cristaux" },
    intro: "Une méthode qui associe les propriétés des couleurs et des sons aux fleurs, aux plantes et aux cristaux.",
    items: [
      {
        key: "fleurs",
        name: "Fleurs",
        caption: "Les élixirs floraux, dans une démarche de bien-être et d'accompagnement émotionnel.",
      },
      {
        key: "couleurs",
        name: "Couleurs",
        caption: "Au cœur de la méthode : vos réactions aux couleurs établissent votre profil.",
      },
      { key: "sons", name: "Sons", caption: "Des élixirs associés aux sons et aux fréquences." },
      {
        key: "cristaux",
        name: "Cristaux",
        caption: "Pour compléter la préparation, dans une démarche d'harmonisation.",
      },
    ],
  },
  bottle: {
    label: "Préparation personnalisée",
    title: { lead: "Votre flacon", accent: "est unique." },
    text: "Il n'existe pas de préparation identique pour tout le monde. La vôtre est élaborée à partir de votre profil chromatique, de votre situation et de votre objectif, pour accompagner :",
    periods:
      "le stress, la confiance en soi, le lâcher-prise, les peurs, les périodes de changement, les relations, le besoin de sérénité, la connaissance de soi.",
    cta: "Demander une préparation",
  },
  places: {
    cabinet: { title: { lead: "À", accent: "Lacanau" }, caption: "Au cabinet — Sur rendez-vous" },
    distance: { title: { lead: "À", accent: "distance" }, caption: "Par téléphone — Votre support couleurs vous est envoyé" },
  },
  shop: {
    label: "Boutique",
    title: { lead: "Les flacons", accent: "thématiques" },
    link: "Voir les 8 flacons",
    addToCart: "Ajouter au panier",
  },
  pricing: {
    label: "Tarifs",
    title: { lead: "Simple", accent: "& clair" },
    note: "Acompte de {deposit} à la réservation, déduit du prix. Pas de durée imposée : nous prenons le temps dont vous avez besoin.",
    link: "Tous les tarifs",
  },
  faqLabel: "Questions fréquentes",
  final: {
    title: { lead: "Mieux vous comprendre,", accent: "mieux vous accompagner." },
    primary: "Prendre rendez-vous",
    secondary: "Appel découverte offert",
  },
};
