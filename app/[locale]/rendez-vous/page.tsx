import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getService, isServiceId } from "@/config/services";
import { isPlaceholder, siteConfig } from "@/config/site";
import { resolveLocale, metadataLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { BookingModule } from "@/components/booking/booking-module";
import { ContactForm } from "@/components/contact/contact-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageIntro } from "@/components/sections/page-intro";
import { LinkUnderline } from "@/components/ui/button";
import { RuleItem, RuleList } from "@/components/ui/rule-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { SectionLabel, SplitTitle } from "@/components/ui/typography";

export async function generateMetadata({ params }: PageProps<"/[locale]/rendez-vous">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const t = await getTranslations({ locale, namespace: "booking" });
  return buildMetadata({
    locale,
    href: "/rendez-vous",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

/** Contact / Rendez-vous : module de réservation, appel découverte, formulaire de contact, coordonnées */
export default async function BookingPage({ params, searchParams }: PageProps<"/[locale]/rendez-vous">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("booking");
  const tc = await getTranslations("contact");
  const tf = await getTranslations("footer");
  const ta = await getTranslations("a11y");
  const tn = await getTranslations("nav");
  const query = await searchParams;
  const requested = typeof query.service === "string" ? query.service : undefined;
  const initialService = isServiceId(requested) ? requested : undefined;
  const { contact, social, hours } = siteConfig;

  return (
    <>
      <PageIntro
        label={t("pageLabel")}
        title={<SplitTitle as="h1" size="h1" lead={t("pageTitleLead")} accent={t("pageTitleAccent")} />}
        breadcrumbs={<Breadcrumbs items={[{ label: tn("book"), href: "/rendez-vous" }]} />}
      >
        {t("pageIntro")}
      </PageIntro>

      <Section tight id="reservation" aria-label={t("moduleLabel")} className="scroll-mt-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel number="01">{t("moduleLabel")}</SectionLabel>
          </div>
          <div className="lg:col-span-9">
            <BookingModule key={initialService ?? "none"} initialService={initialService} />
          </div>
        </div>
      </Section>

      <Section tight aria-labelledby="prefer-talk">
        <div className="grid gap-8 border-t border-ink pt-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel number="02">{getService("decouverte").name[locale]}</SectionLabel>
          </div>
          <div className="lg:col-span-9">
            <h2 id="prefer-talk" className="text-h3 font-light">
              {t("preferTalkTitle")}
            </h2>
            <p className="mt-4 max-w-xl text-ink-muted">{t("preferTalkText")}</p>
            <LinkUnderline
              href={{ pathname: "/rendez-vous", query: { service: "decouverte" }, hash: "reservation" }}
              className="mt-6"
            >
              {t("preferTalkCta")}
            </LinkUnderline>
          </div>
        </div>
      </Section>

      <Section aria-labelledby="contact-title">
        <SectionHeader
          number="03"
          label={t("contactLabel")}
          title={<SplitTitle id="contact-title" lead={tc("titleLead")} accent={tc("titleAccent")} />}
          intro={tc("intro")}
        />
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 lg:col-start-4">
            <ContactForm />
          </div>
          <div className="lg:col-span-3">
            <h3 className="label-mono mb-5 text-ink-muted">{tc("coordinatesTitle")}</h3>
            <RuleList className="text-[15px]">
              <RuleItem className="py-4 md:py-4">
                <span className="label-mono block text-ink-muted">{tc("address")}</span>
                <address className="mt-1 not-italic">
                  {contact.address.street}
                  <br />
                  {contact.address.postalCode} {contact.address.city}
                </address>
                <span className="mt-1 block text-ink-muted">{t("remote")}</span>
              </RuleItem>
              <RuleItem className="py-4 md:py-4">
                <span className="label-mono block text-ink-muted">{tc("email")}</span>
                {isPlaceholder(contact.email) ? (
                  <span className="mt-1 block">{contact.email}</span>
                ) : (
                  <a href={`mailto:${contact.email}`} className="link-underline mt-1 break-all">
                    {contact.email}
                  </a>
                )}
              </RuleItem>
              <RuleItem className="py-4 md:py-4">
                <span className="label-mono block text-ink-muted">{tc("phone")}</span>
                {contact.phoneHref ? (
                  <a href={`tel:${contact.phoneHref}`} className="link-underline mt-1">
                    {contact.phone}
                  </a>
                ) : (
                  <span className="mt-1 block">{contact.phone}</span>
                )}
              </RuleItem>
              <RuleItem className="py-4 md:py-4">
                <span className="label-mono block text-ink-muted">{tc("hours")}</span>
                <span className="mt-1 block">{hours[locale]}</span>
              </RuleItem>
              <RuleItem className="py-4 md:py-4">
                <span className="label-mono block text-ink-muted">{tc("social")}</span>
                <span className="mt-1 flex gap-6">
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${tf("instagram")} ${ta("externalLink")}`}
                    className="link-underline"
                  >
                    Instagram ↗
                  </a>
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${tf("linkedin")} ${ta("externalLink")}`}
                    className="link-underline"
                  >
                    LinkedIn ↗
                  </a>
                </span>
              </RuleItem>
            </RuleList>
          </div>
        </div>
      </Section>
    </>
  );
}
