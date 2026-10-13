import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { images } from "@/config/images";
import { SHIPPING_COUNTRIES } from "@/config/shipping";
import { jsonError, logError, readJson, zodFields } from "@/lib/api";
import { imageExists } from "@/lib/images";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { absolute, localizedPath } from "@/lib/seo";
import { cartNeedsTestReference, encodeItems, priceCart, shippingMethodsFor } from "@/lib/shop";
import { getStripe } from "@/lib/stripe";
import { shopCheckoutSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Panier → session Stripe Checkout. Le client n'envoie que des slugs et des quantités. */
export async function POST(request: Request) {
  if (!rateLimit(`shop:${clientIp(request)}`, 15, 10 * 60_000)) return jsonError("rateLimit", 429);

  const parsed = shopCheckoutSchema.safeParse(await readJson(request));
  if (!parsed.success) return jsonError("invalid", 400, zodFields(parsed.error));
  const { locale } = parsed.data;

  const cart = priceCart(parsed.data.lines);
  if (cart.lines.length === 0) return jsonError("empty", 400);

  const stripe = getStripe();
  if (!stripe) return jsonError("unavailable", 503);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.lines.map(({ product, quantity }) => {
    const image = images[product.image];
    return {
      quantity,
      price_data: {
        currency: "eur",
        unit_amount: product.priceCents,
        product_data: {
          name: product.name[locale],
          description: product.tagline[locale],
          ...(imageExists(product.image) && absolute("/").startsWith("https")
            ? { images: [absolute(image.src)] }
            : {}),
          metadata: { slug: product.slug },
        },
      },
    };
  });

  const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = shippingMethodsFor(
    cart.subtotalCents,
  ).map((method) => ({
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: method.label[locale],
      fixed_amount: { amount: method.amountCents, currency: "eur" },
      metadata: { method: method.id },
      ...(method.delivery
        ? {
            delivery_estimate: {
              minimum: { unit: "business_day", value: method.delivery.min },
              maximum: { unit: "business_day", value: method.delivery.max },
            },
          }
        : {}),
    },
  }));

  const termsUrl = absolute(localizedPath("/cgv", locale));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale,
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: [...SHIPPING_COUNTRIES] },
      shipping_options: shippingOptions,
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      ...(cartNeedsTestReference(cart.lines)
        ? {
            custom_fields: [
              {
                key: "reference_test",
                type: "text",
                optional: false,
                label: {
                  type: "custom",
                  custom: locale === "fr" ? "Nom utilisé lors du test + date approx." : "Name used for the test + approx. date",
                },
              },
            ],
          }
        : {}),
      custom_text: {
        submit: {
          message:
            locale === "fr"
              ? `En validant, vous acceptez nos conditions générales de vente : ${termsUrl}`
              : `By confirming, you accept our terms of sale: ${termsUrl}`,
        },
      },
      metadata: { kind: "shop", locale, items: encodeItems(cart.lines) },
      success_url: `${absolute(localizedPath("/commande/confirmation", locale))}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: absolute(localizedPath("/boutique", locale)),
    });
    if (!session.url) throw new Error("Session Stripe sans URL");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    logError("shop:checkout", error);
    return jsonError("generic", 502);
  }
}
