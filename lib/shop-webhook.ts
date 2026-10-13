import "server-only";
import type Stripe from "stripe";
import OrderConfirmation from "@/emails/OrderConfirmation";
import OrderNotification from "@/emails/OrderNotification";
import { wellnessNotice } from "@/emails/components/wellness";
import { isPlaceholder, siteConfig } from "@/config/site";
import { env } from "./env";
import { retrieveOrder } from "./order";
import { laureEmail, sendEmail } from "./resend";
import { getStripe } from "./stripe";
import { formatPrice } from "./utils";

/** Sessions déjà traitées par cette instance (complément du marqueur stocké chez Stripe) */
const processed = new Set<string>();

/**
 * checkout.session.completed pour une commande boutique (metadata.kind = "shop") :
 * e-mail de confirmation au client + e-mail détaillé à Laure. Idempotent.
 */
export async function handleShopCompleted(event: Stripe.Checkout.Session): Promise<void> {
  if (processed.has(event.id) || event.metadata?.processed === "1") return;

  const result = await retrieveOrder(event.id);
  if (!result) return;
  const { session, order } = result;
  if (session.metadata?.processed === "1" || !order.paid) return;

  const locale = order.locale;
  const price = (cents: number) => formatPrice(cents, locale);
  const items = order.items.map((item) => ({ ...item, amount: price(item.amountCents) }));
  const contactEmail = isPlaceholder(siteConfig.contact.email) ? (env.emailLaure ?? "") : siteConfig.contact.email;

  const clientSent = order.email
    ? await sendEmail({
        to: order.email,
        subject: locale === "fr" ? `Votre commande NLIGHT ${order.reference}` : `Your NLIGHT order ${order.reference}`,
        replyTo: env.emailLaure,
        idempotencyKey: `order-client-${session.id}`,
        react: OrderConfirmation({
          locale,
          siteUrl: env.siteUrl,
          reference: order.reference,
          name: order.name,
          items,
          subtotal: price(order.subtotalCents),
          shipping: price(order.shippingCents),
          total: price(order.totalCents),
          shippingMethod: order.shippingMethod,
          shippingAddress: order.shippingAddress,
          testReference: order.testReference,
          wellnessNotice: wellnessNotice[locale],
          contactEmail,
        }),
      })
    : true;

  const laure = laureEmail();
  const laureSent = laure
    ? await sendEmail({
        to: laure,
        subject: `Nouvelle commande ${order.reference} – ${formatPrice(order.totalCents, "fr")}`,
        replyTo: order.email ?? undefined,
        idempotencyKey: `order-laure-${session.id}`,
        react: OrderNotification({
          siteUrl: env.siteUrl,
          reference: order.reference,
          date: order.createdAt.toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
          name: order.name,
          email: order.email,
          phone: order.phone,
          items: order.items.map((item) => ({ ...item, amount: formatPrice(item.amountCents, "fr") })),
          subtotal: formatPrice(order.subtotalCents, "fr"),
          shipping: formatPrice(order.shippingCents, "fr"),
          total: formatPrice(order.totalCents, "fr"),
          shippingMethod: order.shippingMethod,
          shippingAddress: order.shippingAddress,
          testReference: order.testReference,
          locale,
          stripeUrl: `https://dashboard.stripe.com/${session.livemode ? "" : "test/"}checkout/sessions/${session.id}`,
        }),
      })
    : true;

  // En cas d'échec d'envoi, on lève une erreur : Stripe renverra l'événement plus tard
  if (!clientSent || !laureSent) throw new Error(`E-mails de commande non envoyés pour ${session.id}`);

  processed.add(session.id);
  try {
    await getStripe()?.checkout.sessions.update(session.id, {
      metadata: { ...session.metadata, processed: "1" },
    });
  } catch {
    // Marqueur non critique : les clés d'idempotence Resend évitent déjà les doublons
  }
}
