// EN: à faire relire
import type { BlendsContent } from "../types";

export const blends: BlendsContent = {
  seo: {
    title: "Personalised blends: flower, colour, sound and crystal essences | NLIGHT",
    description:
      "A bottle created just for you from your Chromatic Profile: flower, colour, sound and crystal essences following the Chromobioénergie® method.",
  },
  hero: {
    label: "Blends",
    title: "Personalised",
    accent: "blends",
    subtitle: "A bottle created just for you.",
  },
  intro:
    "Following your Chromatic Profile Test, I can create a personalised blend according to your profile and your needs. Every blend is different. It may combine several families of essences: *flowers, colours, sounds and crystals.*",
  why: {
    label: "Why",
    title: { lead: "Why a personalised", accent: "blend?" },
    text: "We do not all react in the same way to life's situations. The same situation can cause fear in one person, stress in another, or anger or discouragement instead. That is why I do not offer the same bottle to everyone. Your blend is built from your profile and from what you wish to work on.",
  },
  families: {
    label: "The 4 families",
    title: { lead: "Four families", accent: "of essences" },
    items: [
      {
        key: "fleurs",
        title: "Flowers",
        text: "Flower essences are traditionally used to accompany different emotional states. They can be part of an approach centred on self-confidence, fears, stress, change or letting go.",
      },
      {
        key: "couleurs",
        title: "Colours",
        text: "Colours are at the heart of my approach. Each colour has its own characteristics. Your profile shows which colours hold a particular place in your personal balance.",
      },
      {
        key: "sons",
        title: "Sounds",
        text: "Some essences are also associated with sound frequencies. They complement the work done with colours and flowers.",
      },
      {
        key: "cristaux",
        title: "Crystals",
        text: "Crystal essences may also be part of your blend. They are used as part of a well-being and harmonising approach.",
      },
    ],
    mention:
      "This is the Chromobioénergie® method, which uses the properties of colours and sounds combined with flowers, plants and crystals.",
  },
  evolves: {
    label: "Over time",
    title: { lead: "Your blend", accent: "evolves with you" },
    text: "Your first blend reflects your profile and your situation at the time of the test. If your needs change, your blend can be adapted too. The aim is to support you as closely as possible along your path.",
  },
  order: {
    label: "Ordering",
    title: { lead: "How to", accent: "order?" },
    items: [
      {
        title: "First time",
        text: "Book your Chromatic Profile Test; after the reading, your personalised blend is created.",
        cta: "Book the Test + personalised blend package",
        target: "pack",
      },
      {
        title: "You have already taken the test",
        text: "Your bottle renewed as it was, or adjusted to how your needs have evolved.",
        cta: "Renew or adjust my blend",
        target: "renewal",
      },
      {
        title: "You would like to start simply",
        text: "Ready-to-use themed bottles, made by Laure, for a current need.",
        cta: "Discover the themed bottles",
        target: "shop",
      },
    ],
  },
  cta: {
    title: { lead: "Your bottle,", accent: "created for you." },
    button: "Request a blend",
  },
  faq: ["how-to-use", "bottle-duration", "blend-evolves", "delays", "bottle-without-test", "medical"],
};
