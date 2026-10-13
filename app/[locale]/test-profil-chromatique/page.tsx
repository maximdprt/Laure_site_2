import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fill, getContent, pickFaq } from "@/content";
import { getService } from "@/config/services";
import { contentVars } from "@/lib/content-vars";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { serviceSchema } from "@/lib/schema";
import { absolute, buildMetadata, localizedPath } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Highlight, SplitSection, StepsList, TextSection, TitledHeading, TwoColumnRuleList } from "@/components/sections/blocks";
import { CtaFinal } from "@/components/sections/cta-banner";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { ServicePrices } from "@/components/sections/service-prices";
import { ButtonLink, LinkUnderline } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { Inline, MonoLabel, RichText, SectionLabel, SplitTitle } from "@/components/ui/typography";

const PATH = "/test-profil-chromatique" as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/test-profil-chromatique">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const { seo } = getContent(locale).test;
  return buildMetadata({ locale, href: PATH, title: seo.title, description: seo.description });
}

export default async function TestPage({ params }: PageProps<"/[locale]/test-profil-chromatique">) {
  const locale = await resolveLocale(params);
  const c = getContent(locale).test;
  const vars = contentVars(locale);
  const t = await getTranslations({ locale });

  return (
    <>
      <Hero
        locale={locale}
        image="test-couleurs"
        breadcrumbs={<Breadcrumbs tone="light" items={[{ label: t("nav.test"), href: PATH }]} />}
        label={c.hero.label}
        title={<SplitTitle as="h1" lead={c.hero.title} accent={c.hero.accent} />}
      >
        <p>{c.hero.subtitle}</p>
        <ButtonLink href={{ pathname: "/rendez-vous", query: { service: "test" } }} variant="light" className="mt-8">
          {c.hero.cta}
        </ButtonLink>
      </Hero>

      <Section aria-label={c.hero.title}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel number="01">{c.hook.label}</SectionLabel>
          </div>
          <Reveal className="lg:col-span-9">
            <p className="text-manifesto font-light leading-[1.12] tracking-[-0.025em]">
              <Inline text={c.intro} />
            </p>
          </Reveal>
        </div>
      </Section>

      <SplitSection locale={locale} image="univers-couleurs" number="02" label={c.hook.label} title={{ lead: c.whatIs.title.lead, accent: c.whatIs.title.accent }} id="quest-ce">
        <p className="serif-accent text-[26px] leading-[1.25]">{c.hook.question}</p>
        <RichText text={c.hook.text} className="mt-6 text-ink-muted" />
        <RichText text={c.whatIs.text} className="mt-5 text-ink-muted" />
        <Highlight text={c.whatIs.highlight} className="mt-10 border-t border-ink pt-8" />
      </SplitSection>

      <TextSection number="03" label={c.why.label} title={c.why.title} text={c.why.text} id="pourquoi">
        <div className="mt-10">
          <TwoColumnRuleList items={c.why.items} />
        </div>
        <Highlight text={c.why.highlight} className="mt-12" />
      </TextSection>

      <Section tone="paper" aria-labelledby="deroule">
        <SectionHeader number="04" label={c.steps.label} title={<TitledHeading title={c.steps.title} id="deroule" />} />
        <div className="lg:ml-[25%]">
          <StepsList steps={c.steps.items} />
          <p className="mt-8 text-ink-muted">
            <Inline text={`*${c.steps.note}*`} />
          </p>
        </div>
      </Section>

      <TextSection number="05" label={c.after.label} title={c.after.title} text={c.after.text} id="apres">
        <LinkUnderline href="/preparations-personnalisees" className="mt-8">
          {c.after.link}
        </LinkUnderline>
      </TextSection>

      <SplitSection
        locale={locale}
        image="distance"
        imageSide="right"
        number="06"
        label={c.remote.label}
        title={c.remote.title}
        id="distance"
      >
        <p className="text-[18px] text-ink-muted">{c.remote.text}</p>
        <ol className="mt-8 border-t border-ink">
          {c.remote.steps.map((step, i) => (
            <li key={step} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-5">
              <MonoLabel className="pt-1">({i + 1})</MonoLabel>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </SplitSection>

      <Section aria-labelledby="tarif">
        <SectionHeader number="07" label={c.price.label} title={<TitledHeading title={c.price.title} id="tarif" />} />
        <div className="lg:ml-[25%]">
          <ServicePrices locale={locale} ids={["test", "pack"]} />
          <p className="mt-6 text-ink-muted">{fill(c.price.depositNote, vars)}</p>
          <ButtonLink href={{ pathname: "/rendez-vous", query: { service: "test" } }} className="mt-8">
            {c.price.cta}
          </ButtonLink>
        </div>
      </Section>

      <FaqSection number="08" items={pickFaq(locale, c.faq, vars)} />

      <CtaFinal
        locale={locale}
        image="cta"
        title={
          <>
            {c.final.title.lead} <span className="serif-accent">{c.final.title.accent}</span>
          </>
        }
        primary={{ label: c.final.primary, href: { pathname: "/rendez-vous", query: { service: "test" } } }}
        secondary={{ label: c.final.secondary, href: { pathname: "/rendez-vous", query: { service: "decouverte" } } }}
      />

      <JsonLd
        data={[
          serviceSchema(getService("test"), locale, absolute(localizedPath(PATH, locale))),
          serviceSchema(getService("pack"), locale, absolute(localizedPath(PATH, locale))),
        ]}
      />
    </>
  );
}
