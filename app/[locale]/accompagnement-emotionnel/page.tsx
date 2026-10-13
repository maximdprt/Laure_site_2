import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getContent, pickFaq } from "@/content";
import { getService } from "@/config/services";
import { contentVars } from "@/lib/content-vars";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { serviceSchema } from "@/lib/schema";
import { absolute, buildMetadata, localizedPath } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Highlight, SplitSection, TextSection, TitledHeading, TwoColumnRuleList } from "@/components/sections/blocks";
import { CtaFinal } from "@/components/sections/cta-banner";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { ServicePrices } from "@/components/sections/service-prices";
import { ButtonLink, LinkUnderline } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { Inline, RichText, SectionLabel, SplitTitle } from "@/components/ui/typography";

const PATH = "/accompagnement-emotionnel" as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/accompagnement-emotionnel">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const { seo } = getContent(locale).support;
  return buildMetadata({ locale, href: PATH, title: seo.title, description: seo.description });
}

export default async function SupportPage({ params }: PageProps<"/[locale]/accompagnement-emotionnel">) {
  const locale = await resolveLocale(params);
  const c = getContent(locale).support;
  const vars = contentVars(locale);
  const t = await getTranslations({ locale });

  return (
    <>
      <Hero
        locale={locale}
        image="univers-sons"
        breadcrumbs={<Breadcrumbs tone="light" items={[{ label: t("nav.support"), href: PATH }]} />}
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

      <Section tone="paper" aria-labelledby="situations">
        <SectionHeader number="02" label={c.situations.label} title={<TitledHeading title={c.situations.title} id="situations" />} />
        <div className="lg:ml-[25%]">
          <TwoColumnRuleList items={c.situations.items} />
          <Highlight text={c.situations.note} className="mt-12 max-w-3xl" />
          <LinkUnderline href="/test-profil-chromatique" className="mt-8">
            {t("nav.test")}
          </LinkUnderline>
        </div>
      </Section>

      <SplitSection locale={locale} image="univers-fleurs" number="03" label={c.approach.label} title={c.approach.title} id="approche">
        <RichText text={c.approach.text} className="text-[18px] text-ink-muted" />
      </SplitSection>

      <TextSection number="04" label={c.path.label} title={c.path.title} text={c.path.text} id="parcours" />

      <Section tone="paper" aria-labelledby="suivi">
        <SectionHeader number="05" label={c.session.label} title={<TitledHeading title={c.session.title} id="suivi" />} />
        <div className="lg:ml-[25%]">
          <p className="prose-site mb-10 text-[18px] text-ink-muted">{c.session.text}</p>
          <ServicePrices locale={locale} ids={["suivi", "test", "decouverte"]} />
          <ButtonLink href={{ pathname: "/rendez-vous", query: { service: "suivi" } }} className="mt-10">
            {c.session.cta}
          </ButtonLink>
        </div>
      </Section>

      <FaqSection number="06" items={pickFaq(locale, c.faq, vars)} />

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

      <JsonLd data={serviceSchema(getService("suivi"), locale, absolute(localizedPath(PATH, locale)))} />
    </>
  );
}
