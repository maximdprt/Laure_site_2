// EN: à faire relire
import type { HomeContent } from "../types";

export const home: HomeContent = {
  seo: {
    title: "Chromatic Profile Test | Emotional support in Lacanau and remotely",
    description:
      "Chromatic profile, flower essences and personalised blends made with flowers, colours, sounds and crystals. In Lacanau and remotely anywhere in France.",
  },
  hero: {
    label: "Laure Dupuch — Holistic therapist · Chromobioénergie®",
    title: "Chromatic Profile Test",
    accent: "& emotional support",
    text: "Understand your emotions through colour, and receive a blend created just for you. In Lacanau and remotely anywhere in France.",
    primary: "Book a session",
    secondary: "Discover the test",
  },
  method: {
    label: "The method",
    text: "Some colours draw us in straight away, others leave us indifferent. *These reactions say something about us.* The Chromatic Profile Test uses them to understand you better, and to support you better.",
    link: "How the test works",
  },
  how: {
    label: "How it works",
    title: { lead: "From your colours", accent: "to your bottle" },
    steps: [
      {
        title: "You take your test.",
        text: "We talk about your situation, then you choose different colours according to how you feel.",
      },
      {
        title: "We discover your profile.",
        text: "Your choices establish your chromatic profile. Together, we look at what it brings to light.",
      },
      {
        title: "I create your blend.",
        text: "Flowers, colours, sounds and crystals, selected on the basis of your profile.",
      },
    ],
  },
  universes: {
    label: "The four families",
    title: { lead: "Flowers, colours,", accent: "sounds & crystals" },
    intro: "A method that combines the properties of colours and sounds with flowers, plants and crystals.",
    items: [
      {
        key: "fleurs",
        name: "Flowers",
        caption: "Flower essences, as part of a well-being and emotional support approach.",
      },
      {
        key: "couleurs",
        name: "Colours",
        caption: "At the heart of the method: your reactions to colours establish your profile.",
      },
      { key: "sons", name: "Sounds", caption: "Essences associated with sounds and frequencies." },
      { key: "cristaux", name: "Crystals", caption: "To complete the blend, as part of a harmonising approach." },
    ],
  },
  bottle: {
    label: "Personalised blend",
    title: { lead: "Your bottle", accent: "is unique." },
    text: "No two blends are the same. Yours is created from your chromatic profile, your situation and your goal, to accompany:",
    periods:
      "stress, self-confidence, letting go, fears, times of change, relationships, the need for serenity, self-knowledge.",
    cta: "Request a blend",
  },
  places: {
    cabinet: { title: { lead: "In", accent: "Lacanau" }, caption: "At the practice — By appointment" },
    distance: { title: { lead: "", accent: "Remotely" }, caption: "By phone — Your colour cards are sent to you" },
  },
  shop: {
    label: "Shop",
    title: { lead: "Themed", accent: "bottles" },
    link: "See all 8 bottles",
    addToCart: "Add to basket",
  },
  pricing: {
    label: "Pricing",
    title: { lead: "Simple", accent: "& clear" },
    note: "A {deposit} deposit when booking, deducted from the price. No set length: we take the time you need.",
    link: "All prices",
  },
  faqLabel: "Frequently asked questions",
  final: {
    title: { lead: "Understanding you better,", accent: "supporting you better." },
    primary: "Book a session",
    secondary: "Free discovery call",
  },
};
