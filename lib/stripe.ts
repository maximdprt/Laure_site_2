import "server-only";
import Stripe from "stripe";
import { env } from "./env";

let client: Stripe | null = null;

/** Client Stripe, ou null si STRIPE_SECRET_KEY n'est pas configurée */
export function getStripe(): Stripe | null {
  if (!env.stripeSecretKey) return null;
  client ??= new Stripe(env.stripeSecretKey, {
    appInfo: { name: "NLIGHT – Laure Dupuch", url: env.siteUrl },
    maxNetworkRetries: 2,
  });
  return client;
}

/** Types de session Checkout, stockés dans metadata.kind */
export type CheckoutKind = "booking" | "shop";
