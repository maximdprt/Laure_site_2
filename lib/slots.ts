import { TZDate } from "@date-fns/tz";
import type { TimeRange, WeekDay, WeeklySchedule } from "@/config/availability";

/**
 * Calcul des créneaux libres (logique pure, sans accès réseau) :
 * horaires d'ouverture − événements occupés (+ battement) − délai minimum − fenêtre de réservation.
 * Toutes les heures d'ouverture sont exprimées en heure de Paris ; les créneaux sont renvoyés en ISO UTC.
 * Les changements d'heure été/hiver sont gérés par TZDate (Europe/Paris).
 */

export type Interval = { start: Date; end: Date };

export type SlotRules = {
  timeZone: string;
  schedule: WeeklySchedule;
  /** Dates fermées "YYYY-MM-DD" (heure de Paris) */
  closedDates: readonly string[];
  stepMinutes: number;
  bufferMinutes: number;
  windowDays: number;
};

export type SlotQuery = {
  /** Durée bloquée par la prestation (minutes) */
  durationMinutes: number;
  /** Délai minimum avant le rendez-vous (heures) */
  leadHours: number;
  /** Instant présent */
  now: Date;
  /** Périodes occupées (Google Agenda) */
  busy: readonly Interval[];
  /** Premier et dernier jour à calculer, "YYYY-MM-DD" (heure de Paris), inclus */
  fromDay: string;
  toDay: string;
};

const MINUTE = 60_000;

/** "YYYY-MM-DD" d'un instant, dans le fuseau donné */
export function dayKey(date: Date, timeZone: string): string {
  const d = new TZDate(date.getTime(), timeZone);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDay(day: string): { y: number; m: number; d: number } {
  const [y, m, d] = day.split("-").map(Number);
  if (!y || !m || !d) throw new Error(`Jour invalide : ${day}`);
  return { y, m: m - 1, d };
}

function parseTime(time: string): { h: number; min: number } {
  const [h, min] = time.split(":").map(Number);
  return { h: h ?? 0, min: min ?? 0 };
}

/** Instant correspondant à une heure murale de Paris */
export function zonedTime(day: string, time: string, timeZone: string): Date {
  const { y, m, d } = parseDay(day);
  const { h, min } = parseTime(time);
  return new Date(new TZDate(y, m, d, h, min, timeZone).getTime());
}

/** Liste des jours "YYYY-MM-DD" entre deux jours inclus */
export function daysBetween(fromDay: string, toDay: string, timeZone: string): string[] {
  const { y, m, d } = parseDay(fromDay);
  const days: string[] = [];
  for (let i = 0; i < 400; i++) {
    // Midi : jamais affecté par un changement d'heure
    const date = new TZDate(y, m, d + i, 12, 0, timeZone);
    const key = dayKey(date, timeZone);
    if (key > toDay) break;
    days.push(key);
  }
  return days;
}

/** Premier et dernier jour d'un mois "YYYY-MM" */
export function monthBounds(month: string): { fromDay: string; toDay: string } {
  const [y, m] = month.split("-").map(Number);
  if (!y || !m || m < 1 || m > 12) throw new Error(`Mois invalide : ${month}`);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const mm = String(m).padStart(2, "0");
  return { fromDay: `${y}-${mm}-01`, toDay: `${y}-${mm}-${String(last).padStart(2, "0")}` };
}

function weekDay(day: string, timeZone: string): WeekDay {
  const { y, m, d } = parseDay(day);
  return new TZDate(y, m, d, 12, 0, timeZone).getDay() as WeekDay;
}

function overlaps(a: Interval, b: Interval): boolean {
  return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();
}

/**
 * Créneaux libres par jour : { "2026-11-03": ["2026-11-03T08:00:00.000Z", …] }.
 * Les jours sans créneau ne figurent pas dans le résultat.
 */
export function computeSlots(rules: SlotRules, query: SlotQuery): Record<string, string[]> {
  const { timeZone } = rules;
  const earliest = query.now.getTime() + query.leadHours * 60 * MINUTE;
  const latest = query.now.getTime() + rules.windowDays * 24 * 60 * MINUTE;
  const buffer = rules.bufferMinutes * MINUTE;
  const duration = query.durationMinutes * MINUTE;
  const step = rules.stepMinutes * MINUTE;
  const busy: Interval[] = query.busy.map((b) => ({
    start: new Date(b.start.getTime() - buffer),
    end: new Date(b.end.getTime() + buffer),
  }));
  const closed = new Set(rules.closedDates);
  const result: Record<string, string[]> = {};

  for (const day of daysBetween(query.fromDay, query.toDay, timeZone)) {
    if (closed.has(day)) continue;
    const ranges: TimeRange[] = rules.schedule[weekDay(day, timeZone)];
    const slots: string[] = [];
    for (const range of ranges) {
      const rangeStart = zonedTime(day, range.start, timeZone).getTime();
      const rangeEnd = zonedTime(day, range.end, timeZone).getTime();
      for (let t = rangeStart; t + duration <= rangeEnd; t += step) {
        if (t < earliest || t > latest) continue;
        const slot = { start: new Date(t), end: new Date(t + duration) };
        if (busy.some((b) => overlaps(slot, b))) continue;
        slots.push(slot.start.toISOString());
      }
    }
    if (slots.length > 0) result[day] = slots;
  }
  return result;
}

/** Le créneau demandé fait-il partie des créneaux libres ? */
export function isSlotAvailable(rules: SlotRules, query: Omit<SlotQuery, "fromDay" | "toDay">, startIso: string): boolean {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return false;
  const day = dayKey(start, rules.timeZone);
  const slots = computeSlots(rules, { ...query, fromDay: day, toDay: day });
  return (slots[day] ?? []).includes(start.toISOString());
}
