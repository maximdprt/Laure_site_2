import type { TestContent } from "../types";

/** Le Test de Profil Chromatique — textes validés par la cliente (section 7.2) */
export const test: TestContent = {
  seo: {
    title: "Test de Profil Chromatique : ce que vos couleurs disent de vous | NLIGHT",
    description:
      "Découvrez votre Profil Chromatique avec Laure Dupuch, praticienne en Chromobioénergie®. Un outil de connaissance de soi par les couleurs, à Lacanau ou à distance.",
  },
  hero: {
    label: "Le Test",
    title: "Test de Profil",
    accent: "Chromatique",
    subtitle: "Découvrez ce que vos couleurs disent de votre profil.",
    cta: "Réserver mon test",
  },
  intro:
    "Le Test de Profil Chromatique est une méthode basée sur votre perception et votre choix des couleurs. Pendant le test, vous êtes invité(e) à choisir différentes couleurs selon votre attirance ou votre ressenti. Vos réponses permettent d'établir *votre Profil Chromatique personnel.*",
  hook: {
    label: "Pour vous ?",
    question:
      "Vous vous sentez stressé(e), bloqué(e), fatigué(e) émotionnellement ou simplement à un moment de votre vie où vous avez besoin de changement ?",
    text: "Le Test de Profil Chromatique vous permet de mieux comprendre votre fonctionnement émotionnel à travers votre relation aux couleurs. À partir de votre profil, je vous accompagne avec une approche personnalisée basée sur les fleurs, les couleurs, les sons et les cristaux. Chaque préparation est créée en fonction de votre profil et de vos besoins.",
  },
  whatIs: {
    label: "Qu'est-ce que c'est ?",
    title: { lead: "Le Test de Profil Chromatique :", accent: "qu'est-ce que c'est ?" },
    text: "Le Test de Profil Chromatique est une méthode qui utilise les couleurs pour établir votre profil personnel. Vous êtes invité(e) à choisir différentes couleurs selon ce que vous ressentez. Vos choix permettent d'établir une représentation de votre profil chromatique. Cette lecture permet ensuite d'identifier les domaines émotionnels qui peuvent avoir besoin d'attention.",
    highlight: "L'objectif est simple : *mieux vous comprendre pour mieux vous accompagner.*",
  },
  why: {
    label: "Pourquoi",
    title: { lead: "Pourquoi faire un Test", accent: "de Profil Chromatique ?" },
    text: "Nous avons tous une relation différente aux couleurs. Certaines nous attirent immédiatement. D'autres nous laissent indifférents ou peuvent même provoquer un rejet. Le Test de Profil Chromatique utilise ces réactions pour établir une lecture personnalisée de votre profil. Il permet d'ouvrir une réflexion sur :",
    items: [
      "vos émotions",
      "vos besoins du moment",
      "vos ressources personnelles",
      "certains blocages",
      "votre manière de fonctionner",
      "vos aspirations",
    ],
    highlight: "Le test est avant tout *un outil de connaissance de soi.*",
  },
  steps: {
    label: "Déroulé",
    title: { lead: "Comment se déroule", accent: "le test ?" },
    items: [
      {
        title: "L'échange",
        text: "Nous faisons le point sur votre situation et sur ce qui vous amène à consulter.",
      },
      {
        title: "Le test des couleurs",
        text: "Vous choisissez différentes couleurs selon votre ressenti. Il n'y a ni bonne ni mauvaise réponse. Ce qui compte est votre perception personnelle.",
      },
      {
        title: "Votre profil",
        text: "Vos choix permettent d'établir votre Profil Chromatique. Nous analysons ensemble les différentes informations qui ressortent du test.",
      },
      {
        title: "Votre accompagnement",
        text: "À partir de votre profil, nous déterminons les outils qui peuvent vous accompagner au mieux. Une préparation personnalisée peut alors être créée.",
      },
    ],
    note: "Pas de durée imposée : nous prenons le temps dont vous avez besoin.",
  },
  after: {
    label: "Et après",
    title: { lead: "Et après", accent: "le test ?" },
    text: "Le test n'est pas une fin en soi. Il constitue le point de départ d'un accompagnement personnalisé. Selon votre profil et votre objectif, je peux vous proposer une préparation associant **fleurs, couleurs, sons et cristaux.** Votre préparation est élaborée spécifiquement pour vous.",
    link: "Découvrir les préparations personnalisées",
  },
  remote: {
    label: "À distance",
    title: { lead: "Le test peut-il être réalisé", accent: "à distance ?" },
    text: "Oui. Le Test de Profil Chromatique peut être réalisé à distance, où que vous soyez en France.",
    steps: [
      "Vous réservez votre créneau et indiquez votre adresse postale.",
      "Vous recevez votre support couleurs par courrier ou en PDF.",
      "Nous réalisons le test ensemble par téléphone.",
    ],
  },
  price: {
    label: "Tarif",
    title: { lead: "Réserver", accent: "votre test" },
    cta: "Prendre rendez-vous",
    depositNote: "Acompte de {deposit} à la réservation, déduit du prix.",
  },
  faq: ["what-is-test", "no-right-answer", "duration", "remote", "colour-blind", "medical"],
  final: {
    title: { lead: "Découvrez votre", accent: "Profil Chromatique." },
    primary: "Réserver mon test",
    secondary: "Appel découverte offert",
  },
};
