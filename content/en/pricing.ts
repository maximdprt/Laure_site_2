// EN: à faire relire
import type { PricingContent } from "../types";

export const pricing: PricingContent = {
  seo: {
    title: "Pricing: Chromatic Profile Test, support and blends | NLIGHT",
    description:
      "Transparent prices: free discovery call, Chromatic Profile Test, test + personalised blend package, follow-up sessions and themed bottles.",
  },
  hero: {
    label: "Pricing",
    title: "Pricing,",
    accent: "simple & clear",
    subtitle: "Transparent prices, at the Lacanau practice and remotely.",
  },
  services: {
    label: "Services",
    title: { lead: "The", accent: "services" },
    mostChosen: "Most popular",
    book: "Book",
  },
  products: {
    label: "Bottles",
    title: { lead: "The", accent: "bottles" },
    readyName: "Ready-to-use themed bottle",
    readyFormat: "Shop · 8 themes",
    renewalFormat: "Bottle only, no session · after a first test",
    shopLink: "Visit the shop",
  },
  shipping: {
    label: "Delivery",
    title: { lead: "Delivery", accent: "& collection" },
    homeLabel: "Tracked Colissimo (France)",
    freeFrom: "free from {threshold}",
    pickupLabel: "Collection from the Lacanau practice",
    free: "Free",
  },
  deposit: {
    label: "Deposit",
    title: { lead: "The deposit", accent: "when booking" },
    text: "Paid sessions are booked with a {deposit} deposit paid online and deducted from the price; the balance is paid at the session.",
  },
  cancellation: {
    label: "Cancellation",
    title: { lead: "Cancel", accent: "or reschedule" },
    text: "Cancellation is free up to {hours} hours before the appointment: the deposit is then refunded. After that, the deposit is kept. [TO BE CONFIRMED]",
  },
  payment: {
    label: "Payment",
    title: { lead: "Payment", accent: "methods" },
    online: "Online: card, Apple Pay, Google Pay.",
    inPerson: "At the session: [TO COMPLETE: payment methods accepted at the practice].",
  },
  faq: ["which-service", "deposit", "cancel", "payment-methods", "duration"],
  final: {
    title: { lead: "Ready to discover", accent: "your profile?" },
    primary: "Book a session",
    secondary: "Free discovery call",
  },
};
