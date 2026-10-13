import { useTranslations } from "next-intl";
import { Children, isValidElement, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

/** Texte brut d'un nœud React (pour générer les ancres des intertitres) */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** Doit rester identique à slugify() de lib/blog.ts */
function anchor(children: ReactNode): string {
  return textOf(Children.toArray(children))
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Encadré d'appel à l'action vers le Test de Profil Chromatique (à placer en fin d'article) */
export function CtaTest() {
  const t = useTranslations("journal");
  return (
    <aside className="not-prose mt-16 border-y border-ink py-10">
      <p className="text-[clamp(26px,2.6vw,36px)] font-light leading-[1.1] tracking-[-0.02em]">{t("ctaTitle")}</p>
      <p className="mt-4 text-ink-muted">{t("ctaText")}</p>
      <div className="mt-8">
        <ButtonLink href="/test-profil-chromatique">{t("ctaButton")}</ButtonLink>
      </div>
    </aside>
  );
}

export const mdxComponents = {
  h2: ({ children, className, ...props }: ComponentProps<"h2">) => (
    <h2
      id={anchor(children)}
      className={cn(
        "mt-16 scroll-mt-28 border-t border-line pt-10 text-[clamp(30px,3vw,42px)] font-light leading-[1.08] tracking-[-0.025em]",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: ComponentProps<"h3">) => (
    <h3
      id={anchor(children)}
      className={cn("mt-10 scroll-mt-28 text-[22px] font-normal leading-snug tracking-[-0.015em]", className)}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ className, ...props }: ComponentProps<"p">) => (
    <p className={cn("mt-5 text-[17px] leading-[1.75] text-ink", className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentProps<"ul">) => (
    <ul className={cn("mt-6 border-t border-ink [&>li]:border-b [&>li]:border-line [&>li]:py-3", className)} {...props} />
  ),
  ol: ({ className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={cn(
        "mt-6 list-none border-t border-ink [counter-reset:item] [&>li]:border-b [&>li]:border-line [&>li]:py-3 [&>li]:before:mr-3 [&>li]:before:font-mono [&>li]:before:text-[12px] [&>li]:before:text-ink-muted [&>li]:before:content-['('counter(item,decimal-leading-zero)')'] [&>li]:[counter-increment:item]",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentProps<"li">) => (
    <li className={cn("text-[17px] leading-[1.65]", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "my-12 font-serif text-[clamp(26px,2.6vw,34px)] italic leading-[1.2] text-ink [&>p]:mt-0 [&>p]:text-[inherit] [&>p]:leading-[inherit]",
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }: ComponentProps<"strong">) => (
    <strong className={cn("font-medium", className)} {...props} />
  ),
  em: ({ className, ...props }: ComponentProps<"em">) => (
    <em className={cn("serif-accent text-[1.1em]", className)} {...props} />
  ),
  a: ({ className, ...props }: ComponentProps<"a">) => (
    <a className={cn("underline decoration-1 underline-offset-4 hover:decoration-2", className)} {...props} />
  ),
  hr: () => <hr className="my-12 border-line" />,
  CtaTest,
};
