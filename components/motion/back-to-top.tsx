"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { scrollToTop } from "./smooth-scroll";

/** Lien « Haut de page ↑ » du footer : remonte en douceur et rend le focus au contenu */
export function BackToTop({ className }: { className?: string }) {
  const t = useTranslations("common");
  return (
    <button
      type="button"
      onClick={() => {
        scrollToTop();
        document.getElementById("contenu")?.focus({ preventScroll: true });
      }}
      className={cn("group link-underline link-sweep cursor-pointer text-[15px] text-white", className)}
    >
      {t("backToTop")}
      <span aria-hidden className="inline-block transition-[translate] duration-500 ease-soft group-hover:-translate-y-1">
        ↑
      </span>
    </button>
  );
}
