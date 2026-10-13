"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { StepId } from "./types";

const VISIBLE: StepId[] = ["service", "format", "slot", "details"];

/** Étapes 1 à 4 + barre de progression. Les étapes déjà franchies sont cliquables. */
export function BookingProgress({
  current,
  reachable,
  onGo,
}: {
  current: StepId;
  /** Étapes déjà franchies, sur lesquelles on peut revenir */
  reachable: StepId[];
  onGo: (step: StepId) => void;
}) {
  const t = useTranslations("booking");
  const index = current === "summary" ? VISIBLE.length : VISIBLE.indexOf(current);
  const percent = Math.round(((current === "summary" ? index : index + 0.5) / VISIBLE.length) * 100);

  return (
    <div className="mb-12 md:mb-16">
      <nav aria-label={t("stepsNav")}>
        <ol className="grid grid-cols-4 gap-3">
          {VISIBLE.map((step, i) => {
            const isCurrent = step === current;
            const done = i < index;
            const canGo = done && reachable.includes(step);
            const label = (
              <>
                <span className="label-mono block text-ink-muted">0{i + 1}</span>
                <span className={cn("sr-only mt-1 text-[14px] sm:not-sr-only sm:block", isCurrent ? "text-ink" : "text-ink-muted")}>
                  {t(`steps.${step}`)}
                </span>
                {done && <span className="sr-only"> – {t("stepDone")}</span>}
              </>
            );
            return (
              <li key={step} aria-current={isCurrent ? "step" : undefined}>
                {canGo ? (
                  <button type="button" onClick={() => onGo(step)} className="cursor-pointer text-left hover:underline">
                    {label}
                  </button>
                ) : (
                  <span className="block">
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div
        role="progressbar"
        aria-label={t("progressLabel")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-4 h-px w-full bg-line"
      >
        <div className="h-px bg-ink transition-[width] duration-700 ease-soft" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
