import type { AboutContent } from "../types";

/** À propos — trame de la section 7.5. Aucun fait inventé : les éléments biographiques sont à compléter. */
export const about: AboutContent = {
  seo: {
    title: "Laure Dupuch, thérapeute holistique et praticienne en Chromobioénergie® | NLIGHT",
    description:
      "Laure Dupuch, thérapeute holistique et praticienne en Chromobioénergie®, vous reçoit à Lacanau et vous accompagne à distance partout en France.",
  },
  hero: {
    label: "À propos",
    title: "Laure Dupuch",
    subtitle: "Thérapeute holistique – Praticienne en Chromobioénergie®",
  },
  approach: {
    label: "Mon approche",
    title: { lead: "Commencer", accent: "par l'écoute" },
    text: "Je crois qu'il n'existe pas de solution identique pour tout le monde. Chaque personne possède son propre profil, son histoire et ses besoins. C'est pour cela que mon accompagnement commence toujours par l'écoute, puis par votre Profil Chromatique.",
  },
  forWhom: {
    label: "Pour qui ?",
    title: { lead: "Pour", accent: "qui ?" },
    text: "Le Test de Profil Chromatique s'adresse aux personnes qui souhaitent mieux se connaître, comprendre certains fonctionnements émotionnels et avancer dans leur développement personnel. Il peut être particulièrement intéressant lors d'une période de changement, de questionnement, ou lorsque vous ressentez le besoin de retrouver davantage d'équilibre intérieur.",
  },
  personalised: {
    label: "Personnalisation",
    title: { lead: "Un accompagnement", accent: "entièrement personnalisé" },
    text: "Je ne propose pas une solution identique pour tout le monde. Chaque personne possède son propre profil, son histoire et ses besoins. C'est pourquoi je prends le temps d'écouter votre situation avant de vous proposer une préparation personnalisée. **Votre profil détermine votre accompagnement.**",
  },
  journey: {
    label: "Mon parcours",
    title: { lead: "Mon", accent: "parcours" },
    text: "[À COMPLÉTER : parcours de Laure, déclic, années de pratique]\n\n[À COMPLÉTER : texte provisoire à remplacer — par exemple : ce qui a amené Laure vers l'accompagnement émotionnel et vers les couleurs.]",
  },
  training: {
    label: "Ma formation",
    title: { lead: "Ma", accent: "formation" },
    text: "Praticienne en Chromobioénergie®.\n\n[À COMPLÉTER : organisme de formation, année, autres formations (florathérapie, etc.)]",
  },
  name: {
    label: "NLIGHT",
    title: { lead: "Pourquoi", accent: "NLIGHT ?" },
    text: "[À COMPLÉTER : signification du nom NLIGHT]\n\n*Découvrez votre Profil Chromatique. Comprenez vos besoins. Recevez votre préparation personnalisée.*",
  },
  values: {
    label: "Mes valeurs",
    title: { lead: "Trois", accent: "valeurs" },
    items: [
      { title: "Écoute", text: "Prendre le temps de comprendre ce que vous vivez, sans jugement." },
      { title: "Personnalisation", text: "Un profil, une histoire, des besoins : un accompagnement qui vous correspond." },
      { title: "Bienveillance", text: "Un cadre calme et respectueux, à votre rythme." },
    ],
  },
  location: {
    label: "Où me trouver",
    title: { lead: "À Lacanau", accent: "ou à distance" },
    cabinet: "Je vous reçois au cabinet à Lacanau, sur rendez-vous.",
    remote:
      "Le Test de Profil Chromatique peut également être réalisé à distance, partout en France : vous recevez au préalable votre support couleurs, puis nous échangeons par téléphone.",
    mapLink: "Voir sur Google Maps",
  },
  social: { label: "Suivre Laure" },
  final: {
    title: { lead: "Faisons", accent: "connaissance." },
    primary: "Prendre rendez-vous",
    secondary: "Réserver un appel découverte",
  },
};
