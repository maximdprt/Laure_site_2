/**
 * Types des contenus de pages. Chaque langue (content/fr, content/en) fournit les mêmes objets.
 * Mise en forme possible dans les textes : **gras**, *serif italique*. Paragraphes séparés par une ligne vide.
 */

export type Seo = { title: string; description: string };
export type Step = { title: string; text: string };
export type Titled = { lead: string; accent?: string };
export type Block = { label?: string; title: Titled; text: string };

export type FaqId =
  | "what-is-test"
  | "need-problem"
  | "remote"
  | "duration"
  | "bottle-without-test"
  | "blend-evolves"
  | "how-to-use"
  | "delays"
  | "cancel"
  | "medical"
  | "colour-blind"
  | "no-right-answer"
  | "bottle-duration"
  | "deposit"
  | "payment-methods"
  | "which-service";

export type FaqBank = Record<FaqId, { question: string; answer: string }>;

export type HomeContent = {
  seo: Seo;
  hero: { label: string; title: string; accent: string; text: string; primary: string; secondary: string };
  method: { label: string; text: string; link: string };
  how: { label: string; title: Titled; steps: Step[] };
  universes: {
    label: string;
    title: Titled;
    intro: string;
    items: { key: "fleurs" | "couleurs" | "sons" | "cristaux"; name: string; caption: string }[];
  };
  bottle: { label: string; title: Titled; text: string; periods: string; cta: string };
  places: { cabinet: { title: Titled; caption: string }; distance: { title: Titled; caption: string } };
  shop: { label: string; title: Titled; link: string; addToCart: string };
  pricing: { label: string; title: Titled; note: string; link: string };
  faqLabel: string;
  final: { title: Titled; primary: string; secondary: string };
};

export type TestContent = {
  seo: Seo;
  hero: { label: string; title: string; accent: string; subtitle: string; cta: string };
  intro: string;
  hook: { label: string; question: string; text: string };
  whatIs: { label: string; title: Titled; text: string; highlight: string };
  why: { label: string; title: Titled; text: string; items: string[]; highlight: string };
  steps: { label: string; title: Titled; items: Step[]; note: string };
  after: { label: string; title: Titled; text: string; link: string };
  remote: { label: string; title: Titled; text: string; steps: string[] };
  price: { label: string; title: Titled; cta: string; depositNote: string };
  faq: FaqId[];
  final: { title: Titled; primary: string; secondary: string };
};

export type SupportContent = {
  seo: Seo;
  hero: { label: string; title: string; accent: string; subtitle: string };
  intro: string;
  situations: { label: string; title: Titled; items: string[]; note: string };
  approach: Block;
  path: Block;
  session: { label: string; title: Titled; text: string; cta: string };
  faq: FaqId[];
  final: { title: Titled; primary: string; secondary: string };
};

export type BlendsContent = {
  seo: Seo;
  hero: { label: string; title: string; accent: string; subtitle: string };
  intro: string;
  why: Block;
  families: {
    label: string;
    title: Titled;
    items: { key: "fleurs" | "couleurs" | "sons" | "cristaux"; title: string; text: string }[];
    mention: string;
  };
  evolves: Block;
  order: {
    label: string;
    title: Titled;
    items: { title: string; text: string; cta: string; target: "pack" | "renewal" | "shop" }[];
  };
  cta: { title: Titled; button: string };
  faq: FaqId[];
};

export type AboutContent = {
  seo: Seo;
  hero: { label: string; title: string; subtitle: string };
  approach: Block;
  forWhom: Block;
  personalised: Block;
  journey: Block;
  training: Block;
  name: Block;
  values: { label: string; title: Titled; items: { title: string; text: string }[] };
  location: { label: string; title: Titled; cabinet: string; remote: string; mapLink: string };
  social: { label: string };
  final: { title: Titled; primary: string; secondary: string };
};

export type PricingContent = {
  seo: Seo;
  hero: { label: string; title: string; accent: string; subtitle: string };
  services: { label: string; title: Titled; mostChosen: string; book: string };
  products: { label: string; title: Titled; readyName: string; readyFormat: string; renewalFormat: string; shopLink: string };
  shipping: { label: string; title: Titled; homeLabel: string; freeFrom: string; pickupLabel: string; free: string };
  deposit: { label: string; title: Titled; text: string };
  cancellation: { label: string; title: Titled; text: string };
  payment: { label: string; title: Titled; online: string; inPerson: string };
  faq: FaqId[];
  final: { title: Titled; primary: string; secondary: string };
};

export type ShopContent = {
  seo: Seo;
  title: Titled;
  label: string;
  intro: string;
  pack: { label: string; title: Titled; text: string; cta: string };
  renewal: { label: string; title: Titled; text: string };
  final: { title: Titled; primary: string; secondary: string };
};

export type PageContents = {
  home: HomeContent;
  test: TestContent;
  support: SupportContent;
  blends: BlendsContent;
  about: AboutContent;
  pricing: PricingContent;
  shop: ShopContent;
  faq: FaqBank;
};
