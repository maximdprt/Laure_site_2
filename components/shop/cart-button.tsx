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
      {/* .link-underline est en inline-flex (avec gap) : le libellé et le compteur forment un seul bloc */}
      <span>
        {t("label")} (
        <span className="inline-block overflow-hidden align-bottom">
          <span key={count} className={hydrated && count > 0 ? "count-roll" : undefined}>
            {count}
          </span>
        </span>
        )
      </span>
    </button>
  );
}
