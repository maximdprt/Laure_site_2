import type { Metadata } from "next";
import { getContent, pickFaq, fill } from "@/content";
import type { ImageKey } from "@/config/images";
import { readyProducts } from "@/config/products";
import { Link } from "@/i18n/navigation";
import { contentVars } from "@/lib/content-vars";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { organizationSchema, personSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { CtaFinal } from "@/components/sections/cta-banner";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { PriceList } from "@/components/sections/price-list";
import { ProductTile } from "@/components/shop/product-tile";
import { ButtonLink, LinkUnderline } from "@/components/ui/button";
import { FullBleedImage } from "@/components/ui/full-bleed-image";
import { JsonLd } from "@/components/ui/json-ld";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { RuleItem, RuleList } from "@/components/ui/rule-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { Inline, MonoLabel, SectionLabel, SplitTitle } from "@/components/ui/typography";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const { seo } = getContent(locale).home;
  return buildMetadata({ locale, href: "/", title: seo.title, description: seo.description });
}

const universeImages: Record<"fleurs" | "couleurs" | "sons" | "cristaux", ImageKey> = {
  fleurs: "univers-fleurs",
  couleurs: "univers-couleurs",
  sons: "univers-sons",
  cristaux: "univers-cristaux",
};

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const c = getContent(locale).home;
  const vars = contentVars(locale);
  const featured = readyProducts.filter((p) =>
    ["serenite-detente", "confiance-en-soi", "lacher-prise", "sommeil"].includes(p.slug),
  );

  return (
    <>
      {/* 1. Hero plein écran */}
      <Hero
        size="full"
        locale={locale}
        image="hero"
        mobileImage="hero-mobile"
        label={c.hero.label}
        title={
          <h1 className="text-h1 font-light">
            <RevealLines lines={[c.hero.title, <span key="a" className="serif-accent">{c.hero.accent}</span>]} />
          </h1>
        }
        aside={
          <div className="flex flex-col gap-7">
            <p className="max-w-sm text-[17px] leading-relaxed text-white/90">{c.hero.text}</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="/rendez-vous" variant="light">
                {c.hero.primary}
              </ButtonLink>
              <LinkUnderline href="/test-profil-chromatique" className="text-white">
                {c.hero.secondary}
              </LinkUnderline>
            </div>
          </div>
        }
      />

      {/* 2. (01) La méthode */}
      <Section aria-labelledby="methode">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel number="01">
              <span id="methode">{c.method.label}</span>
            </SectionLabel>
          </div>
          <Reveal className="lg:col-span-9">
            <p className="text-manifesto font-light leading-[1.12] tracking-[-0.025em]">
              <Inline text={c.method.text} />
            </p>
            <LinkUnderline href="/test-profil-chromatique" className="mt-10">
              {c.method.link}
            </LinkUnderline>
          </Reveal>
        </div>
      </Section>

      {/* 3. (02) Comment ça fonctionne */}
      <section aria-labelledby="comment" className="grid lg:grid-cols-2">
        <FullBleedImage imageKey="test-couleurs" locale={locale} sizes="(min-width: 1024px) 50vw, 100vw" ratio="4/5" />
        <div className="flex flex-col justify-center px-[var(--gutter)] py-20 md:py-28 lg:px-16 xl:px-24">
          <SectionLabel number="02" className="mb-8">
            {c.how.label}
          </SectionLabel>
          <Reveal>
            <SplitTitle id="comment" lead={c.how.title.lead} accent={c.how.title.accent} breakBefore />
          </Reveal>
          <RuleList className="mt-12">
            {c.how.steps.map((step, i) => (
              <RuleItem key={step.title} className="grid grid-cols-[3rem_1fr] gap-4">
                <MonoLabel className="pt-1.5">{String(i + 1).padStart(2, "0")}</MonoLabel>
                <div>
                  <h3 className="text-[20px] font-normal tracking-[-0.01em]">{step.title}</h3>
                  <p className="mt-2 text-ink-muted">{step.text}</p>
                </div>
              </RuleItem>
            ))}
          </RuleList>
        </div>
      </section>

      {/* 4. (03) Fleurs, couleurs, sons & cristaux */}
      <Section bleed aria-labelledby="univers">
        <div className="container-site">
          <SectionHeader
            number="03"
            label={c.universes.label}
            title={<SplitTitle id="univers" lead={c.universes.title.lead} accent={c.universes.title.accent} />}
            intro={c.universes.intro}
          />
        </div>
        <ul className="grid grid-cols-2 gap-1 lg:grid-cols-4">
          {c.universes.items.map((item, i) => (
            <li key={item.key}>
              <FullBleedImage
                imageKey={universeImages[item.key]}
                locale={locale}
                sizes="(min-width: 1024px) 25vw, 50vw"
                ratio="3/4"
              />
              <Reveal index={i} className="px-[var(--gutter)] pb-2 pt-5 lg:px-6">
                <h3 className="text-[22px] font-light tracking-[-0.02em]">
                  <span className="serif-accent text-[26px]">{item.name}</span>
                </h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-muted">{item.caption}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. (04) Votre flacon est unique */}
      <section aria-labelledby="flacon" className="grid lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-[var(--gutter)] py-20 md:py-28 lg:order-1 lg:px-16 xl:px-24">
          <SectionLabel number="04" className="mb-8">
            {c.bottle.label}
          </SectionLabel>
          <Reveal>
            <SplitTitle id="flacon" size="h1" lead={c.bottle.title.lead} accent={c.bottle.title.accent} breakBefore />
          </Reveal>
          <p className="mt-10 max-w-lg text-ink-muted">{c.bottle.text}</p>
          <p className="serif-accent mt-6 max-w-xl text-[26px] leading-[1.25]">{c.bottle.periods}</p>
          <div className="mt-10">
            <ButtonLink href={{ pathname: "/rendez-vous", query: { service: "pack" } }}>{c.bottle.cta}</ButtonLink>
          </div>
        </div>
        <FullBleedImage
          imageKey="preparation"
          locale={locale}
          sizes="(min-width: 1024px) 50vw, 100vw"
          ratio="3/4"
          className="order-1 lg:order-2"
        />
      </section>

      {/* 6. À Lacanau / À distance */}
      <section aria-label={`${c.places.cabinet.title.accent} / ${c.places.distance.title.accent}`} className="mt-1 grid gap-1 md:grid-cols-2">
        {(
          [
            ["lacanau", c.places.cabinet],
            ["distance", c.places.distance],
          ] as const
        ).map(([image, place]) => (
          <Link key={image} href="/rendez-vous" className="group block">
            <FullBleedImage imageKey={image} locale={locale} sizes="(min-width: 768px) 50vw, 100vw" ratio="4/5" veil decorative hoverZoom>
              <div className="flex h-full flex-col justify-end p-[var(--gutter)] md:p-10">
                <h2 className="text-h2 font-light">
                  {place.title.lead && <>{place.title.lead} </>}
                  <span className="serif-accent">{place.title.accent}</span>
                </h2>
                <p className="label-mono mt-4 text-white/90">{place.caption}</p>
              </div>
            </FullBleedImage>
          </Link>
        ))}
      </section>

      {/* 7. (05) Les flacons thématiques */}
      <Section aria-labelledby="boutique">
        <SectionHeader
          number="05"
          label={c.shop.label}
          title={<SplitTitle id="boutique" lead={c.shop.title.lead} accent={c.shop.title.accent} />}
        />
        <ul className="grid grid-cols-2 gap-x-1 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal as="li" key={product.slug} index={i}>
              <ProductTile product={product} locale={locale} sizes="(min-width: 1024px) 25vw, 50vw" />
            </Reveal>
          ))}
        </ul>
        <LinkUnderline href="/boutique" className="mt-12">
          {c.shop.link}
        </LinkUnderline>
      </Section>

      {/* 8. (06) Tarifs */}
      <Section aria-labelledby="tarifs" className="pt-0 md:pt-0 lg:pt-0">
        <SectionHeader
          number="06"
          label={c.pricing.label}
          title={<SplitTitle id="tarifs" lead={c.pricing.title.lead} accent={c.pricing.title.accent} />}
        />
        <div className="lg:ml-[25%]">
          <PriceList locale={locale} />
          <p className="mt-8 max-w-xl text-ink-muted">{fill(c.pricing.note, vars)}</p>
          <LinkUnderline href="/tarifs" className="mt-6">
            {c.pricing.link}
          </LinkUnderline>
        </div>
      </Section>

      {/* 9. (07) Questions fréquentes */}
      <FaqSection
        number="07"
        items={pickFaq(locale, ["what-is-test", "need-problem", "remote", "duration", "bottle-without-test"], vars)}
      />

      {/* 10. Section finale plein écran */}
      <CtaFinal
        locale={locale}
        title={
          <>
            {c.final.title.lead} <span className="serif-accent">{c.final.title.accent}</span>
          </>
        }
        primary={{ label: c.final.primary, href: "/rendez-vous" }}
        secondary={{ label: c.final.secondary, href: { pathname: "/rendez-vous", query: { service: "decouverte" } } }}
      />

      <JsonLd data={[organizationSchema(locale), personSchema(locale)]} />
    </>
  );
}
