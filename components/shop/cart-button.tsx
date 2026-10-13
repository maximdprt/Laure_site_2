"use client";

import { useTranslations } from "next-intl";
import { cartCount, useCart } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";

/** « Panier (n) » en texte */
export function CartButton() {
  const t = useTranslations("cart");
  const lines = useCart((s) => s.lines);
  const open = useCart((s) => s.open);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(lines) : 0;

  return (
    <button
      type="button"
      onClick={open}
      className="link-underline cursor-pointer text-[14px] after:scale-x-0 hover:after:scale-x-100"
      aria-label={`${t("open")} – ${t("count", { count })}`}
    >
      {t("label")} ({count})
    </button>
  );
}
