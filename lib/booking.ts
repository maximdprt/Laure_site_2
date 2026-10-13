import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import {
  BOOKING_WINDOW_DAYS,
  BUFFER_MINUTES,
  closedDates,
  minimumLeadHours,
  SLOT_STEP_MINUTES,
  TIME_ZONE,
  weeklySchedule,
} from "@/config/availability";
import {
  formatLabels,
  getService,
  isServiceId,
  needsPostalAddress,
  type BookingFormat,
  type ServiceId,
} from "@/config/services";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { env } from "./env";
import { buildIcs } from "./ics";
import { localizedPath } from "./seo";
import type { Interval, SlotRules } from "./slots";

export const slotRules: SlotRules = {
  timeZone: TIME_ZONE,
  schedule: weeklySchedule,
  closedDates,
  stepMinutes: SLOT_STEP_MINUTES,
  bufferMinutes: BUFFER_MINUTES,
  windowDays: BOOKING_WINDOW_DAYS,
};

export function slotQuery(serviceId: ServiceId, format: BookingFormat, now: Date, busy: Interval[]) {
  return {
    durationMinutes: getService(serviceId).blockMinutes,
    leadHours: minimumLeadHours(serviceId, format),
    now,
    busy,
  };
}

const FORMATS: BookingFormat[] = ["cabinet", "distance", "telephone"];
export function isBookingFormat(value: unknown): value is BookingFormat {
  return typeof value === "string" && (FORMATS as string[]).includes(value);
}

/** Données complètes d'une réservation (Stripe metadata, e-mails, page de confirmation) */
export type BookingRecord = {
  eventId: string;
  serviceId: ServiceId;
  format: BookingFormat;
  start: string;
  end: string;
  locale: Locale;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine: string;
  postalCode: string;
  city: string;
  message: string;
};

const RECORD_KEYS = [
  "eventId",
  "serviceId",
  "format",
  "start",
  "end",
  "locale",
  "firstName",
  "lastName",
  "email",
  "phone",
  "addressLine",
  "postalCode",
  "city",
  "message",
] as const satisfies readonly (keyof BookingRecord)[];

/** Métadonnées Stripe (valeurs ≤ 500 caractères) */
export function toStripeMetadata(record: BookingRecord): Record<string, string> {
  const metadata: Record<string, string> = { kind: "booking" };
  for (const key of RECORD_KEYS) metadata[key] = record[key].slice(0, 500);
  return metadata;
}

export function fromStripeMetadata(metadata: Record<string, string> | null | undefined): BookingRecord | null {
  if (!metadata || metadata.kind !== "booking") return null;
  const { serviceId, format, locale, start, end, eventId, email } = metadata;
  if (!isServiceId(serviceId) || !isBookingFormat(format) || !start || !end || !eventId || !email) return null;
  return {
    eventId,
    serviceId,
    format,
    start,
    end,
    locale: locale === "en" ? "en" : "fr",
    firstName: metadata.firstName ?? "",
    lastName: metadata.lastName ?? "",
    email,
    phone: metadata.phone ?? "",
    addressLine: metadata.addressLine ?? "",
    postalCode: metadata.postalCode ?? "",
    city: metadata.city ?? "",
    message: metadata.message ?? "",
  };
}

/* ------------------------------------------------------------------ */
/* Lien de confirmation signé (appel découverte, sans paiement)         */
/* ------------------------------------------------------------------ */

export type BookingRef = Pick<BookingRecord, "eventId" | "serviceId" | "format" | "start" | "end" | "firstName" | "locale">;

function sign(data: string): string {
  return createHmac("sha256", env.signingSecret).update(data).digest("base64url");
}

