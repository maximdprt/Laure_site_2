import type { Localized } from "@/lib/i18n-types";

/**
 * Images du site, dans public/images/.
 * ➜ Remplacer une image : déposer un fichier du même nom ; adapter le texte alternatif (alt) ci-dessous.
 * Tant qu'un fichier est absent, un placeholder en dégradé s'affiche avec l'étiquette « IMAGE 0X — NOM ».
 * Règle : aucune image générée par IA ne représente Laure (laure-portrait.jpg = vraie photo).
 */

export type ImageRatio = "16/9" | "9/16" | "4/5" | "3/4" | "3/2";

export type SiteImage = {
  /** Numéro affiché sur le placeholder */
  number: string;
  /** Nom court affiché sur le placeholder */
  name: string;
  src: string;
  /** Ratio d'affichage par défaut (l'image est recadrée au besoin) */
  ratio: ImageRatio;
  alt: Localized;
  /** Couleurs du dégradé de remplacement (du haut vers le bas) */
  placeholder: [string, string, string];
};

const flacon = (
  number: string,
  slug: string,
  name: string,
  fr: string,
  en: string,
  glow: string,
): SiteImage => ({
  number,
  name: `Flacon ${name}`,
  src: `/images/flacon-${slug}.jpg`,
  ratio: "4/5",
  alt: {
    fr: `Flacon compte-gouttes en verre ambré à étiquette blanche, ${fr}`,
    en: `Amber glass dropper bottle with a white label, ${en}`,
  },
  placeholder: ["#2a211a", glow, "#14100c"],
});

