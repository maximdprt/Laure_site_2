"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { BOOKING_WINDOW_DAYS } from "@/config/availability";
import type { BookingFormat, ServiceId } from "@/config/services";
import { cn } from "@/lib/utils";
import { UnderlineButton } from "@/components/ui/button";
import { BookingCalendar } from "./booking-calendar";
import { formatDay, formatTime, parisDayKey } from "./types";

type Availability = { status: "ok"; days: Record<string, string[]> } | { status: "error" };

function isDaysPayload(value: unknown): value is { days: Record<string, string[]> } {
  return typeof value === "object" && value !== null && "days" in value && typeof value.days === "object" && value.days !== null;
}

/** Étape 3 : calendrier mensuel + créneaux du jour (heure de Paris) */
export function StepSlot({
  serviceId,
  format,
  selected,
  onSelect,
}: {
  serviceId: ServiceId;
  format: BookingFormat;
  selected: string | undefined;
  onSelect: (iso: string) => void;
}) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const [now] = useState(() => new Date());
  const today = parisDayKey(now);
  const minMonth = today.slice(0, 7);
  const maxMonth = parisDayKey(new Date(now.getTime() + BOOKING_WINDOW_DAYS * 86_400_000)).slice(0, 7);

  const [month, setMonth] = useState(selected ? parisDayKey(new Date(selected)).slice(0, 7) : minMonth);
  const [day, setDay] = useState<string | undefined>(selected ? parisDayKey(new Date(selected)) : undefined);
  const [focusDay, setFocusDay] = useState(day ?? today);
  const [cache, setCache] = useState<Record<string, Availability>>({});

  const key = `${serviceId}|${format}|${month}`;
  const current = cache[key];

  useEffect(() => {
    if (cache[key]) return;
    const controller = new AbortController();
    fetch(`/api/availability?service=${serviceId}&format=${format}&month=${month}`, { signal: controller.signal })
      .then(async (res) => {
        const data: unknown = await res.json();
        if (!res.ok || !isDaysPayload(data)) throw new Error(String(res.status));
        setCache((c) => ({ ...c, [key]: { status: "ok", days: data.days } }));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setCache((c) => ({ ...c, [key]: { status: "error" } }));
      });
    return () => controller.abort();
  }, [cache, key, serviceId, format, month]);

  const days = current?.status === "ok" ? current.days : null;
  const availableDays = days ? new Set(Object.keys(days)) : null;
  const slots = day && days ? (days[day] ?? []) : [];
  const distanceNote = format === "distance" && (serviceId === "test" || serviceId === "pack");

  function retry() {
    setCache((c) => {
      const next = { ...c };
      delete next[key];
      return next;
    });
  }

  return (
    <div>
      <h3 className="mb-3 text-h3 font-light">{t("chooseSlot")}</h3>
      <p className="mb-10 text-[15px] text-ink-muted">
        {t("slotTimezone")}
        {distanceNote && <> {t("distanceLeadNote")}</>}
      </p>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <BookingCalendar
            month={month}
            minMonth={minMonth}
            maxMonth={maxMonth}
            availableDays={availableDays}
            selectedDay={day}
            focusDay={focusDay}
            onFocusDay={setFocusDay}
            onSelectDay={(d) => {
              setDay(d);
              setFocusDay(d);
            }}
            onMonthChange={setMonth}
          />
          {current?.status === "error" && (
            <div role="alert" className="mt-6 border-l-2 border-danger py-1 pl-4 text-[15px] text-danger">
              <p>{t("slotsError")}</p>
              <UnderlineButton onClick={retry} className="mt-2 text-ink">
                {t("retry")}
              </UnderlineButton>
            </div>
          )}
          {days && Object.keys(days).length === 0 && (
            <p className="mt-6 text-[15px] text-ink-muted" role="status">
              {t("noSlotsMonth")}
            </p>
          )}
        </div>

        <div className="lg:col-span-5" aria-live="polite">
          {!current && (
            <div className="space-y-3" aria-busy="true">
              <p className="sr-only">{t("loadingSlots")}</p>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="skeleton h-12 w-full" />
              ))}
            </div>
          )}
          {current && !day && days && <p className="text-ink-muted">{t("pickDay")}</p>}
          {day && days && (
            <fieldset>
              <legend className="label-mono mb-5 text-ink-muted">
                {t("slotsFor", { date: formatDay(`${day}T12:00:00Z`, locale) })}
              </legend>
              {slots.length === 0 ? (
                <p className="text-ink-muted">{t("noSlotsDay")}</p>
              ) : (
                <ul key={day} className="step-in grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
                  {slots.map((iso) => {
                    const checked = iso === selected;
                    const id = `slot-${iso}`;
                    return (
                      <li key={iso}>
                        <input
                          id={id}
                          type="radio"
                          name="slot"
                          value={iso}
                          checked={checked}
                          onChange={() => onSelect(iso)}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={id}
                          className={cn(
                            "flex min-h-12 cursor-pointer items-center justify-center rounded-full border font-mono text-[14px] transition-[background-color,border-color,color,scale] duration-300 ease-soft active:scale-95",
                            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink",
                            checked ? "border-ink bg-ink text-white" : "border-line hover:border-ink",
                          )}
                        >
                          {formatTime(iso)}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </fieldset>
          )}
        </div>
      </div>
    </div>
  );
}
