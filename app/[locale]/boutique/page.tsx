import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getContent } from "@/content";
import { getProduct, productThemes, readyProducts, RENEWAL_SLUG, type ProductTheme } from "@/config/products";
import { getService } from "@/config/services";
import { Link } from "@/i18n/navigation";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { productSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TitledHeading } from "@/components/sections/blocks";
import { CtaFinal } from "@/components/sections/cta-banner";
import { PageIntro } from "@/components/sections/page-intro";
import { ProductFilter } from "@/components/shop/product-filter";
import { ProductTile } from "@/components/shop/product-tile";
import { LinkUnderline } from "@/components/ui/button";
import { FullBleedImage } from "@/components/ui/full-bleed-image";
import { JsonLd } from "@/components/ui/json-ld";
import { Section } from "@/components/ui/section";
import { MonoLabel, Price, SplitTitle } from "@/components/ui/typography";

const PATH = "/boutique" as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/boutique">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const { seo } = getContent(locale).shop;
  return buildMetadata({ locale, href: PATH, title: seo.title, description: seo.description });
}

export default async function ShopPage({ params }: PageProps<"/[locale]/boutique">) {
  const locale = await resolveLocale(params);
  const c = getContent(locale).shop;
  const t = await getTranslations({ locale });
  const renewal = getProduct(RENEWAL_SLUG);
  const pack = getService("pack");

  const usedThemes = [...new Set(readyProducts.map((p) => p.theme))] as ProductTheme[];

  return (
    <>
      <PageIntro
        breadcrumbs={<Breadcrumbs items={[{ label: t("nav.shop"), href: PATH }]} />}
        label={c.label}
        title={<SplitTitle as="h1" lead={c.title.lead} accent={c.title.accent} />}
      >
        {c.intro}
      </PageIntro>

      <Section tight className="pt-0 md:pt-0" aria-label={t("nav.shop")}>
        <ProductFilter
          themes={usedThemes.map((theme) => ({ value: theme, label: productThemes[theme][locale] }))}
          items={readyProducts.map((product) => ({
            key: product.slug,
            theme: product.theme,
            node: <ProductTile product={product} locale={locale} sizes="(min-width: 1024px) 25vw, 50vw" />,
          }))}
        />
      </Section>

      {/* Bandeau image 07 : le pack se réserve dans l'agenda */}
      <Link href={{ pathname: "/rendez-vous", query: { service: "pack" } }} className="group block">
        <FullBleedImage imageKey="preparation" locale={locale} sizes="100vw" fill veil decorative hoverZoom className="min-h-[75svh]">
          <div className="container-site flex h-full flex-col justify-end pb-12 md:pb-16">
            <p className="label-mono text-white/85">{c.pack.label}</p>
            <h2 className="mt-4 max-w-4xl text-h2 font-light">
              {c.pack.title.lead} <span className="serif-accent">{c.pack.title.accent}</span>
            </h2>
            <p className="mt-5 max-w-xl text-white/90">{c.pack.text}</p>
            <p className="mt-6 flex flex-wrap items-baseline gap-6">
              <Price className="text-white">{formatPrice(pack.priceCents, locale)}</Price>
              <span className="link-underline text-[15px]">
                {c.pack.cta} <span aria-hidden>→</span>
              </span>
            </p>
          </div>
        </FullBleedImage>
      </Link>

      {renewal && (
        <Section aria-labelledby="renouveler">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <MonoLabel>{c.renewal.label}</MonoLabel>
            </div>
            <div className="lg:col-span-9">
              <TitledHeading title={c.renewal.title} id="renouveler" />
              <p className="mt-6 max-w-2xl text-ink-muted">{c.renewal.text}</p>
              <div className="mt-10 flex flex-wrap items-baseline justify-between gap-6 border-y border-ink py-6">
                <p className="text-[22px] tracking-[-0.01em]">{renewal.name[locale]}</p>
                <div className="flex items-baseline gap-8">
                  <Price>{formatPrice(renewal.priceCents, locale)}</Price>
                  <LinkUnderline href={{ pathname: "/boutique/[slug]", params: { slug: renewal.slug } }}>
                    {t("shop.viewProduct")}
                  </LinkUnderline>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      <CtaFinal
        locale={locale}
        title={
          <>
            {c.final.title.lead} <span className="serif-accent">{c.final.title.accent}</span>
          </>
        }
        primary={{ label: c.final.primary, href: "/rendez-vous" }}
        secondary={{ label: c.final.secondary, href: "/test-profil-chromatique" }}
      />

      <JsonLd data={readyProducts.map((p) => productSchema(p, locale))} />
    </>
  );
}
