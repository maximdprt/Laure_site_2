import { getProduct, RENEWAL_SLUG, type Product } from "@/config/products";
import { shippingMethodsFor } from "@/config/shipping";

export type PricedLine = { product: Product; quantity: number; totalCents: number };

/**
 * Recalcule le panier côté serveur à partir des seuls slugs et quantités.
 * Les prix viennent toujours de config/products.ts, jamais du navigateur.
 */
export function priceCart(lines: { slug: string; quantity: number }[]): {
  lines: PricedLine[];
  subtotalCents: number;
  invalid: string[];
} {
  const merged = new Map<string, number>();
  for (const line of lines) merged.set(line.slug, Math.min(10, (merged.get(line.slug) ?? 0) + line.quantity));

  const priced: PricedLine[] = [];
  const invalid: string[] = [];
  for (const [slug, quantity] of merged) {
    const product = getProduct(slug);
    if (!product || !product.inStock) {
      invalid.push(slug);
      continue;
    }
    priced.push({ product, quantity, totalCents: product.priceCents * quantity });
  }
  return { lines: priced, subtotalCents: priced.reduce((s, l) => s + l.totalCents, 0), invalid };
}

export function cartNeedsTestReference(lines: PricedLine[]): boolean {
  return lines.some((l) => l.product.slug === RENEWAL_SLUG);
}

export { shippingMethodsFor };

/** Encodage compact du panier pour les métadonnées Stripe (500 caractères max) */
export function encodeItems(lines: PricedLine[]): string {
  return lines.map((l) => `${l.product.slug}:${l.quantity}`).join(",").slice(0, 490);
}
