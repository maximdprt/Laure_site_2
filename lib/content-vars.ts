import { DEPOSIT_CENTS, FREE_CANCELLATION_HOURS } from "@/config/services";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/config/shipping";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "./utils";

/** Variables injectées dans les textes ({deposit}, {hours}, {threshold}) depuis config/ */
export function contentVars(locale: Locale): Record<string, string> {
  return {
    deposit: formatPrice(DEPOSIT_CENTS, locale),
    hours: String(FREE_CANCELLATION_HOURS),
    threshold: formatPrice(FREE_SHIPPING_THRESHOLD_CENTS, locale),
  };
}
