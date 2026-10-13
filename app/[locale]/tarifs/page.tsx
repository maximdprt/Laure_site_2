import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fill, getContent, pickFaq } from "@/content";
import { services } from "@/config/services";
import { contentVars } from "@/lib/content-vars";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { serviceSchema } from "@/lib/schema";
import { absolute, buildMetadata, localizedPath } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TitledHeading } from "@/components/sections/blocks";
import { CtaFinal } from "@/components/sections/cta-banner";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { PriceList } from "@/components/sections/price-list";
import { JsonLd } from "@/components/ui/json-ld";
import { RuleItem, RuleList } from "@/components/ui/rule-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { MonoLabel, SplitTitle } from "@/components/ui/typography";

const PATH = "/tarifs" as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/tarifs">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const { seo } = getContent(locale).pricing;
  return buildMetadata({ locale, href: PATH, title: seo.title, description: seo.description });
}

export default async function PricingPage({ params }: PageProps<"/[locale]/tarifs">) {
  const locale = await resolveLocale(params);
  const c = getContent(locale).pricing;
  const vars = contentVars(locale);
  const t = await getTranslations({ locale });

  const conditions = [
    { label: c.deposit.label, title: c.deposit.title, text: fill(c.deposit.text, vars) },
    { label: c.cancellation.label, title: c.cancellation.title, text: fill(c.cancellation.text, vars) },
    { label: c.payment.label, title: c.payment.title, text: `${c.payment.online} ${c.payment.inPerson}` },
  ];

  return (
    <>
      <Hero
        locale={locale}
        image="univers-couleurs"
        breadcrumbs={<Breadcrumbs tone="light" items={[{ label: t("nav.pricing"), href: PATH }]} />}
        label={c.hero.label}
        title={<SplitTitle as="h1" lead={c.hero.title} accent={c.hero.accent} />}
      >
        <p>{c.hero.subtitle}</p>
      </Hero>

      <Section aria-labelledby="prestations">
        <SectionHeader number="01" label={c.services.label} title={<TitledHeading title={c.services.title} id="prestations" />} />
        <div className="lg:ml-[25%]">
          <PriceList locale={locale} includeShipping />
        </div>
      </Section>

      <Section tone="paper" aria-labelledby="conditions">
        <SectionHeader
          number="02"
          label={c.deposit.label}
          title={<TitledHeading title={{ lead: c.deposit.title.lead, accent: c.deposit.title.accent }} id="conditions" />}
        />
        <div className="lg:ml-[25%]">
          <RuleList>
            {conditions.map((item) => (
              <RuleItem key={item.label} className="grid gap-3 md:grid-cols-[12rem_1fr] md:gap-8">
                <MonoLabel className="pt-1.5">{item.label}</MonoLabel>
                <div>
                  <h3 className="text-[22px] tracking-[-0.01em]">
                    {item.title.lead} <span className="serif-accent">{item.title.accent}</span>
                  </h3>
                  <p className="mt-2 text-ink-muted">{item.text}</p>
                </div>
              </RuleItem>
            ))}
          </RuleList>
        </div>
      </Section>

      <FaqSection number="03" items={pickFaq(locale, c.faq, vars)} />

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

      <JsonLd data={services.map((s) => serviceSchema(s, locale, absolute(localizedPath(PATH, locale))))} />
    </>
  );
}
