import type { BlendsContent } from "../types";

/** Les Préparations personnalisées — textes validés par la cliente (section 7.4) */
export const blends: BlendsContent = {
  seo: {
    title: "Préparation personnalisée : élixirs de fleurs, couleurs, sons et cristaux | NLIGHT",
    description:
      "Un flacon créé spécialement pour vous à partir de votre Profil Chromatique : élixirs floraux, couleurs, sons et cristaux selon la méthode Chromobioénergie®.",
  },
  hero: {
    label: "Préparations",
    title: "Préparations",
    accent: "personnalisées",
    subtitle: "Un flacon créé spécialement pour vous.",
  },
  intro:
    "À la suite de votre Test de Profil Chromatique, je peux créer une préparation personnalisée en fonction de votre profil et de vos besoins. Chaque préparation est différente. Elle peut associer plusieurs familles d'élixirs : *fleurs, couleurs, sons et cristaux.*",
  why: {
    label: "Pourquoi",
    title: { lead: "Pourquoi une préparation", accent: "personnalisée ?" },
    text: "Nous ne réagissons pas tous de la même manière face aux situations de la vie. Une même situation peut provoquer de la peur chez une personne, du stress chez une autre, ou au contraire de la colère ou du découragement. C'est pourquoi je ne propose pas un flacon identique pour tout le monde. Votre préparation est construite à partir de votre profil et de ce que vous souhaitez travailler.",
  },
  families: {
    label: "Les 4 familles",
    title: { lead: "Quatre familles", accent: "d'élixirs" },
    items: [
      {
        key: "fleurs",
        title: "Les fleurs",
        text: "Les élixirs floraux sont utilisés traditionnellement pour accompagner différents états émotionnels. Ils peuvent notamment être intégrés dans une démarche autour de la confiance en soi, des peurs, du stress, du changement ou du lâcher-prise.",
      },
      {
        key: "couleurs",
        title: "Les couleurs",
        text: "Les couleurs sont au cœur de mon approche. Chaque couleur possède ses propres caractéristiques. Votre profil permet de déterminer les couleurs qui occupent une place particulière dans votre équilibre personnel.",
      },
      {
        key: "sons",
        title: "Les sons",
        text: "Certains élixirs sont également associés à des fréquences sonores. Ils complètent le travail réalisé avec les couleurs et les fleurs.",
      },
      {
        key: "cristaux",
        title: "Les cristaux",
        text: "Les élixirs de cristaux peuvent également entrer dans la composition de votre préparation. Ils sont utilisés dans une démarche de bien-être et d'harmonisation.",
      },
    ],
    mention:
      "C'est la méthode de la Chromobioénergie®, qui utilise les propriétés des couleurs et des sons associées aux fleurs, plantes et cristaux.",
  },
  evolves: {
    label: "Dans le temps",
    title: { lead: "Votre préparation", accent: "évolue avec vous" },
    text: "Votre première préparation correspond à votre profil et à votre situation au moment du test. Si vos besoins évoluent, votre préparation peut également être adaptée. L'objectif est de vous accompagner au plus près de votre parcours.",
  },
  order: {
    label: "Commander",
    title: { lead: "Comment", accent: "commander ?" },
    items: [
      {
        title: "Première fois",
        text: "Prenez rendez-vous pour faire le Test de Profil Chromatique ; après l'analyse, votre préparation personnalisée est créée.",
        cta: "Réserver le Pack Test + préparation personnalisée",
        target: "pack",
      },
      {
        title: "Vous avez déjà fait votre test",
        text: "Votre flacon renouvelé à l'identique ou ajusté selon l'évolution de vos besoins.",
        cta: "Renouveler ou ajuster ma préparation",
        target: "renewal",
      },
      {
        title: "Vous souhaitez commencer simplement",
        text: "Des flacons thématiques prêts à l'emploi, élaborés par Laure, pour un besoin du moment.",
        cta: "Découvrir les flacons thématiques",
        target: "shop",
      },
    ],
  },
  cta: {
    title: { lead: "Votre flacon,", accent: "créé pour vous." },
    button: "Demander une préparation",
  },
  faq: ["how-to-use", "bottle-duration", "blend-evolves", "delays", "bottle-without-test", "medical"],
};
