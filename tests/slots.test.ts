import { describe, expect, it } from "vitest";
import type { WeeklySchedule } from "@/config/availability";
import { computeSlots, daysBetween, isSlotAvailable, monthBounds, zonedTime, type SlotRules } from "@/lib/slots";

const TZ = "Europe/Paris";
const morning = [{ start: "09:00", end: "12:30" }];
const everyDay: WeeklySchedule = { 0: morning, 1: morning, 2: morning, 3: morning, 4: morning, 5: morning, 6: morning };

const rules: SlotRules = {
  timeZone: TZ,
  schedule: everyDay,
  closedDates: [],
  stepMinutes: 30,
  bufferMinutes: 15,
  windowDays: 60,
};

/** Un instant « loin dans le passé » + une fenêtre large, pour neutraliser délai et fenêtre */
const longBefore = new Date("2026-01-01T00:00:00Z");
const wide: SlotRules = { ...rules, windowDays: 1000 };

describe("computeSlots — horaires d'ouverture", () => {
  it("découpe la plage selon le pas et la durée (heure d'hiver, UTC+1)", () => {
    const now = new Date("2026-10-30T00:00:00Z");
    const slots = computeSlots(rules, {
      durationMinutes: 120,
      leadHours: 0,
      now,
      busy: [],
      fromDay: "2026-11-03",
      toDay: "2026-11-03",
    });
    expect(slots["2026-11-03"]).toEqual([
      "2026-11-03T08:00:00.000Z",
      "2026-11-03T08:30:00.000Z",
      "2026-11-03T09:00:00.000Z",
      "2026-11-03T09:30:00.000Z",
    ]);
  });

  it("respecte les pauses entre deux plages et les jours fermés de la semaine", () => {
    const schedule: WeeklySchedule = {
      ...everyDay,
      0: [],
      3: [
        { start: "09:00", end: "10:00" },
        { start: "14:00", end: "15:00" },
      ],
    };
    const slots = computeSlots(
      { ...rules, schedule },
      { durationMinutes: 60, leadHours: 0, now: new Date("2026-10-30T00:00:00Z"), busy: [], fromDay: "2026-11-01", toDay: "2026-11-04" },
    );
    expect(slots["2026-11-01"]).toBeUndefined(); // dimanche fermé
    expect(slots["2026-11-04"]).toEqual(["2026-11-04T08:00:00.000Z", "2026-11-04T13:00:00.000Z"]);
  });
});

describe("computeSlots — agenda occupé", () => {
  it("retire les événements occupés en tenant compte du battement de 15 min", () => {
    const busy = [{ start: zonedTime("2026-11-03", "10:00", TZ), end: zonedTime("2026-11-03", "11:00", TZ) }];
    const slots = computeSlots(rules, {
      durationMinutes: 30,
      leadHours: 0,
      now: new Date("2026-10-30T00:00:00Z"),
      busy,
      fromDay: "2026-11-03",
      toDay: "2026-11-03",
    });
    // Zone bloquée : 09:45 → 11:15 (heure de Paris)
    expect(slots["2026-11-03"]).toEqual([
      "2026-11-03T08:00:00.000Z", // 09:00
      "2026-11-03T10:30:00.000Z", // 11:30
      "2026-11-03T11:00:00.000Z", // 12:00
    ]);
  });

  it("supprime le jour entier quand il est complètement occupé", () => {
    const busy = [{ start: zonedTime("2026-11-03", "00:00", TZ), end: zonedTime("2026-11-04", "00:00", TZ) }];
    const slots = computeSlots(rules, {
      durationMinutes: 30,
      leadHours: 0,
      now: new Date("2026-10-30T00:00:00Z"),
      busy,
      fromDay: "2026-11-03",
      toDay: "2026-11-04",
    });
    expect(slots["2026-11-03"]).toBeUndefined();
    expect(slots["2026-11-04"]).toBeDefined();
  });
});

