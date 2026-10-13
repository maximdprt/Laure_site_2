"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { addDays, addMonths } from "./types";

type BookingCalendarProps = {
  /** Mois affiché "YYYY-MM" */
  month: string;
  minMonth: string;
  maxMonth: string;
  /** Jours disponibles "YYYY-MM-DD" (null pendant le chargement) */
  availableDays: Set<string> | null;
  selectedDay: string | undefined;
  focusDay: string;
  onFocusDay: (day: string) => void;
  onSelectDay: (day: string) => void;
  onMonthChange: (month: string) => void;
};

function monthDays(month: string): { offset: number; days: string[] } {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y ?? 2026, (m ?? 1) - 1, 1));
  const count = new Date(Date.UTC(y ?? 2026, m ?? 1, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7; // semaine commençant le lundi
  const days = Array.from({ length: count }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
  return { offset, days };
}

/**
 * Calendrier mensuel accessible (role="grid") :
 * flèches = jour / semaine, Début / Fin = début / fin de semaine, Page préc. / suiv. = mois.
 */
export function BookingCalendar({
  month,
  minMonth,
  maxMonth,
  availableDays,
  selectedDay,
  focusDay,
  onFocusDay,
  onSelectDay,
  onMonthChange,
}: BookingCalendarProps) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const intl = locale === "en" ? "en-GB" : "fr-FR";
  const gridRef = useRef<HTMLTableElement>(null);
  const { offset, days } = monthDays(month);

  const monthLabel = new Intl.DateTimeFormat(intl, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${month}-01T12:00:00Z`),
  );
  const weekdayNames = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.UTC(2026, 10, 2 + i, 12)); // lundi 2 novembre 2026
    return {
      short: new Intl.DateTimeFormat(intl, { weekday: "short", timeZone: "UTC" }).format(date),
      long: new Intl.DateTimeFormat(intl, { weekday: "long", timeZone: "UTC" }).format(date),
    };
  });

  const cells: (string | null)[] = [...Array<null>(offset).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const longLabel = (day: string) =>
    new Intl.DateTimeFormat(intl, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
      new Date(`${day}T12:00:00Z`),
    );

  const focusIn = days.includes(focusDay) ? focusDay : (days[0] ?? focusDay);

  function moveFocus(next: string) {
    const nextMonth = next.slice(0, 7);
    if (nextMonth < minMonth || nextMonth > maxMonth) return;
    onFocusDay(next);
    if (nextMonth !== month) onMonthChange(nextMonth);
    requestAnimationFrame(() => {
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${next}"]`)?.focus();
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, day: string) {
    const weekday = (new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7;
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(day, -1),
      ArrowRight: () => addDays(day, 1),
      ArrowUp: () => addDays(day, -7),
      ArrowDown: () => addDays(day, 7),
      Home: () => addDays(day, -weekday),
      End: () => addDays(day, 6 - weekday),
      PageUp: () => `${addMonths(day.slice(0, 7), -1)}-01`,
      PageDown: () => `${addMonths(day.slice(0, 7), 1)}-01`,
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    moveFocus(move());
  }

  const navButton =
    "grid size-11 cursor-pointer place-items-center text-[20px] transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-25";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[22px] font-light capitalize tracking-[-0.01em]" aria-live="polite">
          {monthLabel}
        </p>
        <div className="flex">
          <button
            type="button"
            className={navButton}
            onClick={() => onMonthChange(addMonths(month, -1))}
            disabled={month <= minMonth}
            aria-label={t("previousMonth")}
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            className={navButton}
            onClick={() => onMonthChange(addMonths(month, 1))}
            disabled={month >= maxMonth}
            aria-label={t("nextMonth")}
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
      <p id="calendar-help" className="sr-only">
        {t("calendarHelp")}
      </p>
      <table ref={gridRef} role="grid" aria-label={`${t("calendarLabel")} – ${monthLabel}`} aria-describedby="calendar-help" className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {weekdayNames.map((name) => (
              <th key={name.long} scope="col" abbr={name.long} className="label-mono pb-3 text-center font-normal text-ink-muted">
                {name.short.replace(".", "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (!day) return <td key={di} role="gridcell" aria-hidden className="p-0.5" />;
                const loading = availableDays === null;
                const available = Boolean(availableDays?.has(day));
                const selected = day === selectedDay;
                const label = selected
                  ? t("daySelected", { date: longLabel(day) })
                  : available
                    ? t("dayAvailable", { date: longLabel(day) })
                    : t("dayUnavailable", { date: longLabel(day) });
                return (
                  <td key={day} role="gridcell" aria-selected={selected} className="p-0.5">
                    <button
                      type="button"
                      data-day={day}
                      tabIndex={day === focusIn ? 0 : -1}
                      aria-label={label}
                      aria-disabled={!available || undefined}
                      onKeyDown={(e) => onKeyDown(e, day)}
                      onFocus={() => onFocusDay(day)}
                      onClick={() => available && onSelectDay(day)}
                      className={cn(
                        "mx-auto grid aspect-square w-full max-w-12 place-items-center rounded-full font-mono text-[14px] transition-colors",
                        loading && "animate-pulse text-ink-muted/50",
                        !loading && !available && "cursor-default text-ink-muted/45 line-through decoration-1",
                        available && !selected && "cursor-pointer text-ink hover:bg-ink/8",
                        selected && "bg-ink text-white",
                      )}
                    >
                      {Number(day.slice(8))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
