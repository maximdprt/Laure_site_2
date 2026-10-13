import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { images } from "@/config/images";
import { redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPosts, getPostBySlug, getRelatedPosts, getTranslation, type PostMeta } from "@/lib/blog";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { articleSchema } from "@/lib/schema";
import { absolute, buildMetadata, localizedPath } from "@/lib/seo";
import { toIntlLocale } from "@/lib/utils";
import { AuthorBox } from "@/components/blog/author-box";
import { PostTeaser } from "@/components/blog/post-list";
import { ShareLinks } from "@/components/blog/share-links";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ReadingProgress } from "@/components/motion/reading-progress";
import { PageIntro } from "@/components/sections/page-intro";
import { LinkUnderline } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { delayStyle } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import { MonoLabel, SectionLabel } from "@/components/ui/typography";

type Props = PageProps<"/[locale]/journal/[slug]">;

export async function generateStaticParams() {
  const params: { locale: Locale; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const post of await getAllPosts(locale)) params.push({ locale, slug: post.slug });
  }
  return params;
}

const postPath = (slug: string, locale: Locale) => localizedPath({ pathname: "/journal/[slug]", params: { slug } }, locale);

/** Chemins de l'article dans chaque langue (slugs traduits) */
async function alternatesFor(post: PostMeta): Promise<Partial<Record<Locale, string>>> {
  const result: Partial<Record<Locale, string>> = {};
  for (const l of routing.locales) {
    const version = l === post.lang ? post : await getTranslation(post.translationKey, l);
    if (version) result[l] = postPath(version.slug, l);
  }
  return result;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const { slug } = await params;
  const post = await getPostBySlug(locale, slug);
  if (!post) return {};
  const alternates = await alternatesFor(post);
  const metadata = buildMetadata({
    locale,
    href: { pathname: "/journal/[slug]", params: { slug } },
    title: `${post.title} | NLIGHT`,
    description: post.description,
    alternates: { fr: alternates.fr ?? alternates.en, en: alternates.en ?? alternates.fr },
    type: "article",
    publishedTime: post.date,
  });
  return { ...metadata, keywords: post.keywords };
}

export default async function ArticlePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const post = await getPostBySlug(locale, slug);

  if (!post) {
    // Slug de l'autre langue (ex. sélecteur de langue) : redirection vers le slug traduit
    for (const other of routing.locales.filter((l) => l !== locale)) {
      const original = await getPostBySlug(other, slug);
      if (!original) continue;
      const translated = await getTranslation(original.translationKey, locale);
      if (translated) redirect({ href: { pathname: "/journal/[slug]", params: { slug: translated.slug } }, locale });
    }
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "journal" });
  const related = await getRelatedPosts(locale, post.translationKey, 2);
  const path = postPath(post.slug, locale);
  const date = new Intl.DateTimeFormat(toIntlLocale(locale), { dateStyle: "long" }).format(new Date(post.date));

  return (
    <article>
      <ReadingProgress />
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: t("title"), href: "/journal" },
              { label: post.title, href: { pathname: "/journal/[slug]", params: { slug: post.slug } } },
            ]}
          />
        }
        label={
          <>
            {post.category} · {t("readingTime", { minutes: post.readingTime })}
          </>
        }
        title={
          <h1 className="intro-rise max-w-5xl text-[clamp(40px,5.6vw,84px)] font-light leading-[1] tracking-[-0.035em]">
            {post.title}
          </h1>
        }
      >
        {post.description}
      </PageIntro>

      <div className="container-site">
        <div className="intro-rise overflow-hidden" style={delayStyle(0.45)}>
          <div className="hero-zoom">
            <SiteImage imageKey={post.cover} locale={locale} ratio="16/9" priority sizes="(min-width: 1424px) 1360px, 100vw" />
          </div>
        </div>
      </div>

      <Section tight>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <aside className="flex flex-col gap-10 lg:col-span-3">
            <div className="lg:sticky lg:top-28 lg:flex lg:flex-col lg:gap-10">
              <div>
                <MonoLabel>
                  <time dateTime={post.date}>{t("publishedOn", { date })}</time>
                </MonoLabel>
              </div>
              <TableOfContents headings={post.headings} />
              <ShareLinks url={absolute(path)} title={post.title} />
            </div>
          </aside>

          <div className="min-w-0 lg:col-span-7 lg:col-start-5">
            <div className="prose-site">{post.content}</div>
            <div className="mt-16">
              <AuthorBox locale={locale} />
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tight aria-labelledby="related-title" className="border-t border-line">
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
            <SectionLabel>
              <span id="related-title">{t("related")}</span>
            </SectionLabel>
            <LinkUnderline href="/journal">{t("allArticles")}</LinkUnderline>
          </div>
          <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
            {related.map((p, i) => (
              <PostTeaser key={p.translationKey} post={p} locale={locale} index={i} headingLevel="h3" />
            ))}
          </ul>
        </Section>
      )}

      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description,
          date: post.date,
          path,
          image: images[post.cover].src,
          locale,
          keywords: post.keywords,
        })}
      />
    </article>
  );
}
