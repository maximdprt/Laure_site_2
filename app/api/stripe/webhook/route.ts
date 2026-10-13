import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { logError } from "@/lib/api";
import { handleBookingCompleted, handleBookingExpired } from "@/lib/booking-webhook";
import { env } from "@/lib/env";
import { handleShopCompleted } from "@/lib/shop-webhook";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook Stripe : checkout.session.completed / checkout.session.expired.
 * La signature est vérifiée ; chaque gestionnaire est idempotent
 * (Stripe peut renvoyer plusieurs fois le même événement).
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, env.stripeWebhookSecret);
  } catch (error) {
    logError("webhook:signature", error);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      if (session.payment_status === "unpaid") return NextResponse.json({ received: true });
      if (session.metadata?.kind === "booking") await handleBookingCompleted(session);
      else if (session.metadata?.kind === "shop") await handleShopCompleted(session);
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      if (session.metadata?.kind === "booking") await handleBookingExpired(session);
    }
  } catch (error) {
    // Erreur renvoyée à Stripe : l'événement sera retenté automatiquement
    logError(`webhook:${event.type}`, error);
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
