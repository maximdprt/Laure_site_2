import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getContent, pickFaq } from "@/content";
import type { ImageKey } from "@/config/images";
import { RENEWAL_SLUG } from "@/config/products";
import { getService } from "@/config/services";
import { contentVars } from "@/lib/content-vars";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { serviceSchema } from "@/lib/schema";
import { absolute, buildMetadata, localizedPath, type Href } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TextSection, TitledHeading } from "@/components/sections/blocks";
import { CtaFinal } from "@/components/sections/cta-banner";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { FullBleedImage } from "@/components/ui/full-bleed-image";
import { JsonLd } from "@/components/ui/json-ld";
import { Reveal } from "@/components/ui/reveal";
import { RuleLinkItem, RuleList } from "@/components/ui/rule-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { Inline, MonoLabel, RichText, SectionLabel, SplitTitle } from "@/components/ui/typography";

const PATH = "/preparations-personnalisees" as const;

const familyImages: Record<"fleurs" | "couleurs" | "sons" | "cristaux", ImageKey> = {
  fleurs: "univers-fleurs",
  couleurs: "univers-couleurs",
  sons: "univers-sons",
  cristaux: "univers-cristaux",
};

const orderTargets: Record<"pack" | "renewal" | "shop", Href> = {
  pack: { pathname: "/rendez-vous", query: { service: "pack" } },
  renewal: { pathname: "/boutique/[slug]", params: { slug: RENEWAL_SLUG } },
  shop: "/boutique",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/preparations-personnalisees">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const { seo } = getContent(locale).blends;
  return buildMetadata({ locale, href: PATH, title: seo.title, description: seo.description });
}

export default async function BlendsPage({ params }: PageProps<"/[locale]/preparations-personnalisees">) {
  const locale = await resolveLocale(params);
  const c = getContent(locale).blends;
  const vars = contentVars(locale);
  const t = await getTranslations({ locale });

  return (
    <>
      <Hero
        locale={locale}
        image="preparation"
        breadcrumbs={<Breadcrumbs tone="light" items={[{ label: t("nav.blends"), href: PATH }]} />}
        label={c.hero.label}
        title={<SplitTitle as="h1" lead={c.hero.title} accent={c.hero.accent} />}
      >
        <p>{c.hero.subtitle}</p>
      </Hero>

      <Section aria-label={c.hero.subtitle}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel number="01">{c.hero.label}</SectionLabel>
          </div>
          <Reveal className="lg:col-span-9">
            <p className="text-manifesto font-light leading-[1.12] tracking-[-0.025em]">
              <Inline text={c.intro} />
            </p>
          </Reveal>
        </div>
      </Section>

      <TextSection tone="paper" number="02" label={c.why.label} title={c.why.title} text={c.why.text} id="pourquoi" />

      {/* Les 4 familles : blocs alternés image / texte */}
      <section aria-labelledby="familles">
        <div className="container-site py-20 md:py-32 lg:py-[150px]">
          <SectionHeader number="03" label={c.families.label} title={<TitledHeading title={c.families.title} id="familles" />} className="mb-0 md:mb-0" />
        </div>
        {c.families.items.map((family, i) => (
          <div key={family.key} className="grid lg:grid-cols-2">
            <FullBleedImage
              imageKey={familyImages[family.key]}
              locale={locale}
              sizes="(min-width: 1024px) 50vw, 100vw"
              ratio="3/4"
              className={i % 2 === 1 ? "lg:order-2" : undefined}
            />
            <div
              className={`flex flex-col justify-center px-[var(--gutter)] py-16 md:py-24 lg:px-16 xl:px-24 ${i % 2 === 1 ? "lg:order-1" : ""}`}
            >
              <MonoLabel>{String(i + 1).padStart(2, "0")} / 04</MonoLabel>
              <Reveal>
                <h3 className="serif-accent mt-6 text-h2">{family.title}</h3>
                <RichText text={family.text} className="mt-8 max-w-lg text-[18px] text-ink-muted" />
              </Reveal>
            </div>
          </div>
        ))}
        <div className="container-site py-16">
          <p className="max-w-3xl text-[clamp(22px,2.2vw,30px)] font-light leading-[1.3] tracking-[-0.015em]">
            <span className="serif-accent">{c.families.mention}</span>
          </p>
        </div>
      </section>

      <TextSection tone="paper" number="04" label={c.evolves.label} title={c.evolves.title} text={c.evolves.text} id="evolue" />

      <Section aria-labelledby="commander">
        <SectionHeader number="05" label={c.order.label} title={<TitledHeading title={c.order.title} id="commander" />} />
        <div className="lg:ml-[25%]">
          <RuleList>
            {c.order.items.map((item) => (
              <RuleLinkItem key={item.target} href={orderTargets[item.target]} className="flex-col gap-3 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <p className="text-[22px] tracking-[-0.01em] md:text-[26px]">{item.title}</p>
                  <p className="mt-2 text-ink-muted">{item.text}</p>
                </div>
                <span className="link-underline shrink-0 text-[15px]">
                  {item.cta} <span aria-hidden>→</span>
                </span>
              </RuleLinkItem>
            ))}
          </RuleList>
        </div>
      </Section>

      <FaqSection number="06" items={pickFaq(locale, c.faq, vars)} />

      <CtaFinal
        locale={locale}
        image="preparation"
        title={
          <>
            {c.cta.title.lead} <span className="serif-accent">{c.cta.title.accent}</span>
          </>
        }
        primary={{ label: c.cta.button, href: { pathname: "/rendez-vous", query: { service: "pack" } } }}
        secondary={{ label: t("common.discoveryCta"), href: { pathname: "/rendez-vous", query: { service: "decouverte" } } }}
      />

      <JsonLd data={serviceSchema(getService("pack"), locale, absolute(localizedPath(PATH, locale)))} />
    </>
  );
}
