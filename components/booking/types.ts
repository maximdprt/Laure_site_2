import type { BookingFormat, ServiceId } from "@/config/services";
import type { BookingInput } from "@/lib/validation";

export type BookingDraft = {
  serviceId?: ServiceId;
  format?: BookingFormat;
  /** Début du créneau, ISO UTC */
  start?: string;
  details?: BookingInput;
};

export type StepId = "service" | "format" | "slot" | "details" | "summary";

export const STEPS: StepId[] = ["service", "format", "slot", "details", "summary"];

const TZ = "Europe/Paris";

/** « mardi 3 novembre » (heure de Paris) */
export function formatDay(iso: string, locale: string, withYear = false): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(iso));
}

/** "YYYY-MM-DD" et "YYYY-MM" d'un instant, en heure de Paris */
export function parisDayKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: TZ }).format(date);
  return parts;
}

export function addMonths(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 2026, (m ?? 1) - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function addDays(day: string, delta: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 2026, (m ?? 1) - 1, (d ?? 1) + delta));
  return date.toISOString().slice(0, 10);
}
