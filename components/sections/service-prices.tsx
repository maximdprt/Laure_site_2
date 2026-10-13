import { getTranslations } from "next-intl/server";
import { getService, type ServiceId } from "@/config/services";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/utils";
import { RuleLinkItem, RuleList } from "@/components/ui/rule-list";
import { MonoLabel, Price } from "@/components/ui/typography";

/** Rappel des tarifs de quelques prestations (lus dans config/services.ts) */
export async function ServicePrices({ locale, ids }: { locale: Locale; ids: ServiceId[] }) {
  const t = await getTranslations({ locale });
  return (
    <RuleList>
      {ids.map((id) => {
        const s = getService(id);
        return (
          <RuleLinkItem key={id} href={{ pathname: "/rendez-vous", query: { service: id } }} className="items-baseline">
            <div>
              <p className="text-[20px] tracking-[-0.01em] md:text-[22px]">
                {s.name[locale]}
                {s.featured && <MonoLabel className="ml-3 align-middle text-ink">{t("pricingList.mostChosen")}</MonoLabel>}
              </p>
              <p className="mt-1 text-[15px] text-ink-muted">{s.formatSummary[locale]}</p>
            </div>
            <Price>{s.priceCents === 0 ? t("common.free") : formatPrice(s.priceCents, locale)}</Price>
          </RuleLinkItem>
        );
      })}
    </RuleList>
  );
}
