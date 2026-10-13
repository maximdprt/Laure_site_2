"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Accordéon à filets (FAQ) — commence par un filet encre, tracé à l'apparition */
export function Accordion({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-reveal="rules" className={cn("rule-line", className)} {...props} />;
}

export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-line", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  children,
  headingLevel = 3,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger> & { headingLevel?: 2 | 3 | 4 }) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="text-[19px] font-normal leading-snug tracking-[-0.01em] md:text-[22px]">
        <AccordionPrimitive.Trigger
          className={cn(
            "group flex min-h-16 w-full cursor-pointer items-center justify-between gap-8 py-6 text-left transition-[padding] duration-500 ease-soft hover:pl-1.5",
            className,
          )}
          {...props}
        >
          <span>{children}</span>
          <span
            aria-hidden
            className="relative size-4 shrink-0 transition-transform duration-500 ease-soft group-data-[state=open]:rotate-45"
          >
            <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
            <span className="absolute left-1/2 top-0 h-4 w-px bg-current" />
          </span>
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-[accordion-up_0.3s_ease-out] data-[state=open]:animate-[accordion-down_0.45s_var(--ease-soft)]"
      {...props}
    >
      <div className={cn("accordion-inner prose-site pb-7 pr-10 text-ink-muted", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
