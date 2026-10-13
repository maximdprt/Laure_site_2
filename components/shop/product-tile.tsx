import type { Product } from "@/config/products";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/utils";
import { FullBleedImage } from "@/components/ui/full-bleed-image";
import { Price } from "@/components/ui/typography";
import { AddToCart } from "./add-to-cart";

/** Packshot 4:5, nom et prix sous l'image, lien « Ajouter au panier » */
export function ProductTile({ product, locale, sizes }: { product: Product; locale: Locale; sizes: string }) {
  const href = { pathname: "/boutique/[slug]", params: { slug: product.slug } } as const;
  return (
    <article className="flex flex-col">
      <Link href={href} className="group block" tabIndex={-1} aria-hidden data-cursor="view">
        <FullBleedImage imageKey={product.image} locale={locale} sizes={sizes} ratio="4/5" hoverZoom decorative />
      </Link>
      <div className="flex flex-1 flex-col gap-2 px-1 pt-4 md:px-0">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[18px] font-normal leading-snug tracking-[-0.01em]">
            <Link href={href} className="underline decoration-transparent decoration-1 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-current">
              {product.name[locale]}
            </Link>
          </h3>
          <Price className="text-[22px] md:text-[24px]">{formatPrice(product.priceCents, locale)}</Price>
        </div>
        <p className="text-[14px] leading-relaxed text-ink-muted">{product.tagline[locale]}</p>
        <div className="mt-auto pt-1">
          <AddToCart slug={product.slug} inStock={product.inStock} />
        </div>
      </div>
    </article>
  );
}
