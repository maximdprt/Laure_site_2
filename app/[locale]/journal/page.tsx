import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/blog";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { PostList } from "@/components/blog/post-list";
import { PageIntro } from "@/components/sections/page-intro";
import { Section, SectionHeader } from "@/components/ui/section";
import { SplitTitle } from "@/components/ui/typography";

const seo = {
  fr: {
    title: "Journal : couleurs, fleurs et émotions | NLIGHT",
    description:
      "Articles sur les couleurs et les émotions, les élixirs floraux, le Test de Profil Chromatique et l'accompagnement à distance, par Laure Dupuch.",
  },
  en: {
    title: "Journal: colours, flowers and emotions | NLIGHT",
    description:
      "Articles on colours and emotions, flower essences, the Chromatic Profile Test and remote support, by Laure Dupuch.",
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/journal">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  return buildMetadata({ locale, href: "/journal", ...seo[locale] });
}

export default async function JournalPage({ params }: PageProps<"/[locale]/journal">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "journal" });
  const posts = await getAllPosts(locale);

  return (
    <>
      <PageIntro
        breadcrumbs={<Breadcrumbs items={[{ label: t("title"), href: "/journal" }]} />}
        label={t("label")}
        title={<SplitTitle as="h1" size="h1" lead={t("titleLead")} accent={`${t("title")}.`} />}
      >
        {t("intro")}
      </PageIntro>

      <Section tight className="pt-0 md:pt-0">
        {posts.length > 0 ? (
          <PostList posts={posts} locale={locale} />
        ) : (
          <p className="text-ink-muted">{t("empty")}</p>
        )}
      </Section>

      <Section aria-labelledby="journal-newsletter">
        <SectionHeader
          label="Newsletter"
          title={<SplitTitle id="journal-newsletter" lead={t("newsletterTitle")} />}
          intro={t("newsletterText")}
        />
        <div className="max-w-xl lg:ml-[25%]">
          <NewsletterForm withFirstName />
        </div>
      </Section>
    </>
  );
}
