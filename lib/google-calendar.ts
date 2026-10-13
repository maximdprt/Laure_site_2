import "server-only";
import { auth, calendar, type calendar_v3 } from "@googleapis/calendar";
import { TIME_ZONE } from "@/config/availability";
import type { BookingFormat, ServiceId } from "@/config/services";
import { env } from "./env";
import type { Interval } from "./slots";

/**
 * Google Agenda = source de vérité des disponibilités.
 * Accès via un compte de service avec lequel Laure a partagé son agenda
 * (droit « Apporter des modifications aux événements »).
 */

export type BookingStatus = "hold" | "confirmed";

/** Données de réservation stockées dans extendedProperties.private de l'événement */
export type BookingProps = {
  status: BookingStatus;
  /** Fin de blocage du créneau pendant le paiement (ISO) */
  holdUntil: string;
  serviceId: ServiceId;
  format: BookingFormat;
  locale: "fr" | "en";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine: string;
  postalCode: string;
  city: string;
  message: string;
  stripeSessionId?: string;
};

export type CalendarBooking = {
  id: string;
  start: Date;
  end: Date;
  summary: string;
  created: Date;
  props: Partial<BookingProps>;
};

let client: calendar_v3.Calendar | null = null;

export function isCalendarConfigured(): boolean {
  return Boolean(env.googleServiceAccountEmail && env.googleServiceAccountPrivateKey && env.googleCalendarId);
}

/**
 * Mode développement sans Google Agenda : aucune disponibilité n'est retirée,
 * les événements sont simulés (journalisés dans la console). Jamais en production.
 */
export function isCalendarMock(): boolean {
  return !isCalendarConfigured() && !env.isProduction;
}

function getCalendar(): { api: calendar_v3.Calendar; calendarId: string } {
  if (!env.googleServiceAccountEmail || !env.googleServiceAccountPrivateKey || !env.googleCalendarId) {
    throw new Error("Google Agenda non configuré (variables GOOGLE_* manquantes)");
  }
  if (!client) {
    const jwt = new auth.JWT({
      email: env.googleServiceAccountEmail,
      key: env.googleServiceAccountPrivateKey,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
    client = calendar({ version: "v3", auth: jwt });
  }
  return { api: client, calendarId: env.googleCalendarId };
}

/** Périodes occupées entre deux instants (événements de Laure + créneaux provisoires) */
export async function getBusyIntervals(timeMin: Date, timeMax: Date): Promise<Interval[]> {
  // Développement sans Google Agenda : aucun événement occupé
  if (isCalendarMock()) return [];
  const { api, calendarId } = getCalendar();
  const res = await api.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: TIME_ZONE,
      items: [{ id: calendarId }],
    },
  });
  const cal = res.data.calendars?.[calendarId];
  if (cal?.errors?.length) throw new Error(`freebusy: ${cal.errors.map((e) => e.reason).join(", ")}`);
  return (cal?.busy ?? []).flatMap((b) =>
    b.start && b.end ? [{ start: new Date(b.start), end: new Date(b.end) }] : [],
  );
}

function toPrivate(props: Partial<BookingProps>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(props)) {
    // Google limite chaque valeur à 1024 caractères
    if (typeof value === "string") out[key] = value.slice(0, 1000);
  }
  return out;
}

function fromEvent(event: calendar_v3.Schema$Event): CalendarBooking | null {
  const start = event.start?.dateTime ?? event.start?.date;
  const end = event.end?.dateTime ?? event.end?.date;
  if (!event.id || !start || !end) return null;
  return {
    id: event.id,
    start: new Date(start),
    end: new Date(end),
    summary: event.summary ?? "",
    created: new Date(event.created ?? 0),
    props: (event.extendedProperties?.private ?? {}) as Partial<BookingProps>,
  };
}

type EventInput = { summary: string; description: string; start: Date; end: Date; props: BookingProps };

export async function createEvent(input: EventInput): Promise<string> {
  if (isCalendarMock()) {
    const id = `dev${Date.now().toString(36)}`;
    console.info(`[NLIGHT:agenda] (simulé) ${input.summary} — ${input.start.toISOString()}`);
    return id;
  }
  const { api, calendarId } = getCalendar();
  const res = await api.events.insert({
    calendarId,
    requestBody: {
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.start.toISOString(), timeZone: TIME_ZONE },
      end: { dateTime: input.end.toISOString(), timeZone: TIME_ZONE },
      transparency: "opaque",
      extendedProperties: { private: toPrivate(input.props) },
    },
  });
  if (!res.data.id) throw new Error("Création de l'événement impossible");
  return res.data.id;
}

/** Renvoie l'événement, ou null s'il n'existe plus (supprimé / annulé) */
export async function getEvent(eventId: string): Promise<CalendarBooking | null> {
  if (isCalendarMock()) return null;
  const { api, calendarId } = getCalendar();
  try {
    const res = await api.events.get({ calendarId, eventId });
    if (res.data.status === "cancelled") return null;
    return fromEvent(res.data);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function updateEvent(
  eventId: string,
  patch: { summary: string; description: string; props: Partial<BookingProps> },
): Promise<void> {
  if (isCalendarMock()) return;
  const { api, calendarId } = getCalendar();
  await api.events.patch({
    calendarId,
    eventId,
    requestBody: {
      summary: patch.summary,
      description: patch.description,
      extendedProperties: { private: toPrivate(patch.props) },
    },
  });
}

export async function deleteEvent(eventId: string): Promise<void> {
  if (isCalendarMock()) return;
  const { api, calendarId } = getCalendar();
  try {
    await api.events.delete({ calendarId, eventId });
  } catch (error) {
    if (!isNotFound(error)) throw error;
  }
}

/** Événements qui chevauchent un intervalle (pour détecter une réservation concurrente) */
export async function listOverlappingEvents(start: Date, end: Date): Promise<(CalendarBooking & { transparent: boolean })[]> {
  if (isCalendarMock()) return [];
  const { api, calendarId } = getCalendar();
  const res = await api.events.list({
    calendarId,
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    showDeleted: false,
    maxResults: 50,
  });
  return (res.data.items ?? []).flatMap((event) => {
    const booking = fromEvent(event);
    return booking && event.status !== "cancelled" ? [{ ...booking, transparent: event.transparency === "transparent" }] : [];
  });
}

/** Créneaux provisoires dont le délai de paiement est dépassé */
export async function listExpiredHolds(now: Date): Promise<CalendarBooking[]> {
  if (isCalendarMock()) return [];
  const { api, calendarId } = getCalendar();
  const res = await api.events.list({
    calendarId,
    privateExtendedProperty: ["status=hold"],
    timeMin: new Date(now.getTime() - 24 * 3600_000).toISOString(),
    singleEvents: true,
    maxResults: 250,
  });
  return (res.data.items ?? []).flatMap((event) => {
    const booking = fromEvent(event);
    if (!booking || event.status === "cancelled") return [];
    const until = booking.props.holdUntil ? new Date(booking.props.holdUntil) : null;
    return until && until.getTime() < now.getTime() ? [booking] : [];
  });
}

function isNotFound(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const code = "code" in error ? error.code : "status" in error ? error.status : undefined;
  return code === 404 || code === 410 || code === "404" || code === "410";
}
