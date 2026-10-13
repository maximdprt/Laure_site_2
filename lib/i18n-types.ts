import type { Locale } from "@/i18n/routing";

/** Texte disponible dans les deux langues */
export type Localized<T = string> = Record<Locale, T>;
