import type { ReactNode } from "react";
import { delayStyle } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/typography";

/**
 * En-tête de page sans photo (boutique, rendez-vous, journal, pages légales).
 * Arrivée en cascade (CSS) : fil d'Ariane, repère, titre (mot par mot), puis chapô.
 */
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
        {breadcrumbs && <div className="intro-rise">{breadcrumbs}</div>}
        <div className="mt-12 md:mt-20">
          {label && (
            <div className="intro-rise" style={delayStyle(0.05)}>
              <SectionLabel className="mb-6">{label}</SectionLabel>
            </div>
          )}
          {title}
          {children && (
            <div className="intro-rise mt-6 max-w-2xl text-lead text-ink-muted" style={delayStyle(0.5)}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
