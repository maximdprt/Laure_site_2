import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { breadcrumbSchema } from "@/lib/schema";
import { localizedPath, type Href } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/ui/json-ld";

export type Crumb = { label: string; href: Href };

/** Fil d'Ariane (toutes les pages sauf l'accueil) + balisage BreadcrumbList */
export async function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const all: Crumb[] = [{ label: t("breadcrumb.home"), href: "/" }, ...items];

  return (
    <>
      <nav aria-label={t("a11y.breadcrumb")}>
        <ol className={cn("label-mono flex flex-wrap items-center gap-x-2", tone === "light" ? "text-white/85" : "text-ink-muted")}>
          {all.map((crumb, i) => {
            const last = i === all.length - 1;
            return (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {last ? (
                  <span aria-current="page">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="inline-flex min-h-8 items-center hover:underline">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all.map((c) => ({ name: c.label, path: localizedPath(c.href, locale) })))} />
    </>
  );
}
