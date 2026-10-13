import type { ReactNode } from "react";
import { SectionLabel } from "@/components/ui/typography";

/** En-tête de page sans photo (boutique, rendez-vous, journal, pages légales) */
export function PageIntro({
  label,
  title,
  children,
  breadcrumbs,
}: {
  label?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  breadcrumbs?: ReactNode;
}) {
  return (
    <section className="bg-bg pt-[calc(var(--header-h)+16px)]">
      <div className="container-site pb-14 md:pb-20">
        {breadcrumbs}
        <div className="mt-12 md:mt-20">
          {label && <SectionLabel className="mb-6">{label}</SectionLabel>}
          {title}
          {children && <div className="mt-6 max-w-2xl text-lead text-ink-muted">{children}</div>}
        </div>
      </div>
    </section>
  );
}