export const images = {
  hero: {
    number: "01",
    name: "Hero",
    src: "/images/hero.jpg",
    ratio: "16/9",
    alt: {
      fr: "Flacon compte-gouttes en verre ambré posé sur une pierre, traversé par un arc-en-ciel de lumière, fleurs séchées dans la pénombre",
      en: "Amber glass dropper bottle on a stone, crossed by a rainbow of light, with dried flowers in soft shadow",
    },
    placeholder: ["#3b2c20", "#8a5a33", "#1a130e"],
  },
  "hero-mobile": {
    number: "01",
    name: "Hero mobile",
    src: "/images/hero-mobile.jpg",
    ratio: "9/16",
    alt: {
      fr: "Flacon compte-gouttes en verre ambré dans une lumière chaude, reflet arc-en-ciel sur le mur et fleurs séchées",
      en: "Amber glass dropper bottle in warm light, with a rainbow reflection on the wall and dried flowers",
    },
    placeholder: ["#3b2c20", "#8a5a33", "#1a130e"],
  },
  "test-couleurs": {
    number: "02",
    name: "Test couleurs",
    src: "/images/test-couleurs.jpg",
    ratio: "4/5",
    alt: {
      fr: "Main choisissant une carte parmi un éventail de cartes de couleurs unies posées sur un tissu clair",
      en: "A hand picking one card from a fan of plain colour cards laid on a light fabric",
    },
    placeholder: ["#c9b9a3", "#9a7f63", "#4a3b2e"],
  },
  "univers-fleurs": {
    number: "03",
    name: "Fleurs",
    src: "/images/univers-fleurs.jpg",
    ratio: "3/4",
    alt: {
      fr: "Bol en verre rempli d'eau claire où flottent des fleurs de camomille et des pétales de rose",
      en: "Glass bowl of clear water with floating chamomile flowers and rose petals",
    },
    placeholder: ["#d9c2b8", "#a8786d", "#4d332d"],
  },
  "univers-couleurs": {
    number: "04",
    name: "Couleurs",
    src: "/images/univers-couleurs.jpg",
    ratio: "3/4",
    alt: {
      fr: "Prisme de verre projetant un arc-en-ciel sur un mur clair",
      en: "A glass prism casting a rainbow onto a light wall",
    },
    placeholder: ["#e1cfa6", "#b58a45", "#4f3a1f"],
  },
  "univers-sons": {
    number: "05",
    name: "Sons",
    src: "/images/univers-sons.jpg",
    ratio: "3/4",
    alt: {
      fr: "Bol chantant en laiton et son maillet en bois dans une lumière chaude",
      en: "A brass singing bowl and its wooden mallet in warm light",
    },
    placeholder: ["#b9c0c4", "#6f7c86", "#262b30"],
  },
  "univers-cristaux": {
    number: "06",
    name: "Cristaux",
    src: "/images/univers-cristaux.jpg",
    ratio: "3/4",
    alt: {
      fr: "Améthyste, quartz rose et pointe de cristal de roche posés sur une pierre claire",
      en: "Amethyst, rose quartz and a rock crystal point on a pale stone",
    },
    placeholder: ["#cfc4d6", "#8b7b98", "#2e2735"],
  },
  preparation: {
    number: "07",
    name: "Préparation",
    src: "/images/preparation.jpg",
    ratio: "3/4",
    alt: {
      fr: "Pipette déposant une goutte dans un flacon ambré, à côté d'un cristal et de fleurs séchées",
      en: "A pipette releasing a drop into an amber bottle, beside a crystal and dried flowers",
    },
    placeholder: ["#4a3727", "#a06a3c", "#1d150f"],
  },
  lacanau: {
    number: "08",
    name: "Lacanau",
    src: "/images/lacanau.jpg",
    ratio: "4/5",
    alt: {
      fr: "Dune de Lacanau bordée de pins maritimes face à l'océan",
      en: "A Lacanau dune lined with maritime pines facing the ocean",
    },
    placeholder: ["#c7b48e", "#7d8a86", "#2b3433"],
  },
  distance: {
    number: "09",
    name: "Distance",
    src: "/images/distance.jpg",
    ratio: "4/5",
    alt: {
      fr: "Enveloppe kraft ouverte contenant des cartes de couleurs, téléphone et tasse de tisane posés sur un tissu en lin",
      en: "An open kraft envelope holding colour cards, with a phone and a cup of herbal tea on linen",
    },
    placeholder: ["#cdbfa8", "#8f7a5e", "#3a3026"],
  },
  cta: {
    number: "10",
    name: "Section finale",
    src: "/images/cta.jpg",
    ratio: "16/9",
    alt: {
      fr: "Dunes et océan au coucher du soleil, lumière dorée sur le sable",
      en: "Dunes and ocean at sunset, golden light on the sand",
    },
    placeholder: ["#2f2620", "#6e4e36", "#120e0b"],
  },
  cabinet: {
    number: "19",
    name: "Cabinet",
    src: "/images/cabinet.jpg",
    ratio: "16/9",
    alt: {
      fr: "Pièce lumineuse et apaisante : table de séance, fauteuil, plantes et grande fenêtre",
      en: "A bright, calm room: session table, armchair, plants and a large window",
    },
    placeholder: ["#d8cdbd", "#a8957c", "#4a3f33"],
  },
  "flacons-cabinet": {
    number: "20",
    name: "Flacons",
    src: "/images/flacons-cabinet.jpg",
    ratio: "16/9",
    alt: {
      fr: "Rangée de flacons compte-gouttes ambrés sur une étagère en bois, fleurs des champs à côté",
      en: "A row of amber dropper bottles on a wooden shelf, with wild flowers beside them",
    },
    placeholder: ["#4a3727", "#a06a3c", "#1d150f"],
  },
  "lacanau-detente": {
    number: "21",
    name: "Lacanau chemin",
    src: "/images/lacanau-detente.jpg",
    ratio: "16/9",
    alt: {
      fr: "Chemin de sable entre les dunes menant à la plage de Lacanau, palissade en bois",
      en: "A sandy path through the dunes leading to Lacanau beach, with a wooden fence",
    },
    placeholder: ["#c7b48e", "#7d8a86", "#2b3433"],
  },
  "flacon-serenite-detente": flacon("11", "serenite-detente", "Sérénité", "plume blanche et halo bleu brume", "white feather and a misty blue glow", "#55687a"),
  "flacon-confiance-en-soi": flacon("12", "confiance-en-soi", "Confiance", "citrine et halo or doux", "citrine and a soft golden glow", "#9a7a35"),
  "flacon-lacher-prise": flacon("13", "lacher-prise", "Lâcher-prise", "feuilles d'eucalyptus sur fond clair", "eucalyptus leaves on a light background", "#8a5f5a"),
  "flacon-sommeil": flacon("14", "sommeil", "Sommeil", "brins de lavande et halo mauve", "lavender sprigs and a mauve glow", "#5f5578"),
  "flacon-gestion-des-emotions": flacon("15", "gestion-des-emotions", "Émotions", "pétales de rose et halo rose poudré", "rose petals and a powder-pink glow", "#8d6662"),
  "flacon-energie-vitalite": flacon("16", "energie-vitalite", "Énergie", "tranche d'orange séchée et halo doré", "dried orange slice and a golden glow", "#a3702c"),
  "flacon-protection": flacon("17", "protection", "Protection", "tourmaline noire et halo vert sauge", "black tourmaline and a sage-green glow", "#3d3a36"),
  "flacon-ressource": flacon("18", "ressource", "Ressource", "galets et mousse, halo vert", "pebbles and moss, green glow", "#55613f"),
  "laure-portrait": {
    // Vraie photo de Laure — ne jamais remplacer par une image générée par IA
    number: "—",
    name: "Portrait de Laure",
    src: "/images/laure-portrait.jpg",
    ratio: "4/5",
    alt: { fr: "Portrait en noir et blanc de Laure Dupuch, souriante", en: "Black and white portrait of Laure Dupuch, smiling" },
    placeholder: ["#d8d4cc", "#a29d93", "#5b5750"],
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
