import { getTranslations } from "next-intl/server";
import type { LegalDocument as LegalDoc } from "@/content/legal";
import type { StaticPathname } from "@/i18n/routing";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageIntro } from "@/components/sections/page-intro";
import { LinkUnderline } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Inline, MonoLabel, RichText, SplitTitle } from "@/components/ui/typography";

/** Mise en page d'un document légal : en-tête de page + colonne de lecture à sections séparées par des filets */
export async function LegalDocument({ doc, href }: { doc: LegalDoc; href: StaticPathname }) {
  const t = await getTranslations("legal");
  return (
    <>
      <PageIntro
        breadcrumbs={<Breadcrumbs items={[{ label: `${doc.titleLead} ${doc.titleAccent}`, href }]} />}
        label={doc.label}
        title={<SplitTitle as="h1" size="h1" lead={doc.titleLead} accent={doc.titleAccent} />}
      >
        {doc.intro}
      </PageIntro>

      <Section tight className="pt-0 md:pt-0">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <MonoLabel>{t("updated", { date: doc.updated })}</MonoLabel>
          </div>
          <div className="border-t border-ink lg:col-span-8">
            {doc.sections.map((section) => (
              <section key={section.heading} className="border-b border-line py-10">
                <h2 className="text-[clamp(24px,2.2vw,30px)] font-light leading-[1.15] tracking-[-0.02em]">
                  {section.heading}
                </h2>
                <div className="prose-site mt-5 text-[16px] leading-[1.7] text-ink-muted">
                  {section.paragraphs && <RichText text={section.paragraphs} />}
                  {section.list && (
                    <ul className={section.paragraphs ? "mt-5" : undefined}>
                      {section.list.map((item) => (
                        <li key={item} className="border-b border-line py-2.5 first:border-t">
                          <Inline text={item} />
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.after && <RichText text={section.after} className="mt-5" />}
                  {section.links && (
                    <div className="mt-5 flex flex-wrap gap-6">
                      {section.links.map((link) => (
                        <LinkUnderline key={link.href} href={link.href} className="text-ink">
                          {link.label}
                        </LinkUnderline>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
