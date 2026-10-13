import "server-only";
import type Stripe from "stripe";
import type { Locale } from "@/i18n/routing";
import { getStripe } from "./stripe";

export type OrderSummary = {
  id: string;
  reference: string;
  locale: Locale;
  paid: boolean;
  email: string | null;
  name: string | null;
  phone: string | null;
  items: { name: string; quantity: number; amountCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingMethod: string | null;
  shippingAddress: string | null;
  testReference: string | null;
  createdAt: Date;
};

function formatAddress(address: Stripe.Address | null | undefined, name?: string | null): string | null {
  if (!address) return null;
  return [name, address.line1, address.line2, `${address.postal_code ?? ""} ${address.city ?? ""}`.trim(), address.country]
    .filter(Boolean)
    .join(", ");
}

/** Récupère une session Checkout boutique avec ses articles et son mode de livraison */
export async function retrieveOrder(sessionId: string): Promise<{ session: Stripe.Checkout.Session; order: OrderSummary } | null> {
  const stripe = getStripe();
  if (!stripe || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "shipping_cost.shipping_rate"],
  });
  if (session.metadata?.kind !== "shop") return null;

  const shippingRate = session.shipping_cost?.shipping_rate;
  const shippingDetails = session.collected_information?.shipping_details;
  const testField = session.custom_fields.find((f) => f.key === "reference_test");

  const order: OrderSummary = {
    id: session.id,
    reference: session.id.slice(-8).toUpperCase(),
    locale: session.metadata?.locale === "en" ? "en" : "fr",
    paid: session.payment_status === "paid" || session.payment_status === "no_payment_required",
    email: session.customer_details?.email ?? null,
    name: session.customer_details?.name ?? null,
    phone: session.customer_details?.phone ?? null,
    items: (session.line_items?.data ?? []).map((item) => ({
      name: item.description ?? "",
      quantity: item.quantity ?? 1,
      amountCents: item.amount_total,
    })),
    subtotalCents: session.amount_subtotal ?? 0,
    shippingCents: session.shipping_cost?.amount_total ?? 0,
    totalCents: session.amount_total ?? 0,
    shippingMethod: shippingRate && typeof shippingRate !== "string" ? shippingRate.display_name ?? null : null,
    shippingAddress: formatAddress(shippingDetails?.address, shippingDetails?.name),
    testReference: testField?.text?.value ?? null,
    createdAt: new Date(session.created * 1000),
  };
  return { session, order };
}
