"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "@/i18n/navigation";
import { contactSchema, contactSubjects, type ContactInput } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, FormStatus, Honeypot, Input, Select, Textarea, useErrorMessage } from "@/components/ui/form";

/** Formulaire de contact : nom, e-mail, téléphone (facultatif), sujet, message, consentement, champ piège */
export function ContactForm() {
  const t = useTranslations("contact");
  const tf = useTranslations("forms");
  const locale = useLocale();
  const errorMessage = useErrorMessage();
  const [status, setStatus] = useState<"idle" | "success" | "error" | "rateLimit">("idle");

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "question",
      message: "",
      consent: false,
      website: "",
      locale,
    },
  });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 429) {
        setStatus("rateLimit");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  });

  if (status === "success") return <FormStatus tone="success">{t("success")}</FormStatus>;

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-x-10 gap-y-8 md:grid-cols-2">
      <Field label={t("name")} error={errorMessage(errors.name?.message)}>
        {({ id, describedBy, invalid }) => (
          <Input id={id} autoComplete="name" aria-required aria-invalid={invalid || undefined} aria-describedby={describedBy} {...form.register("name")} />
        )}
      </Field>
      <Field label={t("email")} error={errorMessage(errors.email?.message)}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-required
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            {...form.register("email")}
          />
        )}
      </Field>
      <Field label={t("phone")} optional error={errorMessage(errors.phone?.message)}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            {...form.register("phone")}
          />
        )}
      </Field>
      <Field label={t("subject")} error={errorMessage(errors.subject?.message)}>
        {({ id, describedBy }) => (
          <Select id={id} aria-describedby={describedBy} {...form.register("subject")}>
            {contactSubjects.map((s) => (
              <option key={s} value={s}>
                {t(`subjects.${s}`)}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label={t("message")} error={errorMessage(errors.message?.message, { max: 3000 })} className="md:col-span-2">
        {({ id, describedBy, invalid }) => (
          <Textarea id={id} aria-required aria-invalid={invalid || undefined} aria-describedby={describedBy} {...form.register("message")} />
        )}
      </Field>
      <Checkbox
        className="md:col-span-2"
        label={tf.rich("privacyConsent", { link: (chunks) => <Link href="/confidentialite">{chunks}</Link> })}
        error={errorMessage(errors.consent?.message)}
        {...form.register("consent")}
      />
      <Honeypot {...form.register("website")} />
      {(status === "error" || status === "rateLimit") && (
        <div className="md:col-span-2">
          <FormStatus tone="error">{status === "rateLimit" ? tf("errors.rateLimit") : tf("errors.generic")}</FormStatus>
        </div>
      )}
      <div className="md:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
