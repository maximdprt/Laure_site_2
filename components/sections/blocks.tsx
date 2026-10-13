import type { ReactNode } from "react";
import type { Titled } from "@/content/types";
import type { ImageKey, ImageRatio } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { FullBleedImage } from "@/components/ui/full-bleed-image";
import { Reveal } from "@/components/ui/reveal";
import { RuleItem, RuleList } from "@/components/ui/rule-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { Inline, MonoLabel, RichText, SectionLabel, SplitTitle } from "@/components/ui/typography";

/** Titre alterné à partir d'un objet { lead, accent } */
export function TitledHeading({
  title,
  as = "h2",
  size,
  id,
  breakBefore,
}: {
  title: Titled;
  as?: "h1" | "h2" | "h3";
  size?: "h1" | "h2" | "h3";
  id?: string;
  breakBefore?: boolean;
}) {
  return <SplitTitle as={as} size={size} id={id} lead={title.lead} accent={title.accent} breakBefore={breakBefore} />;
}

/** Section texte : repère (0X) + titre, puis texte dans la colonne de droite */
export function TextSection({
  number,
  label,
  title,
  text,
  children,
  tone,
  id,
}: {
  number?: string;
  label?: string;
  title: Titled;
  text?: string;
  children?: ReactNode;
  tone?: "bg" | "paper";
  id: string;
}) {
  return (
    <Section tone={tone} aria-labelledby={id}>
      <SectionHeader number={number} label={label} title={<TitledHeading title={title} id={id} />} />
      <Reveal className="lg:ml-[25%]">
        {text && <RichText text={text} className="prose-site text-[18px] leading-[1.7]" />}
        {children}
      </Reveal>
    </Section>
  );
}

/** Image demi-écran bord à bord + contenu sur l'autre moitié */
export function SplitSection({
  locale,
  image,
  ratio = "4/5",
  imageSide = "left",
  number,
  label,
  title,
  children,
  id,
}: {
  locale: Locale;
  image: ImageKey;
  ratio?: ImageRatio;
  imageSide?: "left" | "right";
  number?: string;
  label?: string;
  title: Titled;
  children: ReactNode;
  id: string;
}) {
  return (
    <section aria-labelledby={id} className="grid lg:grid-cols-2">
      <FullBleedImage
        imageKey={image}
        locale={locale}
        sizes="(min-width: 1024px) 50vw, 100vw"
        ratio={ratio}
        className={imageSide === "right" ? "lg:order-2" : undefined}
      />
      <div
        className={cn(
          "flex flex-col justify-center px-[var(--gutter)] py-20 md:py-28 lg:px-16 xl:px-24",
          imageSide === "right" && "lg:order-1",
        )}
      >
        {label && (
          <Reveal>
            <SectionLabel number={number} className="mb-8">
              {label}
            </SectionLabel>
          </Reveal>
        )}
        <TitledHeading title={title} id={id} breakBefore />
        <Reveal className="mt-10" delay={0.2}>
          {children}
        </Reveal>
      </div>
    </section>
  );
}

/** Étapes numérotées en liste à filets */
export function StepsList({ steps, className }: { steps: { title: string; text: string }[]; className?: string }) {
  return (
    <RuleList className={className}>
      {steps.map((step, i) => (
        <RuleItem key={step.title} className="grid grid-cols-[3rem_1fr] gap-4">
          <MonoLabel className="pt-1.5">{String(i + 1).padStart(2, "0")}</MonoLabel>
          <div>
            <h3 className="text-[20px] font-normal tracking-[-0.01em]">{step.title}</h3>
            <p className="mt-2 text-ink-muted">
              <Inline text={step.text} />
            </p>
          </div>
        </RuleItem>
      ))}
    </RuleList>
  );
}

/** Liste à filets en 2 colonnes (thèmes, situations) */
export function TwoColumnRuleList({ items }: { items: string[] }) {
  return (
    <ul data-reveal="rules" className="rule-line grid md:grid-cols-2 md:gap-x-10">
      {items.map((item, i) => (
        <li key={item} className="flex items-baseline gap-5 border-b border-line py-5">
          <MonoLabel>{String(i + 1).padStart(2, "0")}</MonoLabel>
          <span className="serif-accent text-[24px] leading-tight md:text-[26px]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Citation / phrase mise en avant */
export function Highlight({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn("text-[clamp(26px,2.8vw,40px)] font-light leading-[1.2] tracking-[-0.02em]", className)}>
      <Inline text={text} />
    </p>
  );
}
