import { getTranslations } from "next-intl/server";
import { getProduct, readyProducts, RENEWAL_SLUG } from "@/config/products";
import { services, VAT_NOTICE } from "@/config/services";
import { COLISSIMO, FREE_SHIPPING_THRESHOLD_CENTS, PICKUP } from "@/config/shipping";
import type { Locale } from "@/i18n/routing";
import type { Href } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { RuleLinkItem, RuleList } from "@/components/ui/rule-list";
import { MonoLabel, Price } from "@/components/ui/typography";

type Row = { name: string; detail: string; price: string; href: Href; badge?: string };

/** Lignes de tarifs, entièrement lues dans config/ (modifier un prix = modifier un seul fichier) */
export async function priceRows(locale: Locale, opts: { includeShipping?: boolean } = {}): Promise<Row[]> {
  const t = await getTranslations({ locale });
  const free = t("common.free");
  const rows: Row[] = services.map((s) => ({
    name: s.name[locale],
    detail: s.formatSummary[locale],
    price: s.priceCents === 0 ? free : formatPrice(s.priceCents, locale),
    href: { pathname: "/rendez-vous", query: { service: s.id } },
    badge: s.featured ? t("pricingList.mostChosen") : undefined,
  }));

  const renewal = getProduct(RENEWAL_SLUG);
  if (renewal) {
    rows.push({
      name: renewal.name[locale],
      detail: t("pricingList.renewalDetail"),
      price: formatPrice(renewal.priceCents, locale),
      href: { pathname: "/boutique/[slug]", params: { slug: renewal.slug } },
    });
  }
  const ready = readyProducts[0];
  if (ready) {
    rows.push({
      name: t("pricingList.readyName"),
      detail: t("pricingList.readyDetail", { volume: ready.volume[locale] }),
      price: formatPrice(ready.priceCents, locale),
      href: "/boutique",
    });
  }
  if (opts.includeShipping) {
    rows.push(
      {
        name: COLISSIMO.label[locale],
        detail: t("pricingList.freeFrom", { threshold: formatPrice(FREE_SHIPPING_THRESHOLD_CENTS, locale) }),
        price: formatPrice(COLISSIMO.amountCents, locale),
        href: "/boutique",
      },
      { name: PICKUP.label[locale], detail: t("pricingList.pickupDetail"), price: free, href: "/boutique" },
    );
  }
  return rows;
}

/** Liste à filets : prestation à gauche, prix en Instrument Serif à droite, ligne entière cliquable */
export async function PriceList({ locale, includeShipping }: { locale: Locale; includeShipping?: boolean }) {
  const rows = await priceRows(locale, { includeShipping });
  return (
    <div>
      <RuleList>
        {rows.map((row) => (
          <RuleLinkItem key={row.name} href={row.href} className="items-baseline">
            <div className="min-w-0">
              <p className="text-[20px] leading-snug tracking-[-0.01em] md:text-[24px]">
                {row.name}
                {row.badge && <MonoLabel className="ml-3 align-middle text-ink">{row.badge}</MonoLabel>}
              </p>
              <p className="mt-1.5 text-[15px] text-ink-muted">{row.detail}</p>
            </div>
            <span className="flex shrink-0 items-baseline gap-4">
              <Price>{row.price}</Price>
              <span aria-hidden className="hidden transition-transform duration-500 ease-soft group-hover:translate-x-1 md:inline">
                →
              </span>
            </span>
          </RuleLinkItem>
        ))}
      </RuleList>
      <p className="mt-4 text-[13px] text-ink-muted">{VAT_NOTICE[locale]}</p>
    </div>
  );
}
