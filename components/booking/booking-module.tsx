"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { formatLabels, getService, services, type BookingFormat, type ServiceId } from "@/config/services";
import type { Locale } from "@/i18n/routing";
import type { BookingInput } from "@/lib/validation";
import { formatPrice } from "@/lib/utils";
import { Button, UnderlineButton } from "@/components/ui/button";
import { BookingProgress } from "./booking-progress";
import { ChoiceList } from "./choice-list";
import { StepDetails } from "./step-details";
import { StepSlot } from "./step-slot";
import { StepSummary } from "./step-summary";
import type { BookingDraft, StepId } from "./types";

function firstStep(serviceId?: ServiceId): { step: StepId; draft: BookingDraft } {
  if (!serviceId) return { step: "service", draft: {} };
  const service = getService(serviceId);
  const onlyFormat = service.formats.length === 1 ? service.formats[0] : undefined;
  return onlyFormat
    ? { step: "slot", draft: { serviceId, format: onlyFormat } }
    : { step: "format", draft: { serviceId } };
}

function apiUrl(value: unknown): string | null {
  return typeof value === "object" && value !== null && "url" in value && typeof value.url === "string" ? value.url : null;
}

function apiError(value: unknown): string | null {
  return typeof value === "object" && value !== null && "error" in value && typeof value.error === "string" ? value.error : null;
}

/**
 * Module de réservation : Prestation → Format → Date et créneau → Coordonnées → Récapitulatif.
 * Préselection possible via ?service= (prop initialService).
 */
export function BookingModule({ initialService }: { initialService?: ServiceId }) {
  const t = useTranslations("booking");
  const tc = useTranslations("common");
  const tErr = useTranslations("forms.errors");
  const locale = useLocale() as Locale;
  const initial = firstStep(initialService);
  const [step, setStep] = useState<StepId>(initial.step);
  const [draft, setDraft] = useState<BookingDraft>(initial.draft);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Déplace le focus en tête d'étape à chaque changement (lecteurs d'écran, clavier)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = headingRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    if (Math.abs(window.scrollY - top) > 200) window.scrollTo({ top, behavior: "smooth" });
  }, [step]);

  const service = draft.serviceId ? getService(draft.serviceId) : undefined;
  const reachable: StepId[] = ["service"];
  if (draft.serviceId && service && service.formats.length > 1) reachable.push("format");
  if (draft.format) reachable.push("slot");
  if (draft.start) reachable.push("details");

  function go(next: StepId) {
    setError(null);
    setStep(next);
  }

  function chooseService(serviceId: ServiceId) {
    const next = firstStep(serviceId);
    setDraft((d) => ({ ...next.draft, details: d.details }));
  }

  async function confirm() {
    if (!draft.details) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/booking/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft.details),
      });
      const data: unknown = await res.json().catch(() => null);
      const url = apiUrl(data);
      if (res.ok && url) {
        window.location.assign(url);
        return;
      }
      const code = apiError(data);
      if (res.status === 409 || code === "slot_taken") {
        setDraft((d) => ({ ...d, start: undefined }));
        setStep("slot");
        setError(t("slotTaken"));
      } else if (res.status === 429) {
        setError(tErr("rateLimit"));
      } else if (res.status === 503) {
        setError(t("unavailable"));
      } else if (res.status === 400) {
        setStep("details");
        setError(t("fieldsError"));
      } else {
        setError(tErr("generic"));
      }
    } catch {
      setError(tErr("generic"));
    }
    setPending(false);
  }

  return (
    <div>
      <BookingProgress current={step} reachable={reachable} onGo={go} />

      <div ref={headingRef} tabIndex={-1} className="outline-none" aria-live="polite">
        <p className="sr-only">
          {step === "summary"
            ? t("steps.summary")
            : t("stepLabel", {
                current: ["service", "format", "slot", "details"].indexOf(step) + 1,
                total: 4,
                name: t(`steps.${step}`),
              })}
        </p>
      </div>

      {error && step !== "summary" && (
        <div role="alert" className="mb-8 border-l-2 border-danger py-1 pl-4 text-[15px] text-danger">
          {error}
        </div>
      )}

      {step === "service" && (
        <div>
          <ChoiceList<ServiceId>
            name="service"
            legend={t("chooseService")}
            value={draft.serviceId}
            onChange={chooseService}
            choices={services.map((s) => ({
              value: s.id,
              title: s.name[locale],
              description: s.shortDescription[locale],
              badge: s.featured ? t("featured") : undefined,
              aside: (
                <span className="serif-accent text-[26px] leading-none md:text-[30px]">
                  {s.priceCents === 0 ? tc("free") : formatPrice(s.priceCents, locale)}
                </span>
              ),
            }))}
          />
          <p className="mt-5 text-[14px] text-ink-muted">{t("duration")}</p>
          <div className="mt-10">
            <Button size="lg" disabled={!draft.serviceId} onClick={() => go(service && service.formats.length === 1 ? "slot" : "format")}>
              {t("next")}
            </Button>
          </div>
        </div>
      )}

      {step === "format" && service && (
        <div>
          <ChoiceList<BookingFormat>
            name="format"
            legend={t("chooseFormat")}
            value={draft.format}
            onChange={(format) => setDraft((d) => ({ ...d, format, start: undefined }))}
            choices={service.formats.map((f) => ({
              value: f,
              title: formatLabels[f][locale],
              description: t(`formatHelp.${f}`),
            }))}
          />
          <StepNav onBack={() => go("service")} onNext={() => go("slot")} nextDisabled={!draft.format} />
        </div>
      )}

      {step === "slot" && draft.serviceId && draft.format && (
        <div>
          <StepSlot
            serviceId={draft.serviceId}
            format={draft.format}
            selected={draft.start}
            onSelect={(start) => {
              setError(null);
              setDraft((d) => ({ ...d, start }));
            }}
          />
          <StepNav
            onBack={() => go(service && service.formats.length > 1 ? "format" : "service")}
            onNext={() => go("details")}
            nextDisabled={!draft.start}
          />
        </div>
      )}

      {step === "details" && draft.serviceId && draft.format && draft.start && (
        <div>
          <StepDetails
            serviceId={draft.serviceId}
            format={draft.format}
            start={draft.start}
            initial={draft.details}
            onSubmit={(values: BookingInput) => {
              setDraft((d) => ({ ...d, details: values }));
              go("summary");
            }}
          />
          <div className="mt-6">
            <UnderlineButton arrow={false} onClick={() => go("slot")} className="text-ink-muted">
              ← {t("back")}
            </UnderlineButton>
          </div>
        </div>
      )}

      {step === "summary" && draft.details && (
        <StepSummary values={draft.details} pending={pending} error={error} onEdit={go} onConfirm={confirm} />
      )}
    </div>
  );
}

function StepNav({ onBack, onNext, nextDisabled }: { onBack: () => void; onNext: () => void; nextDisabled: boolean }) {
  const t = useTranslations("booking");
  return (
    <div className="mt-10 flex flex-wrap items-center gap-8">
      <Button size="lg" onClick={onNext} disabled={nextDisabled}>
        {t("next")}
      </Button>
      <UnderlineButton arrow={false} onClick={onBack} className="text-ink-muted">
        ← {t("back")}
      </UnderlineButton>
    </div>
  );
}
