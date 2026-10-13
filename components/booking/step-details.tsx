"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { needsPostalAddress, type BookingFormat, type ServiceId } from "@/config/services";
import { Link } from "@/i18n/navigation";
import { bookingSchema, MESSAGE_MAX, type BookingInput } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, FormStatus, Honeypot, Input, Textarea, useErrorMessage } from "@/components/ui/form";

/** Étape 4 : coordonnées, adresse postale (test / pack à distance), CGV et consentement */
export function StepDetails({
  serviceId,
  format,
  start,
  initial,
  onSubmit,
}: {
  serviceId: ServiceId;
  format: BookingFormat;
  start: string;
  initial?: BookingInput;
  onSubmit: (values: BookingInput) => void;
}) {
  const t = useTranslations("booking");
  const tf = useTranslations("forms");
  const locale = useLocale();
  const errorMessage = useErrorMessage();
  const withAddress = needsPostalAddress(serviceId, format);

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressLine: "",
      postalCode: "",
      city: "",
      message: "",
      terms: false,
      consent: false,
      website: "",
      ...initial,
      serviceId,
      format,
      start,
      locale,
    },
  });
  const { errors, isSubmitted, isValid } = form.formState;
  const message = useWatch({ control: form.control, name: "message" }) ?? "";

  const text = (
    name: "firstName" | "lastName" | "email" | "phone" | "addressLine" | "postalCode" | "city",
    label: string,
    props: { autoComplete: string; type?: string; inputMode?: "email" | "tel" | "numeric" },
    className?: string,
  ) => (
    <Field label={label} error={errorMessage(errors[name]?.message)} className={className}>
      {({ id, describedBy, invalid }) => (
        <Input
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-required
          {...props}
          {...form.register(name)}
        />
      )}
    </Field>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="relative">
      <h3 className="mb-10 text-h3 font-light">{t("steps.details")}</h3>
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        {text("firstName", t("firstName"), { autoComplete: "given-name" })}
        {text("lastName", t("lastName"), { autoComplete: "family-name" })}
        {text("email", t("email"), { autoComplete: "email", type: "email", inputMode: "email" })}
        {text("phone", t("phone"), { autoComplete: "tel", type: "tel", inputMode: "tel" })}

        {withAddress && (
          <fieldset className="md:col-span-2">
            <legend className="text-[15px]">{t("address")}</legend>
            <p className="mb-6 mt-1 text-[13px] text-ink-muted">{t("addressHelp")}</p>
            <div className="grid gap-x-10 gap-y-8 md:grid-cols-6">
              {text("addressLine", t("addressLine"), { autoComplete: "street-address" }, "md:col-span-6")}
              {text("postalCode", t("postalCode"), { autoComplete: "postal-code", inputMode: "numeric" }, "md:col-span-2")}
              {text("city", t("city"), { autoComplete: "address-level2" }, "md:col-span-4")}
            </div>
          </fieldset>
        )}

        <Field
          label={t("message")}
          optional
          help={`${t("messageHelp")} ${message.length}/${MESSAGE_MAX}`}
          error={errorMessage(errors.message?.message, { max: MESSAGE_MAX })}
          className="md:col-span-2"
        >
          {({ id, describedBy, invalid }) => (
            <Textarea
              id={id}
              maxLength={MESSAGE_MAX}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              {...form.register("message")}
            />
          )}
        </Field>

        <div className="flex flex-col gap-4 md:col-span-2">
          <Checkbox
            label={t.rich("terms", {
              link: (chunks) => (
                <Link href="/cgv" target="_blank">
                  {chunks}
                </Link>
              ),
            })}
            error={errorMessage(errors.terms?.message)}
            {...form.register("terms")}
          />
          <Checkbox
            label={tf.rich("privacyConsent", {
              link: (chunks) => (
                <Link href="/confidentialite" target="_blank">
                  {chunks}
                </Link>
              ),
            })}
            error={errorMessage(errors.consent?.message)}
            {...form.register("consent")}
          />
        </div>
      </div>
      <Honeypot {...form.register("website")} />

      {isSubmitted && !isValid && (
        <div className="mt-8">
          <FormStatus tone="error">{t("fieldsError")}</FormStatus>
        </div>
      )}
      <div className="mt-10">
        <Button type="submit" size="lg">
          {t("next")}
        </Button>
      </div>
    </form>
  );
}
