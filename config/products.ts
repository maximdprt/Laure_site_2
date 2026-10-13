import type { Localized } from "@/lib/i18n-types";
import type { ImageKey } from "./images";

/**
 * Produits de la boutique.
 * ➜ Modifier un prix : `priceCents` (en centimes : 2200 = 22 €).
 * ➜ Rupture de stock : passer `inStock` à false (le bouton devient « Bientôt disponible »).
 * [À COMPLÉTER : composition, contenance et conseils d'utilisation de chaque flacon]
 */

export type Universe = "fleurs" | "couleurs" | "sons" | "cristaux";
export type ProductTheme = "apaisement" | "equilibre" | "elan" | "personnalise";

export type Product = {
  slug: string;
  type: "ready" | "custom";
  theme: ProductTheme;
  name: Localized;
  tagline: Localized;
  description: Localized;
  composition: Localized;
  usage: Localized;
  volume: Localized;
  priceCents: number;
  image: ImageKey;
  /** Couleur d'accent (un des 4 univers) */
  color: Universe;
  inStock: boolean;
};

const TODO_COMPOSITION: Localized = {
  fr: "[À COMPLÉTER : composition du flacon]",
  en: "[TO COMPLETE: bottle composition]",
};
const TODO_USAGE: Localized = {
  fr: "[À COMPLÉTER : conseils d'utilisation]",
  en: "[TO COMPLETE: how to use]",
};
const VOLUME: Localized = { fr: "30 ml [À COMPLÉTER : à confirmer]", en: "30 ml [TO COMPLETE: to be confirmed]" };
const READY_PRICE_CENTS = 2200;

export const productThemes: Record<ProductTheme, Localized> = {
  apaisement: { fr: "Apaisement", en: "Calm" },
  equilibre: { fr: "Équilibre émotionnel", en: "Emotional balance" },
  elan: { fr: "Élan", en: "Momentum" },
  personnalise: { fr: "Personnalisé", en: "Personalised" },
};

export const RENEWAL_SLUG = "preparation-personnalisee-renouvellement";

