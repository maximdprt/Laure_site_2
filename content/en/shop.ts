// EN: à faire relire
import type { ShopContent } from "../types";

export const shop: ShopContent = {
  seo: {
    title: "Shop: themed essence bottles and personalised blends | NLIGHT",
    description:
      "Ready-to-use themed bottles made by Laure Dupuch, and the renewal of your personalised blend. Delivery in France or collection in Lacanau.",
  },
  label: "Shop",
  title: { lead: "Themed", accent: "bottles" },
  intro:
    "Ready-to-use themed bottles, made by Laure, to accompany a current need. For a blend fully tailored to your profile, start with the Chromatic Profile Test.",
  pack: {
    label: "First blend",
    title: { lead: "Test package", accent: "+ personalised blend" },
    text: "Your first blend begins with the Chromatic Profile Test. The package is booked directly in the calendar.",
    cta: "Book the package",
  },
  renewal: {
    label: "Already tested?",
    title: { lead: "Renew", accent: "your blend" },
    text: "Only for people who have already taken their Chromatic Profile Test. First blend? Choose the Test + personalised blend package.",
  },
  final: {
    title: { lead: "A blend", accent: "just for you?" },
    primary: "Book a session",
    secondary: "Discover the test",
  },
};
