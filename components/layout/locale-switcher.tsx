"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Href = Parameters<typeof Link>[0]["href"];

const languageNames: Record<Locale, string> = { fr: "Version française", en: "English version" };

/** « FR / EN » : renvoie vers la page équivalente dans l'autre langue (slugs traduits) */
export function LocaleSwitcher({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const t = useTranslations("a11y");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();

  const dynamicParams = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => key !== "locale" && typeof value === "string"),
  );
  const href = (Object.keys(dynamicParams).length > 0 ? { pathname, params: dynamicParams } : pathname) as Href;

  return (
    <nav aria-label={t("languageSwitcher")} className={cn("flex items-center", className)}>
      <ul className="flex items-center gap-1.5 text-[14px]">
        {routing.locales.map((l: Locale, i) => (
          <li key={l} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden className="opacity-50">
                /
              </span>
            )}
            {l === locale ? (
              <span aria-current="true" className="inline-flex min-h-11 items-center">
                <span className="sr-only">{t("currentLanguage")}</span>
                <span aria-hidden>{l.toUpperCase()}</span>
              </span>
            ) : (
              <Link
                href={href}
                locale={l}
                hrefLang={l}
                lang={l}
                onClick={onNavigate}
                aria-label={languageNames[l]}
                className="inline-flex min-h-11 items-center opacity-65 transition-opacity hover:opacity-100"
              >
                {l.toUpperCase()}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