export const products: Product[] = [
  {
    slug: "serenite-detente",
    type: "ready",
    theme: "apaisement",
    name: { fr: "Sérénité & détente", en: "Serenity & calm" },
    tagline: {
      fr: "Pour accompagner les moments où vous souhaitez retrouver calme et douceur.",
      en: "To accompany the moments when you wish to find calm and gentleness again.",
    },
    description: {
      fr: "Un flacon thématique pensé comme un allié des journées chargées. Il s'intègre à un petit rituel de pause, pour vous accorder un temps de calme et de douceur.",
      en: "A themed bottle designed as a companion for busy days. It fits into a small ritual of pause, giving you a moment of calm and gentleness.",
    },
    composition: TODO_COMPOSITION,
    usage: TODO_USAGE,
    volume: VOLUME,
    priceCents: READY_PRICE_CENTS,
    image: "flacon-serenite-detente",
    color: "sons",
    inStock: true,
  },
  {
    slug: "confiance-en-soi",
    type: "ready",
    theme: "equilibre",
    name: { fr: "Confiance en soi", en: "Self-confidence" },
    tagline: {
      fr: "Pour accompagner une démarche d'affirmation et d'estime de soi.",
      en: "To accompany a journey towards self-assertion and self-esteem.",
    },
    description: {
      fr: "Un flacon thématique pour les périodes où vous souhaitez prendre votre place, oser davantage et cultiver une image de vous plus bienveillante.",
      en: "A themed bottle for the times when you wish to take your place, dare a little more and nurture a kinder view of yourself.",
    },
    composition: TODO_COMPOSITION,
    usage: TODO_USAGE,
    volume: VOLUME,
    priceCents: READY_PRICE_CENTS,
    image: "flacon-confiance-en-soi",
    color: "couleurs",
    inStock: true,
  },
  {
    slug: "lacher-prise",
    type: "ready",
    theme: "apaisement",
    name: { fr: "Lâcher-prise", en: "Letting go" },
    tagline: {
      fr: "Pour accompagner les périodes où l'on souhaite relâcher le contrôle.",
      en: "To accompany the times when you wish to loosen your need for control.",
    },
    description: {
      fr: "Un flacon thématique pour les moments où tout semble devoir être maîtrisé. Il accompagne une démarche de détente et d'acceptation, à votre rythme.",
      en: "A themed bottle for the moments when everything seems to need controlling. It accompanies a gentle process of relaxing and accepting, at your own pace.",
    },
    composition: TODO_COMPOSITION,
    usage: TODO_USAGE,
    volume: VOLUME,
    priceCents: READY_PRICE_CENTS,
    image: "flacon-lacher-prise",
    color: "fleurs",
    inStock: true,
  },
  {
    slug: "sommeil",
    type: "ready",
    theme: "apaisement",
    name: { fr: "Sommeil", en: "Restful nights" },
    tagline: {
      fr: "Pour accompagner votre rituel du soir et vos moments de détente.",
      en: "To accompany your evening ritual and your moments of relaxation.",
    },
    description: {
      fr: "Un flacon thématique à associer à votre rituel du soir : lumière tamisée, respiration lente, un temps rien qu'à vous avant la nuit.",
      en: "A themed bottle to pair with your evening ritual: soft light, slow breathing, a moment just for you before the night.",
    },
    composition: TODO_COMPOSITION,
    usage: TODO_USAGE,
    volume: VOLUME,
    priceCents: READY_PRICE_CENTS,
    image: "flacon-sommeil",
    color: "cristaux",
    inStock: true,
  },
  {
    slug: "gestion-des-emotions",
    type: "ready",
    theme: "equilibre",
    name: { fr: "Gestion des émotions", en: "Managing emotions" },
    tagline: {
      fr: "Pour accompagner les périodes émotionnellement chargées.",
      en: "To accompany emotionally intense periods.",
    },
    description: {
      fr: "Un flacon thématique pour les périodes où les émotions prennent beaucoup de place. Il accompagne une démarche d'accueil et d'équilibre intérieur.",
      en: "A themed bottle for the times when emotions take up a lot of room. It accompanies a process of welcoming them and finding inner balance.",
    },
    composition: TODO_COMPOSITION,
    usage: TODO_USAGE,
    volume: VOLUME,
    priceCents: READY_PRICE_CENTS,
    image: "flacon-gestion-des-emotions",
    color: "fleurs",
    inStock: true,
  },
  {
    slug: "energie-vitalite",
    type: "ready",
    theme: "elan",
    name: { fr: "Énergie & vitalité", en: "Energy & vitality" },
    tagline: {
      fr: "Pour accompagner les moments où vous souhaitez retrouver de l'élan.",
      en: "To accompany the moments when you wish to find your momentum again.",
    },
    description: {
      fr: "Un flacon thématique lumineux pour les saisons de reprise, de nouveaux projets ou de remise en mouvement.",
      en: "A bright themed bottle for seasons of new beginnings, fresh projects or getting moving again.",
    },
    composition: TODO_COMPOSITION,
    usage: TODO_USAGE,
    volume: VOLUME,
    priceCents: READY_PRICE_CENTS,
    image: "flacon-energie-vitalite",
    color: "couleurs",
    inStock: true,
  },
  {
    slug: "protection",
    type: "ready",
    theme: "equilibre",
    name: { fr: "Protection", en: "Protection" },
    tagline: {
      fr: "Pour accompagner un besoin de se sentir centré(e) et préservé(e).",
      en: "To accompany a need to feel centred and sheltered.",
    },
    description: {
      fr: "Un flacon thématique pour les environnements intenses ou les périodes où vous avez besoin de vous recentrer et de préserver votre espace intérieur.",
      en: "A themed bottle for intense surroundings or times when you need to recentre and protect your inner space.",
    },
    composition: TODO_COMPOSITION,
    usage: TODO_USAGE,
    volume: VOLUME,
    priceCents: READY_PRICE_CENTS,
    image: "flacon-protection",
    color: "cristaux",
    inStock: true,
  },
  {
    slug: "ressource",
    type: "ready",
    theme: "elan",
    name: { fr: "Ressource", en: "Replenish" },
    tagline: {
      fr: "Pour accompagner les périodes où l'on souhaite se ressourcer.",
      en: "To accompany the times when you wish to recharge.",
    },
    description: {
      fr: "Un flacon thématique inspiré de la nature, pour les moments où vous ressentez le besoin de revenir à l'essentiel et de vous ressourcer.",
      en: "A themed bottle inspired by nature, for the moments when you feel the need to return to what matters and recharge.",
    },
    composition: TODO_COMPOSITION,
    usage: TODO_USAGE,
    volume: VOLUME,
    priceCents: READY_PRICE_CENTS,
    image: "flacon-ressource",
    color: "sons",
    inStock: true,
  },
  {
    slug: RENEWAL_SLUG,
    type: "custom",
    theme: "personnalise",
    name: {
      fr: "Renouveler ou ajuster ma préparation personnalisée",
      en: "Renew or adjust my personalised blend",
    },
    tagline: {
      fr: "Votre flacon unique, renouvelé ou ajusté selon l'évolution de vos besoins.",
      en: "Your unique bottle, renewed or adjusted as your needs evolve.",
    },
    description: {
      fr: "Vous avez déjà réalisé votre Test de Profil Chromatique ? Laure renouvelle votre préparation à l'identique ou l'ajuste selon l'évolution de votre situation. Lors du paiement, indiquez le nom utilisé lors du test et sa date approximative.",
      en: "Have you already taken your Chromatic Profile Test? Laure renews your blend as it was or adjusts it to how your situation has evolved. At checkout, please give the name used for your test and its approximate date.",
    },
    composition: {
      fr: "Composition personnalisée, établie à partir de votre Profil Chromatique.",
      en: "Personalised composition, based on your Chromatic Profile.",
    },
    usage: TODO_USAGE,
    volume: VOLUME,
    priceCents: 2500,
    image: "preparation",
    color: "couleurs",
    inStock: true,
  },
];

export const readyProducts = products.filter((p) => p.type === "ready");

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
