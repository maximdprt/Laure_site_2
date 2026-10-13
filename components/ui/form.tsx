"use client";

import { useTranslations } from "next-intl";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Saisie sans bordure, filet en dessous */
const controlBase = cn(
  "w-full rounded-none border-0 border-b border-line bg-transparent px-0 text-[18px] text-ink placeholder:text-ink-muted/70",
  "focus-visible:outline-none aria-[invalid=true]:border-danger",
);

/** Focus : un filet de 2 px se trace de gauche à droite (.field-draw, couleur du texte) */
const drawnFocus = "field-draw";

/** Focus sans tracé (select : son arrière-plan porte déjà le chevron) */
const plainFocus =
  "transition-[border-color,box-shadow] duration-200 focus-visible:border-ink focus-visible:shadow-[0_1px_0_0_var(--color-ink)]";

const darkControl = "border-white/30 text-white placeholder:text-white/50";

/** Traduit une clé d'erreur zod (forms.errors.*) */
export function useErrorMessage() {
  const t = useTranslations("forms.errors");
  return (key: string | undefined, values?: { max?: number }) => {
    if (!key) return undefined;
    if (key === "tooLong") return t("tooLong", { max: values?.max ?? 500 });
    const known = ["required", "email", "phone", "consent", "terms", "tooShort", "generic", "rateLimit"] as const;
    return (known as readonly string[]).includes(key) ? t(key as (typeof known)[number]) : t("generic");
  };
}

type FieldProps = {
  label: ReactNode;
  error?: string;
  help?: ReactNode;
  optional?: boolean;
  tone?: "light" | "dark";
  className?: string;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
};

/** Un champ = un label de 13 px + une saisie à filet */
export function Field({ label, error, help, optional, tone = "light", className, children }: FieldProps) {
  const t = useTranslations("common");
  const id = useId();
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;
  const muted = tone === "dark" ? "text-on-dark" : "text-ink-muted";
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-[13px]", muted)}>
        {label}
        {optional && <span className="ml-1">({t("optional")})</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {help && (
        <p id={helpId} className={cn("text-[13px]", muted)}>
          {help}
        </p>
      )}
      {error && (
        <p id={errorId} className={cn("text-[13px]", tone === "dark" ? "text-[#f0a89c]" : "text-danger")} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, tone = "light", ...props }: ComponentProps<"input"> & { tone?: "light" | "dark" }) {
  return <input className={cn(controlBase, drawnFocus, "min-h-11 py-2", tone === "dark" && darkControl, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlBase, drawnFocus, "min-h-32 resize-y py-2 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        controlBase,
        plainFocus,
        "min-h-11 cursor-pointer appearance-none bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%23111111' stroke-width='1.2'><path d='M3 5l4 4 4-4'/></svg>\")] bg-[length:14px] bg-[right_0_center] bg-no-repeat py-2 pr-8",
        className,
      )}
      {...props}
    />
  );
}

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: ReactNode;
  error?: string;
  tone?: "light" | "dark";
};

export function Checkbox({ label, error, className, tone = "light", id: idProp, ...props }: CheckboxProps) {
  const generated = useId();
  const id = idProp ?? generated;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={errorId}
          className={cn(
            "mt-[3px] size-[18px] shrink-0 cursor-pointer",
            tone === "dark" ? "accent-white" : "accent-[var(--color-ink)]",
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "cursor-pointer text-[13px] leading-relaxed [&_a]:underline [&_a]:underline-offset-2",
            tone === "dark" ? "text-on-dark [&_a]:text-white" : "text-ink-muted [&_a]:text-ink",
          )}
        >
          {label}
        </label>
      </div>
      {error && (
        <p
          id={errorId}
          className={cn("pl-[30px] text-[13px]", tone === "dark" ? "text-[#f0a89c]" : "text-danger")}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** Champ piège anti-spam, invisible pour les humains */
export function Honeypot(props: ComponentProps<"input">) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}

export function FormStatus({
  tone,
  children,
  dark,
}: {
  tone: "success" | "error";
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "border-l-2 py-1 pl-4 text-[15px]",
        tone === "success"
          ? dark
            ? "border-white text-white"
            : "border-ink text-ink"
          : dark
            ? "border-[#f0a89c] text-[#f0a89c]"
            : "border-danger text-danger",
      )}
    >
      {children}
    </div>
  );
}
