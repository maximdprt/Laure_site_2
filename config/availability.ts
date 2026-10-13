import type { BookingFormat, ServiceId } from "./services";

/**
 * Disponibilités de l'agenda (heure de Paris).
 * ➜ Modifier ici : jours et plages d'ouverture, congés.
 * Les rendez-vous et indisponibilités du Google Agenda de Laure sont retirés automatiquement.
 * [À COMPLÉTER : horaires réels, jours fériés et congés]
 */

export const TIME_ZONE = "Europe/Paris";

/** Plage horaire au format "HH:mm" (les pauses = l'intervalle entre deux plages) */
export type TimeRange = { start: string; end: string };

/** 0 = dimanche, 1 = lundi … 6 = samedi */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type WeeklySchedule = Record<WeekDay, TimeRange[]>;

const fullDay: TimeRange[] = [
  { start: "09:00", end: "12:30" },
  { start: "14:00", end: "18:30" },
];

export const weeklySchedule: WeeklySchedule = {
  0: [], // dimanche
  1: [], // lundi
  2: fullDay, // mardi
  3: fullDay, // mercredi
  4: fullDay, // jeudi
  5: fullDay, // vendredi
  6: [{ start: "09:00", end: "13:00" }], // samedi
};

/** Dates fermées (jours fériés, congés) au format "YYYY-MM-DD" */
export const closedDates: string[] = [
  "2026-11-01",
  "2026-11-11",
  "2026-12-25",
  "2027-01-01",
  "2027-03-29",
  "2027-05-01",
  "2027-05-06",
  "2027-05-08",
  "2027-05-17",
  "2027-07-14",
  "2027-08-15",
  // [À COMPLÉTER : congés de Laure]
];

/** Pas entre deux débuts de créneau (minutes) */
export const SLOT_STEP_MINUTES = 30;
/** Battement minimal après un rendez-vous existant (minutes) */
export const BUFFER_MINUTES = 15;
/** Fenêtre de réservation (jours) */
export const BOOKING_WINDOW_DAYS = 60;

/** Délai minimum avant un rendez-vous (heures) */
export function minimumLeadHours(serviceId: ServiceId, format: BookingFormat): number {
  // Test ou pack à distance : le temps d'envoyer le support couleurs
  if (format === "distance" && (serviceId === "test" || serviceId === "pack")) return 5 * 24;
  return 24;
}
