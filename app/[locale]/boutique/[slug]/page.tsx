import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProduct, products, readyProducts } from "@/config/products";
import { FREE_SHIPPING_THRESHOLD_CENTS, preparationDelay } from "@/config/shipping";
import { routing } from "@/i18n/routing";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { productSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { WellnessNotice } from "@/components/layout/wellness-notice";
import { AddToCart } from "@/components/shop/add-to-cart";
import { ProductTile } from "@/components/shop/product-tile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { FullBleedImage } from "@/components/ui/full-bleed-image";
import { JsonLd } from "@/components/ui/json-ld";
import { Reveal } from "@/components/ui/reveal";
import { RuleItem, RuleList } from "@/components/ui/rule-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { MonoLabel, Price, RichText, SplitTitle } from "@/components/ui/typography";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/boutique/[slug]">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return buildMetadata({
    locale,
    href: { pathname: "/boutique/[slug]", params: { slug } },
    title: `${product.name[locale]} | NLIGHT`,
    description: product.tagline[locale],
  });
}

export default async function ProductPage({ params }: PageProps<"/[locale]/boutique/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const t = await getTranslations({ locale });
  const threshold = formatPrice(FREE_SHIPPING_THRESHOLD_CENTS, locale);

  const related = readyProducts
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.theme === product.theme) - Number(a.theme === product.theme))
    .slice(0, 4);

  return (
    <>
      <section className="grid pt-[var(--header-h)] lg:grid-cols-2">
        {/* Galerie : une image par produit pour l'instant (ajouter d'autres visuels dans config/products.ts) */}
        <FullBleedImage
          imageKey={product.image}
          locale={locale}
          sizes="(min-width: 1024px) 50vw, 100vw"
          ratio="4/5"
          priority
        />
        <div className="px-[var(--gutter)] pb-20 pt-10 lg:px-16 lg:pt-12 xl:px-24">
          <Breadcrumbs
            items={[
              { label: t("nav.shop"), href: "/boutique" },
              { label: product.name[locale], href: { pathname: "/boutique/[slug]", params: { slug } } },
            ]}
          />
          <div className="mt-12">
            <SplitTitle as="h1" size="h2" lead={product.name[locale]} />
            <div className="mt-6 flex items-baseline gap-6">
              <Price className="text-[36px] md:text-[40px]">{formatPrice(product.priceCents, locale)}</Price>
              <MonoLabel>
                {t("shop.volume")} · {product.volume[locale]}
              </MonoLabel>
            </div>
            <p className="serif-accent mt-8 text-[24px] leading-snug">{product.tagline[locale]}</p>

            {product.type === "custom" && (
              <p className="mt-6 border-l-2 border-ink pl-4 text-[15px]">{t("shop.renewalNotice")}</p>
            )}

            <AddToCart slug={product.slug} inStock={product.inStock} variant="full" className="mt-10" />

            <RuleList className="mt-10 text-[15px]">
              <RuleItem className="py-4 md:py-4">{t("shop.reassurance.shipping", { threshold })}</RuleItem>
              <RuleItem className="py-4 md:py-4">{t("shop.reassurance.pickup")}</RuleItem>
              <RuleItem className="py-4 md:py-4">{t("shop.reassurance.secure")}</RuleItem>
            </RuleList>

            <Accordion type="multiple" defaultValue={["description"]} className="mt-12">
              <AccordionItem value="description">
                <AccordionTrigger headingLevel={2}>{t("shop.description")}</AccordionTrigger>
                <AccordionContent>
                  <RichText text={product.description[locale]} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="composition">
                <AccordionTrigger headingLevel={2}>{t("shop.composition")}</AccordionTrigger>
                <AccordionContent>
                  <RichText text={product.composition[locale]} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="usage">
                <AccordionTrigger headingLevel={2}>{t("shop.usage")}</AccordionTrigger>
                <AccordionContent>
                  <RichText text={product.usage[locale]} />
                  <p className="mt-4">{preparationDelay[locale]}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <WellnessNotice withTitle className="mt-12" />

            {product.type === "custom" && (
              <ButtonLink href={{ pathname: "/rendez-vous", query: { service: "pack" } }} variant="outline" className="mt-8">
                {t("shop.packCardCta")}
              </ButtonLink>
            )}
          </div>
        </div>
      </section>

      <Section aria-labelledby="associes">
        <SectionHeader label={t("shop.related")} title={<SplitTitle id="associes" lead={t("shop.relatedLead")} accent={t("shop.relatedAccent")} />} />
        <ul className="grid grid-cols-2 gap-x-1 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {related.map((p, i) => (
            <Reveal as="li" key={p.slug} index={i}>
              <ProductTile product={p} locale={locale} sizes="(min-width: 1024px) 25vw, 50vw" />
            </Reveal>
          ))}
        </ul>
      </Section>

      <JsonLd data={productSchema(product, locale)} />
    </>
  );
}
