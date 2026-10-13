"use client";

import { useLocale, useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { useState } from "react";
import type { ImageKey } from "@/config/images";
import { getProduct } from "@/config/products";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/config/shipping";
import { Link } from "@/i18n/navigation";
import { MAX_QUANTITY, useCart } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/utils";
import { Button, LinkUnderline } from "@/components/ui/button";
import { FormStatus } from "@/components/ui/form";
import { Media } from "@/components/ui/media";

/** Panier : tiroir latéral sur fond pierre, articles en liste à filets */
export function CartDrawer({ imageAvailability }: { imageAvailability: Partial<Record<ImageKey, boolean>> }) {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { lines, isOpen, close, setQuantity, remove } = useCart();
  const hydrated = useHydrated();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  const items = (hydrated ? lines : []).flatMap((line) => {
    const product = getProduct(line.slug);
    return product ? [{ line, product }] : [];
  });
  const subtotal = items.reduce((sum, { line, product }) => sum + product.priceCents * line.quantity, 0);

  async function checkout() {
    setPending(true);
    setError(false);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: items.map(({ line }) => line), locale }),
      });
      const data: unknown = await res.json();
      if (!res.ok || typeof data !== "object" || data === null || !("url" in data) || typeof data.url !== "string") {
        throw new Error("checkout");
      }
      window.location.assign(data.url);
    } catch {
      setError(true);
      setPending(false);
    }
  }

  const qtyButton =
    "grid size-11 cursor-pointer place-items-center text-[18px] leading-none transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-30";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => (open ? undefined : close())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 data-[state=open]:animate-[fade-in_0.3s_ease-out]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col bg-bg text-ink data-[state=open]:animate-[drawer-in_0.5s_var(--ease-soft)]"
        >
          <div className="flex items-center justify-between px-6 pb-4 pt-6 md:px-8">
            <Dialog.Title className="text-[28px] font-light tracking-[-0.02em]">{t("title")}</Dialog.Title>
            <Dialog.Close className="link-underline cursor-pointer text-[14px]">{tc("close")}</Dialog.Close>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-start justify-center gap-6 px-6 md:px-8">
              <p className="text-ink-muted">{t("empty")}</p>
              <LinkUnderline href="/boutique" onClick={close}>
                {t("emptyCta")}
              </LinkUnderline>
            </div>
          ) : (
            <>
              <ul className="mx-6 flex-1 overflow-y-auto border-t border-ink md:mx-8">
                {items.map(({ line, product }) => (
                  <li key={product.slug} className="flex gap-4 border-b border-line py-5">
                    <Media
                      imageKey={product.image}
                      locale={locale}
                      available={Boolean(imageAvailability[product.image])}
                      sizes="72px"
                      ratio="4/5"
                      decorative
                      className="w-[72px] shrink-0"
                    />
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={{ pathname: "/boutique/[slug]", params: { slug: product.slug } }}
                          onClick={close}
                          className="text-[16px] leading-snug hover:underline"
                        >
                          {product.name[locale]}
                        </Link>
                        <span className="serif-accent shrink-0 text-[20px]">
                          {formatPrice(product.priceCents * line.quantity, locale)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div
                          className="-ml-3 inline-flex items-center"
                          role="group"
                          aria-label={`${t("quantity")} – ${product.name[locale]}`}
                        >
                          <button
                            type="button"
                            className={qtyButton}
                            onClick={() => setQuantity(product.slug, line.quantity - 1)}
                            disabled={line.quantity <= 1}
                            aria-label={t("decrease")}
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-mono text-[13px]" aria-live="polite">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            className={qtyButton}
                            onClick={() => setQuantity(product.slug, line.quantity + 1)}
                            disabled={line.quantity >= MAX_QUANTITY}
                            aria-label={t("increase")}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(product.slug)}
                          className="link-underline cursor-pointer text-[13px] text-ink-muted"
                          aria-label={t("remove", { name: product.name[locale] })}
                        >
                          {t("removeShort")}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4 px-6 pb-8 pt-6 md:px-8">
                <div className="flex items-baseline justify-between border-t border-ink pt-5">
                  <span className="label-mono text-ink-muted">{t("subtotal")}</span>
                  <span className="serif-accent text-[30px] leading-none">{formatPrice(subtotal, locale)}</span>
                </div>
                <p className="text-[13px] text-ink-muted">
                  {t("shippingNote", { threshold: formatPrice(FREE_SHIPPING_THRESHOLD_CENTS, locale) })}
                </p>
                {error && <FormStatus tone="error">{t("error")}</FormStatus>}
                <Button onClick={checkout} disabled={pending} fullWidth size="lg">
                  {pending ? t("checkingOut") : t("checkout")}
                </Button>
                <p className="text-center text-[12px] text-ink-muted">{t("securePayment")}</p>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
