import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Boutons en pilule.
 * - primary : noir sur fond clair
 * - light : blanc sur photo
 * - outline : contour 1 px (header)
 * - outline-light : contour blanc (header transparent sur photo)
 */
export const buttonVariants = cva(
  [
    "inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-7 text-[15px] font-normal tracking-[-0.005em]",
    "transition-[background-color,color,border-color,opacity] duration-300 ease-soft",
    "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        primary: "bg-ink text-white hover:bg-[#2b2b2b]",
        light: "bg-white text-ink hover:bg-white/85",
        outline: "border border-ink text-ink hover:bg-ink hover:text-white",
        "outline-light": "border border-white/80 text-white hover:bg-white hover:text-ink",
      },
      size: {
        default: "",
        sm: "min-h-11 px-5 text-sm",
        lg: "min-h-14 px-9 text-base",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "default", fullWidth: false },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export type ButtonProps = ComponentProps<"button"> & Variants;

export function Button({ className, variant, size, fullWidth, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...props} />;
}

export type ButtonLinkProps = ComponentProps<typeof Link> & Variants & { children: ReactNode };

/** Lien interne (localisé) en forme de bouton pilule */
export function ButtonLink({ className, variant, size, fullWidth, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...props} />;
}

/** Bouton secondaire : texte souligné d'un filet d'1 px, flèche optionnelle */
export function LinkUnderline({
  className,
  children,
  arrow = true,
  ...props
}: ComponentProps<typeof Link> & { arrow?: boolean; children: ReactNode }) {
  return (
    <Link className={cn("link-underline text-[15px]", className)} {...props}>
      {children}
      {arrow && <span aria-hidden>→</span>}
    </Link>
  );
}

/** Variante <button> du lien souligné */
export function UnderlineButton({
  className,
  children,
  arrow = true,
  type = "button",
  ...props
}: ComponentProps<"button"> & { arrow?: boolean }) {
  return (
    <button type={type} className={cn("link-underline cursor-pointer text-[15px] disabled:opacity-40", className)} {...props}>
      {children}
      {arrow && <span aria-hidden>→</span>}
    </button>
  );
}