describe("computeSlots — délai minimum et fenêtre", () => {
  it("applique un délai de 24 h (cabinet / téléphone)", () => {
    const now = zonedTime("2026-11-02", "10:00", TZ);
    const slots = computeSlots(rules, { durationMinutes: 60, leadHours: 24, now, busy: [], fromDay: "2026-11-02", toDay: "2026-11-03" });
    expect(slots["2026-11-02"]).toBeUndefined();
    expect(slots["2026-11-03"]?.[0]).toBe(zonedTime("2026-11-03", "10:00", TZ).toISOString());
  });

  it("applique un délai de 5 jours pour un test à distance", () => {
    const now = zonedTime("2026-11-02", "10:00", TZ);
    const slots = computeSlots(rules, { durationMinutes: 120, leadHours: 120, now, busy: [], fromDay: "2026-11-02", toDay: "2026-11-08" });
    expect(Object.keys(slots)).toEqual(["2026-11-07", "2026-11-08"]);
    expect(slots["2026-11-07"]?.[0]).toBe(zonedTime("2026-11-07", "10:00", TZ).toISOString());
  });

  it("n'ouvre pas de créneau au-delà de la fenêtre de réservation", () => {
    const now = zonedTime("2026-11-02", "08:00", TZ);
    const slots = computeSlots(
      { ...rules, windowDays: 3 },
      { durationMinutes: 60, leadHours: 0, now, busy: [], fromDay: "2026-11-02", toDay: "2026-11-10" },
    );
    // Limite : jeudi 5 novembre 08:00 — le premier créneau de ce jour (09:00) est déjà hors fenêtre
    expect(Object.keys(slots)).toEqual(["2026-11-02", "2026-11-03", "2026-11-04"]);
  });

  it("ignore les dates fermées (jours fériés, congés)", () => {
    const slots = computeSlots(
      { ...wide, closedDates: ["2026-11-11"] },
      { durationMinutes: 60, leadHours: 0, now: longBefore, busy: [], fromDay: "2026-11-10", toDay: "2026-11-12" },
    );
    expect(Object.keys(slots)).toEqual(["2026-11-10", "2026-11-12"]);
  });
});

describe("computeSlots — changements d'heure", () => {
  it("passage à l'heure d'été (dernier dimanche de mars) : 09:00 = 07:00 UTC", () => {
    const slots = computeSlots(wide, {
      durationMinutes: 210,
      leadHours: 0,
      now: longBefore,
      busy: [],
      fromDay: "2026-03-28",
      toDay: "2026-03-29",
    });
    expect(slots["2026-03-28"]).toEqual(["2026-03-28T08:00:00.000Z"]); // samedi, UTC+1
    expect(slots["2026-03-29"]).toEqual(["2026-03-29T07:00:00.000Z"]); // dimanche, UTC+2
  });

  it("retour à l'heure d'hiver (dernier dimanche d'octobre) : 09:00 = 08:00 UTC", () => {
    const slots = computeSlots(wide, {
      durationMinutes: 210,
      leadHours: 0,
      now: longBefore,
      busy: [],
      fromDay: "2026-10-24",
      toDay: "2026-10-25",
    });
    expect(slots["2026-10-24"]).toEqual(["2026-10-24T07:00:00.000Z"]); // samedi, UTC+2
    expect(slots["2026-10-25"]).toEqual(["2026-10-25T08:00:00.000Z"]); // dimanche, UTC+1
  });

  it("énumère correctement les jours autour des changements d'heure", () => {
    expect(daysBetween("2026-03-28", "2026-03-30", TZ)).toEqual(["2026-03-28", "2026-03-29", "2026-03-30"]);
    expect(daysBetween("2026-10-24", "2026-10-26", TZ)).toEqual(["2026-10-24", "2026-10-25", "2026-10-26"]);
  });

  it("calcule un délai minimum qui chevauche un changement d'heure", () => {
    // Samedi 24 octobre 2026, 09:00 (UTC+2) + 24 h = dimanche 25 octobre, 08:00 (UTC+1)
    const now = zonedTime("2026-10-24", "09:00", TZ);
    const slots = computeSlots(rules, { durationMinutes: 60, leadHours: 24, now, busy: [], fromDay: "2026-10-25", toDay: "2026-10-25" });
    expect(slots["2026-10-25"]?.[0]).toBe("2026-10-25T08:00:00.000Z");
  });
});

describe("utilitaires", () => {
  it("monthBounds renvoie le premier et le dernier jour du mois", () => {
    expect(monthBounds("2027-02")).toEqual({ fromDay: "2027-02-01", toDay: "2027-02-28" });
    expect(monthBounds("2028-02")).toEqual({ fromDay: "2028-02-01", toDay: "2028-02-29" });
  });

  it("isSlotAvailable valide uniquement un créneau proposé", () => {
    const query = { durationMinutes: 60, leadHours: 0, now: longBefore, busy: [] };
    expect(isSlotAvailable(wide, query, "2026-11-03T08:00:00.000Z")).toBe(true);
    expect(isSlotAvailable(wide, query, "2026-11-03T08:10:00.000Z")).toBe(false);
    expect(isSlotAvailable(wide, query, "pas-une-date")).toBe(false);
  });
});
