import type { Localized } from "@/lib/i18n-types";

/**
 * Images du site, à déposer dans public/images/ (générées à partir de PROMPTS_IMAGES_NLIGHT.md).
 * Tant qu'un fichier est absent, un placeholder en dégradé évoquant la photo s'affiche,
 * avec l'étiquette « IMAGE 0X — NOM ».
 * Règle : aucune image générée par IA ne représente Laure.
 */

export type ImageRatio = "16/9" | "9/16" | "4/5" | "3/4" | "3/2";

export type SiteImage = {
  /** Numéro affiché sur le placeholder (01 à 18) */
  number: string;
  /** Nom court affiché sur le placeholder */
  name: string;
  src: string;
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
    fr: `Flacon compte-gouttes en verre ambré, ${fr}`,
    en: `Amber glass dropper bottle, ${en}`,
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
      fr: "Flacons compte-gouttes en verre ambré dans une lumière dorée, reflets colorés derrière le verre",
      en: "Amber glass dropper bottles in golden light, with coloured reflections behind the glass",
    },
    placeholder: ["#3b2c20", "#8a5a33", "#1a130e"],
  },
  "hero-mobile": {
    number: "01",
    name: "Hero mobile",
    src: "/images/hero-mobile.jpg",
    ratio: "9/16",
    alt: {
      fr: "Flacons compte-gouttes en verre ambré dans une lumière dorée, reflets colorés derrière le verre",
      en: "Amber glass dropper bottles in golden light, with coloured reflections behind the glass",
    },
    placeholder: ["#3b2c20", "#8a5a33", "#1a130e"],
  },
  "test-couleurs": {
    number: "02",
    name: "Test couleurs",
    src: "/images/test-couleurs.jpg",
    ratio: "4/5",
    alt: {
      fr: "Mains posées près d'un éventail de cartes de couleurs unies disposées en arc",
      en: "Hands resting near a fan of plain colour cards arranged in an arc",
    },
    placeholder: ["#c9b9a3", "#9a7f63", "#4a3b2e"],
  },
  "univers-fleurs": {
    number: "03",
    name: "Fleurs",
    src: "/images/univers-fleurs.jpg",
    ratio: "3/4",
    alt: {
      fr: "Fleurs sauvages fraîches dans un bol d'eau claire, à contre-jour",
      en: "Fresh wild flowers in a bowl of clear water, backlit",
    },
    placeholder: ["#d9c2b8", "#a8786d", "#4d332d"],
  },
  "univers-couleurs": {
    number: "04",
    name: "Couleurs",
    src: "/images/univers-couleurs.jpg",
    ratio: "3/4",
    alt: {
      fr: "Lumière traversant un prisme de verre et projetant un spectre doux",
      en: "Light passing through a glass prism and casting a soft spectrum",
    },
    placeholder: ["#e1cfa6", "#b58a45", "#4f3a1f"],
  },
  "univers-sons": {
    number: "05",
    name: "Sons",
    src: "/images/univers-sons.jpg",
    ratio: "3/4",
    alt: {
      fr: "Diapason et bol chantant en métal dans la lumière du matin",
      en: "A tuning fork and a metal singing bowl in the morning light",
    },
    placeholder: ["#b9c0c4", "#6f7c86", "#262b30"],
  },
  "univers-cristaux": {
    number: "06",
    name: "Cristaux",
    src: "/images/univers-cristaux.jpg",
    ratio: "3/4",
    alt: {
      fr: "Améthyste, quartz rose et cristal de roche posés sur une pierre plate",
      en: "Amethyst, rose quartz and rock crystal on a flat stone",
    },
    placeholder: ["#cfc4d6", "#8b7b98", "#2e2735"],
  },
  preparation: {
    number: "07",
    name: "Préparation",
    src: "/images/preparation.jpg",
    ratio: "3/4",
    alt: {
      fr: "Flacon en verre ambré à étiquette kraft, entouré de pétales et d'un petit cristal",
      en: "Amber glass bottle with a kraft label, surrounded by petals and a small crystal",
    },
    placeholder: ["#4a3727", "#a06a3c", "#1d150f"],
  },
  lacanau: {
    number: "08",
    name: "Lacanau",
    src: "/images/lacanau.jpg",
    ratio: "4/5",
    alt: {
      fr: "Dune et océan à Lacanau au lever du soleil, pins maritimes dans une lumière dorée",
      en: "Dune and ocean at Lacanau at sunrise, maritime pines in golden light",
    },
    placeholder: ["#c7b48e", "#7d8a86", "#2b3433"],
  },
  distance: {
    number: "09",
    name: "Distance",
    src: "/images/distance.jpg",
    ratio: "4/5",
    alt: {
      fr: "Enveloppe kraft ouverte contenant des cartes de couleurs, téléphone posé à côté sur un plaid en lin",
      en: "An open kraft envelope holding colour cards, with a phone beside it on a linen throw",
    },
    placeholder: ["#cdbfa8", "#8f7a5e", "#3a3026"],
  },
  cta: {
    number: "10",
    name: "Section finale",
    src: "/images/cta.jpg",
    ratio: "16/9",
    alt: {
      fr: "Lumière douce du soir sur un flacon ambré posé près d'une fenêtre ouverte",
      en: "Soft evening light on an amber bottle near an open window",
    },
    placeholder: ["#2f2620", "#6e4e36", "#120e0b"],
  },
  "flacon-serenite-detente": flacon("11", "serenite-detente", "Sérénité", "lueur bleu brume et plume", "misty blue glow and a feather", "#55687a"),
  "flacon-confiance-en-soi": flacon("12", "confiance-en-soi", "Confiance", "lueur or doux", "soft golden glow", "#9a7a35"),
  "flacon-lacher-prise": flacon("13", "lacher-prise", "Lâcher-prise", "feuille qui tombe, lueur rosée", "falling leaf and a rosy glow", "#8a5f5a"),
  "flacon-sommeil": flacon("14", "sommeil", "Sommeil", "croissant de lune et lueur lavande", "crescent moon and lavender glow", "#5f5578"),
  "flacon-gestion-des-emotions": flacon("15", "gestion-des-emotions", "Émotions", "eau et lueur rose poudré", "water and powder-pink glow", "#8d6662"),
  "flacon-energie-vitalite": flacon("16", "energie-vitalite", "Énergie", "rayon de soleil et agrumes", "a ray of sunshine and citrus fruit", "#a3702c"),
  "flacon-protection": flacon("17", "protection", "Protection", "tourmaline noire, lueur profonde", "black tourmaline and a deep glow", "#3d3a36"),
  "flacon-ressource": flacon("18", "ressource", "Ressource", "galet et mousse, lueur verte", "pebble and moss, green glow", "#55613f"),
  "laure-portrait": {
    // [À COMPLÉTER : vraie photo de Laure — ne jamais utiliser d'image générée par IA ici]
    number: "—",
    name: "Portrait de Laure (vraie photo)",
    src: "/images/laure-portrait.jpg",
    ratio: "4/5",
    alt: { fr: "Portrait de Laure Dupuch", en: "Portrait of Laure Dupuch" },
    placeholder: ["#d8d4cc", "#a29d93", "#5b5750"],
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
