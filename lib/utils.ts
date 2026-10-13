import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/i18n/routing";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const intlLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };

export function toIntlLocale(locale: Locale): string {
  return intlLocale[locale];
}

/** 6500 → « 65 € » (fr) / « €65 » (en) */
export function formatPrice(cents: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function absoluteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
