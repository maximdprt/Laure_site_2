"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "@/i18n/navigation";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation";
import { UnderlineButton } from "@/components/ui/button";
import { Checkbox, Field, FormStatus, Honeypot, Input, useErrorMessage } from "@/components/ui/form";

/** Inscription à la lettre NLIGHT : e-mail (+ prénom facultatif) + consentement explicite */
export function NewsletterForm({ tone = "light", withFirstName = false }: { tone?: "light" | "dark"; withFirstName?: boolean }) {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const errorMessage = useErrorMessage();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const dark = tone === "dark";

  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", firstName: "", consent: false, website: "", locale },
  });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset({ email: "", firstName: "", consent: false, website: "", locale });
    } catch {
      setStatus("error");
    }
  });

  if (status === "success") {
    return (
      <FormStatus tone="success" dark={dark}>
        {t("success")}
      </FormStatus>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-5">
      {withFirstName && (
        <Field label={t("firstName")} optional tone={tone}>
          {({ id }) => <Input id={id} tone={tone} autoComplete="given-name" {...form.register("firstName")} />}
        </Field>
      )}
      <Field label={t("email")} error={errorMessage(errors.email?.message)} tone={tone}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            tone={tone}
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            {...form.register("email")}
          />
        )}
      </Field>
      <Checkbox
        tone={tone}
        label={t.rich("consent", { link: (chunks) => <Link href="/confidentialite">{chunks}</Link> })}
        error={errorMessage(errors.consent?.message)}
        {...form.register("consent")}
      />
      <Honeypot {...form.register("website")} />
      {status === "error" && (
        <FormStatus tone="error" dark={dark}>
          {t("error")}
        </FormStatus>
      )}
      <div>
        <UnderlineButton type="submit" disabled={isSubmitting} className={dark ? "text-white" : "text-ink"}>
          {isSubmitting ? t("submitting") : t("submit")}
        </UnderlineButton>
      </div>
    </form>
  );
}
