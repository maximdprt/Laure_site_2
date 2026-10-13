import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LinkUnderline } from "@/components/ui/button";
import { SiteImage } from "@/components/ui/site-image";

/** Encadré auteur : Laure Dupuch (portrait = vraie photo à fournir) */
export async function AuthorBox({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "journal" });
  return (
    <aside className="grid gap-6 border-t border-ink pt-8 sm:grid-cols-[120px_1fr] sm:gap-8">
      <SiteImage imageKey="laure-portrait" locale={locale} sizes="120px" className="w-[120px]" />
      <div>
        <p className="label-mono text-ink-muted">{t("authorTitle")}</p>
        <p className="mt-2 text-[24px] font-light tracking-[-0.02em]">Laure Dupuch</p>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-muted">{t("authorText")}</p>
        <LinkUnderline href="/a-propos" className="mt-3">
          {t("authorLink")}
        </LinkUnderline>
      </div>
    </aside>
  );
}
