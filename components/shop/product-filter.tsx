"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

type FilterItem = { key: string; theme: string; node: ReactNode };

/** Filtres simples par thème (les fiches sont rendues côté serveur et passées en props) */
export function ProductFilter({
  themes,
  items,
}: {
  themes: { value: string; label: string }[];
  items: FilterItem[];
}) {
  const t = useTranslations("shop");
  const [active, setActive] = useState<string>("all");
  const visible = active === "all" ? items : items.filter((item) => item.theme === active);
  const options = [{ value: "all", label: t("filterAll") }, ...themes];

  return (
    <div>
      <div role="group" aria-label={t("filterLabel")} className="mb-10 flex flex-wrap gap-x-7 gap-y-2 border-b border-line pb-4">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={active === option.value}
            onClick={() => setActive(option.value)}
            className={cn(
              "link-underline cursor-pointer text-[15px] text-ink-muted transition-colors hover:text-ink",
              "after:scale-x-0 aria-pressed:text-ink aria-pressed:after:scale-x-100",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {t("productCount", { count: visible.length })}
      </p>
      <ul className="grid grid-cols-2 gap-x-1 gap-y-12 md:gap-x-6 lg:grid-cols-4">
        {visible.map((item, i) => (
          <Reveal as="li" key={item.key} index={i % 4}>
            {item.node}
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
