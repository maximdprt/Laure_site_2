import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { PostMeta } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";
import { MonoLabel } from "@/components/ui/typography";

/** Un article dans la grille éditoriale (sans carte) */
export async function PostTeaser({
  post,
  locale,
  featured = false,
  index = 0,
  headingLevel = "h2",
}: {
  post: PostMeta;
  locale: Locale;
  featured?: boolean;
  index?: number;
  headingLevel?: "h2" | "h3";
}) {
  const t = await getTranslations({ locale });
  const Heading = headingLevel;
  return (
    <Reveal index={index} as="li" className={cn(featured && "md:col-span-2 lg:col-span-3")}>
      <Link
        href={{ pathname: "/journal/[slug]", params: { slug: post.slug } }}
        className={cn("group block", featured && "md:grid md:grid-cols-2 md:items-end md:gap-8")}
      >
        <SiteImage
          imageKey={post.cover}
          locale={locale}
          ratio="3/2"
          decorative
          hoverZoom
          sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
        />
        <div className={cn("mt-5", featured && "md:mt-0 md:pb-2")}>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <MonoLabel>{post.category}</MonoLabel>
            <MonoLabel>{t("journal.readingTime", { minutes: post.readingTime })}</MonoLabel>
          </p>
          <Heading
            className={cn(
              "mt-3 font-light tracking-[-0.025em] transition-opacity group-hover:opacity-70",
              featured ? "text-[clamp(30px,3.4vw,48px)] leading-[1.05]" : "text-[26px] leading-[1.12]",
            )}
          >
            {post.title}
          </Heading>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-muted">{post.description}</p>
          <span className="link-underline mt-3 text-[14px]">
            {t("common.readMore")}
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

/** Grille éditoriale : le premier article en grand, les suivants sur 3 colonnes */
export async function PostList({ posts, locale, featureFirst = true }: { posts: PostMeta[]; locale: Locale; featureFirst?: boolean }) {
  return (
    <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <PostTeaser
          key={post.translationKey}
          post={post}
          locale={locale}
          index={i}
          featured={featureFirst && i === 0}
        />
      ))}
    </ul>
  );
}
