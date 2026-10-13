"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  formatLabels,
  FREE_CANCELLATION_HOURS,
  getService,
  needsPostalAddress,
  onlineAmountCents,
  PAYMENT_MODE,
} from "@/config/services";
import type { Locale } from "@/i18n/routing";
import type { BookingInput } from "@/lib/validation";
import { formatPrice } from "@/lib/utils";
import { Button, UnderlineButton } from "@/components/ui/button";
import { FormStatus } from "@/components/ui/form";
import type { StepId } from "./types";
import { formatDay, formatTime } from "./types";

function Row({ label, children, onEdit, editLabel }: { label: string; children: ReactNode; onEdit?: () => void; editLabel: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-line py-5">
      <div className="min-w-0">
        <dt className="label-mono text-ink-muted">{label}</dt>
        <dd className="mt-1.5 break-words">{children}</dd>
      </div>
      {onEdit && (
        <UnderlineButton onClick={onEdit} arrow={false} className="shrink-0 text-[13px] text-ink-muted" aria-label={`${editLabel} – ${label}`}>
          {editLabel}
        </UnderlineButton>
      )}
    </div>
  );
}

/** Étape finale : récapitulatif sur fond papier + confirmation / paiement */
export function StepSummary({
  values,
  pending,
  error,
  onEdit,
  onConfirm,
}: {
  values: BookingInput;
  pending: boolean;
  error: string | null;
  onEdit: (step: StepId) => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("booking");
  const locale = useLocale() as Locale;
  const service = getService(values.serviceId);
  const today = onlineAmountCents(service);
  const balance = service.priceCents - today;
  const withAddress = needsPostalAddress(values.serviceId, values.format);
  const edit = t("change");

  return (
    <div>
      <h3 className="mb-8 text-h3 font-light">{t("summaryTitle")}</h3>
      <div className="bg-paper px-6 py-4 md:px-10 md:py-6">
        <dl className="[&>div:last-child]:border-b-0">
          <Row label={t("summaryService")} onEdit={() => onEdit("service")} editLabel={edit}>
            {service.name[locale]}
          </Row>
          <Row label={t("summaryFormat")} onEdit={service.formats.length > 1 ? () => onEdit("format") : undefined} editLabel={edit}>
            {formatLabels[values.format][locale]}
          </Row>
          <Row label={t("summaryDate")} onEdit={() => onEdit("slot")} editLabel={edit}>
            <span className="first-letter:uppercase">{formatDay(values.start, locale, true)}</span> · {formatTime(values.start)}
          </Row>
          <Row label={t("summaryContact")} onEdit={() => onEdit("details")} editLabel={edit}>
            {values.firstName} {values.lastName}
            <br />
            <span className="text-ink-muted">
              {values.email} · {values.phone}
            </span>
          </Row>
          {withAddress && (
            <Row label={t("summaryAddress")} editLabel={edit}>
              {values.addressLine}, {values.postalCode} {values.city}
            </Row>
          )}
          {values.message && (
            <Row label={t("summaryMessage")} editLabel={edit}>
              <span className="whitespace-pre-line text-ink-muted">{values.message}</span>
            </Row>
          )}
          <Row label={t("summaryPrice")} editLabel={edit}>
            <span className="serif-accent text-[26px]">
              {service.priceCents === 0 ? t("summaryFree") : formatPrice(service.priceCents, locale)}
            </span>
          </Row>
          {service.requiresPayment && (
            <Row label={t("summaryToday")} editLabel={edit}>
              <span className="serif-accent text-[26px]">{formatPrice(today, locale)}</span>
              {PAYMENT_MODE === "deposit" && balance > 0 && (
                <span className="mt-1 block text-[14px] text-ink-muted">
                  {t("summaryBalance")} · {formatPrice(balance, locale)}
                </span>
              )}
            </Row>
          )}
        </dl>
      </div>

      <p className="mt-6 max-w-2xl text-[14px] text-ink-muted">
        {service.requiresPayment
          ? `${PAYMENT_MODE === "deposit" ? t("depositInfo", { deposit: formatPrice(today, locale) }) : t("fullInfo")} ${t("cancellation", { hours: FREE_CANCELLATION_HOURS })}`
          : t("noPaymentInfo")}
      </p>

      {error && (
        <div className="mt-6">
          <FormStatus tone="error">{error}</FormStatus>
        </div>
      )}

      <div className="mt-10">
        <Button size="lg" onClick={onConfirm} disabled={pending} aria-busy={pending || undefined}>
          {pending
            ? t("submitting")
            : !service.requiresPayment
              ? t("confirmFree")
              : PAYMENT_MODE === "deposit"
                ? t("confirmPay")
                : t("confirmPayFull")}
        </Button>
      </div>
    </div>
  );
}
