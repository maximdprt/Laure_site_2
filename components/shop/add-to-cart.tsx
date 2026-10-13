"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { MAX_QUANTITY, useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { Button, UnderlineButton } from "@/components/ui/button";

type AddToCartProps = {
  slug: string;
  inStock: boolean;
  /** "link" = lien souligné (grilles) ; "full" = sélecteur de quantité + bouton (fiche produit) */
  variant?: "link" | "full";
  label?: string;
  className?: string;
};

export function AddToCart({ slug, inStock, variant = "link", label, className }: AddToCartProps) {
  const t = useTranslations();
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(1);

  if (!inStock) {
    return (
      <p className={cn("label-mono text-ink-muted", className)} aria-disabled>
        {t("shop.comingSoon")}
      </p>
    );
  }

  if (variant === "link") {
    return (
      <UnderlineButton className={cn("text-[14px]", className)} arrow={false} onClick={() => add(slug, 1)}>
        {label ?? t("shop.addToCart")} +
      </UnderlineButton>
    );
  }

  const qtyButton =
    "grid size-12 cursor-pointer place-items-center text-[18px] transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-30";
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center", className)}>
      <div
        className="inline-flex w-fit items-center border-b border-ink"
        role="group"
        aria-label={t("cart.quantity")}
      >
        <button
          type="button"
          className={qtyButton}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1}
          aria-label={t("cart.decrease")}
        >
          −
        </button>
        <output className="w-8 text-center font-mono text-[14px]" aria-live="polite">
          {quantity}
        </output>
        <button
          type="button"
          className={qtyButton}
          onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
          disabled={quantity >= MAX_QUANTITY}
          aria-label={t("cart.increase")}
        >
          +
        </button>
      </div>
      <Button size="lg" onClick={() => add(slug, quantity)} className="sm:flex-1">
        {label ?? t("shop.addToCart")}
      </Button>
    </div>
  );
}
