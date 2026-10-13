import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Repère de section en Geist Mono : « (01) La méthode » */
export function SectionLabel({
  number,
  children,
  className,
  tone = "muted",
}: {
  number?: string;
  children: ReactNode;
  className?: string;
  tone?: "muted" | "light";
}) {
  return (
    <p className={cn("label-mono", tone === "light" ? "text-white/85" : "text-ink-muted", className)}>
      {number && <span>({number}) </span>}
      {children}
    </p>
  );
}

/** Label mono simple (catégories, mentions « Le plus choisi »…) */
export function MonoLabel({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("label-mono text-ink-muted", className)} {...props} />;
}

type SplitTitleProps = {
  /** Partie en sans-serif fine */
  lead: ReactNode;
  /** Partie en serif italique */
  accent?: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  size?: "h1" | "h2" | "h3";
  /** Met l'accent à la ligne */
  breakBefore?: boolean;
  className?: string;
  id?: string;
};

/** Titre alterné : sans-serif très fine + mot ou fin de phrase en serif italique */
export function SplitTitle({ lead, accent, as: Tag = "h2", size, breakBefore, className, id }: SplitTitleProps) {
  const s = size ?? (Tag === "p" ? "h2" : Tag);
  const sizeClass = { h1: "text-h1 leading-[0.98] tracking-[-0.035em]", h2: "text-h2 leading-[1] tracking-[-0.03em]", h3: "text-h3 leading-[1.15] tracking-[-0.02em]" }[s];
  return (
    <Tag id={id} className={cn("font-light", sizeClass, className)}>
      {lead}
      {accent && (
        <>
          {breakBefore ? <br /> : " "}
          <span className="serif-accent">{accent}</span>
        </>
      )}
    </Tag>
  );
}

/** Prix en Instrument Serif italique */
export function Price({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("serif-accent text-[28px] leading-none md:text-[32px]", className)}>{children}</span>;
}

/**
 * Texte de contenu avec mise en forme minimale :
 * **gras** (rendu en poids 500) et *italique* (rendu en serif italique).
 * Les paragraphes sont séparés par une ligne vide.
 */
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="serif-accent text-[1.12em]">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function Inline({ text }: { text: string }) {
  return <>{renderInline(text)}</>;
}

export function RichText({ text, className }: { text: string | string[]; className?: string }) {
  const paragraphs = Array.isArray(text) ? text : text.split(/\n{2,}/);
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? "mt-5" : undefined}>
          {renderInline(p)}
        </p>
      ))}
    </div>
  );
}
