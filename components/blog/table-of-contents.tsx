import { getTranslations } from "next-intl/server";
import type { PostHeading } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** Sommaire de l'article (intertitres H2 et H3) */
export async function TableOfContents({ headings }: { headings: PostHeading[] }) {
  const t = await getTranslations("journal");
  if (headings.length === 0) return null;
  return (
    <nav aria-label={t("toc")}>
      <p className="label-mono mb-3 text-ink-muted">{t("toc")}</p>
      <ol className="border-t border-ink">
        {headings
          .filter((h) => h.level === 2)
          .map((h) => (
            <li key={h.id} className="border-b border-line">
              <a
                href={`#${h.id}`}
                className={cn(
                  "block py-2.5 text-[14px] leading-snug text-ink-muted transition-[color,padding] duration-500 ease-soft hover:pl-1.5 hover:text-ink",
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
      </ol>
    </nav>
  );
}