export function signRef(ref: BookingRef): string {
  const data = Buffer.from(JSON.stringify(ref)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifyRef(token: string | undefined | null): BookingRef | null {
  if (!token) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const parsed: unknown = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (typeof parsed !== "object" || parsed === null) return null;
    const ref = parsed as Partial<BookingRef>;
    if (!isServiceId(ref.serviceId) || !isBookingFormat(ref.format) || !ref.start || !ref.end || !ref.eventId) return null;
    return {
      eventId: ref.eventId,
      serviceId: ref.serviceId,
      format: ref.format,
      start: ref.start,
      end: ref.end,
      firstName: ref.firstName ?? "",
      locale: ref.locale === "en" ? "en" : "fr",
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Mise en forme                                                       */
/* ------------------------------------------------------------------ */

const intl: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };

/** « mardi 3 novembre 2026 à 09:00 » (heure de Paris) */
export function formatDateTime(iso: string, locale: Locale): string {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat(intl[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
  return `${day} ${locale === "fr" ? "à" : "at"} ${formatTime(iso)}`;
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE }).format(new Date(iso));
}

export function cabinetAddress(): string {
  const a = siteConfig.contact.address;
  return `${a.street}, ${a.postalCode} ${a.city}`;
}

export function fullName(record: Pick<BookingRecord, "firstName" | "lastName">): string {
  return `${record.firstName} ${record.lastName}`.trim();
}

export function postalAddress(record: Pick<BookingRecord, "addressLine" | "postalCode" | "city">): string {
  return [record.addressLine, `${record.postalCode} ${record.city}`.trim()].filter(Boolean).join(", ");
}

/** Titre de l'événement Google Agenda (toujours en français : c'est l'agenda de Laure) */
export function holdTitle(record: BookingRecord): string {
  return `⏳ En attente – ${getService(record.serviceId).name.fr} – ${fullName(record)}`;
}

export function confirmedTitle(record: BookingRecord): string {
  return `✅ ${getService(record.serviceId).name.fr} – ${formatLabels[record.format].fr} – ${fullName(record)}`;
}

export function eventDescription(record: BookingRecord, extra?: string): string {
  const lines = [
    `Prestation : ${getService(record.serviceId).name.fr}`,
    `Format : ${formatLabels[record.format].fr}`,
    `Nom : ${fullName(record)}`,
    `E-mail : ${record.email}`,
    `Téléphone : ${record.phone}`,
  ];
  if (needsPostalAddress(record.serviceId, record.format)) {
    lines.push(`Adresse postale : ${postalAddress(record)}`);
    lines.push(`➜ Envoyer le support couleurs à : ${postalAddress(record)}`);
  }
  if (record.message) lines.push("", "Ce qui l'amène :", record.message);
  lines.push("", `Langue : ${record.locale.toUpperCase()}`);
  if (extra) lines.push(extra);
  return lines.join("\n");
}

/** Lieu affiché dans l'agenda du client */
export function locationFor(format: BookingFormat, locale: Locale): string {
  if (format === "cabinet") return cabinetAddress();
  return locale === "fr" ? "Par téléphone (Laure vous appelle)" : "By phone (Laure will call you)";
}

export function bookingIcs(record: Pick<BookingRecord, "eventId" | "serviceId" | "format" | "start" | "end" | "locale">): string {
  const service = getService(record.serviceId);
  const locale = record.locale;
  return buildIcs({
    uid: `${record.eventId}@nlight`,
    start: new Date(record.start),
    end: new Date(record.end),
    summary: `${service.name[locale]} – NLIGHT`,
    description:
      locale === "fr"
        ? `${service.name.fr} avec Laure Dupuch (${formatLabels[record.format].fr}).`
        : `${service.name.en} with Laure Dupuch (${formatLabels[record.format].en}).`,
    location: locationFor(record.format, locale),
    url: `${env.siteUrl}${localizedPath("/rendez-vous", locale)}`,
  });
}

export function confirmationUrl(locale: Locale, query: string): string {
  return `${env.siteUrl}${localizedPath("/rendez-vous/confirmation", locale)}?${query}`;
}
