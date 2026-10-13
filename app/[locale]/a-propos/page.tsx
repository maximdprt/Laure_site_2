import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getContent } from "@/content";
import { isPlaceholder, siteConfig } from "@/config/site";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { personSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SplitSection, TextSection, TitledHeading } from "@/components/sections/blocks";
import { CtaFinal } from "@/components/sections/cta-banner";
import { Hero } from "@/components/sections/hero";
import { JsonLd } from "@/components/ui/json-ld";
import { Reveal } from "@/components/ui/reveal";
import { RuleItem, RuleList } from "@/components/ui/rule-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { MonoLabel, RichText } from "@/components/ui/typography";

const PATH = "/a-propos" as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/a-propos">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const { seo } = getContent(locale).about;
  return buildMetadata({ locale, href: PATH, title: seo.title, description: seo.description });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/a-propos">) {
  const locale = await resolveLocale(params);
  const c = getContent(locale).about;
  const t = await getTranslations({ locale });
  const { contact, social } = siteConfig;
  const external = "link-underline text-[15px]";

  return (
    <>
      <Hero
        locale={locale}
        image="lacanau-detente"
        breadcrumbs={<Breadcrumbs tone="light" items={[{ label: t("nav.about"), href: PATH }]} />}
        label={c.hero.label}
        title={<h1 className="text-h1 font-light">{c.hero.title}</h1>}
      >
        <p className="serif-accent text-[clamp(22px,2vw,30px)] leading-snug">{c.hero.subtitle}</p>
      </Hero>

      {/* Portrait : vraie photo de Laure uniquement [À COMPLÉTER] */}
      <SplitSection locale={locale} image="laure-portrait" number="01" label={c.approach.label} title={c.approach.title} id="approche">
        <RichText text={c.approach.text} className="text-[18px] text-ink-muted" />
      </SplitSection>

      <TextSection number="02" label={c.forWhom.label} title={c.forWhom.title} text={c.forWhom.text} id="pour-qui" />
      <TextSection tone="paper" number="03" label={c.personalised.label} title={c.personalised.title} text={c.personalised.text} id="personnalise" />
      <TextSection number="04" label={c.journey.label} title={c.journey.title} text={c.journey.text} id="parcours" />
      <TextSection tone="paper" number="05" label={c.training.label} title={c.training.title} text={c.training.text} id="formation" />
      <TextSection number="06" label={c.name.label} title={c.name.title} text={c.name.text} id="nlight" />

      {/* Valeurs : 3 colonnes séparées par des filets verticaux */}
      <Section tone="paper" aria-labelledby="valeurs">
        <SectionHeader number="07" label={c.values.label} title={<TitledHeading title={c.values.title} id="valeurs" />} />
        <ul className="grid border-t border-ink md:grid-cols-3">
          {c.values.items.map((value, i) => (
            <Reveal
              as="li"
              key={value.title}
              index={i}
              className="border-b border-line py-8 md:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0 md:first:pl-0"
            >
              <MonoLabel>{String(i + 1).padStart(2, "0")}</MonoLabel>
              <h3 className="serif-accent mt-6 text-[clamp(32px,3vw,44px)] leading-none">{value.title}</h3>
              <p className="mt-5 max-w-xs text-ink-muted">{value.text}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="ou">
        <SectionHeader number="08" label={c.location.label} title={<TitledHeading title={c.location.title} id="ou" />} />
        <div className="lg:ml-[25%]">
          <RuleList>
            <RuleItem>
              <MonoLabel>Lacanau</MonoLabel>
              <p className="mt-3 text-[18px]">{c.location.cabinet}</p>
              <p className="mt-2 text-ink-muted">
                {contact.address.street}, {contact.address.postalCode} {contact.address.city}
              </p>
              <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className={`${external} mt-3`}>
                {c.location.mapLink} <span aria-hidden>↗</span>
              </a>
            </RuleItem>
            <RuleItem>
              <MonoLabel>{t("footer.remote")}</MonoLabel>
              <p className="mt-3 text-[18px]">{c.location.remote}</p>
            </RuleItem>
            <RuleItem>
              <MonoLabel>{c.social.label}</MonoLabel>
              <div className="mt-3 flex gap-8">
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("footer.instagram")} ${t("a11y.externalLink")}`}
                  className={external}
                >
                  Instagram <span aria-hidden>↗</span>
                </a>
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("footer.linkedin")} ${t("a11y.externalLink")}`}
                  className={external}
                >
                  LinkedIn <span aria-hidden>↗</span>
                </a>
              </div>
              {!isPlaceholder(contact.email) && (
                <a href={`mailto:${contact.email}`} className={`${external} mt-2`}>
                  {contact.email}
                </a>
              )}
            </RuleItem>
          </RuleList>
        </div>
      </Section>

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

      <JsonLd data={personSchema(locale)} />
    </>
  );
}
