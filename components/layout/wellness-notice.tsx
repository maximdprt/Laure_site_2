import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** Mention bien-être obligatoire (section 10.3) */
export function WellnessNotice({ withTitle = false, className }: { withTitle?: boolean; className?: string }) {
  const t = useTranslations("wellness");
  return (
    <div className={cn("border-t border-line pt-5 text-[13px] leading-relaxed text-ink-muted", className)}>
      {withTitle && <p className="label-mono mb-2">{t("title")}</p>}
      <p className="max-w-2xl">{t("notice")}</p>
    </div>
  );
}
