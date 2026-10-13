"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

/**
 * Bouton pilule pleine largeur fixé en bas d'écran (mobile) :
 * blanc sur les sections photo / sombres, noir sur fond clair.
 */
export function MobileCta() {
  const t = useTranslations("mobileCta");
  const pathname = usePathname();
  const cartOpen = useCart((s) => s.isOpen);
  const ref = useRef<HTMLAnchorElement>(null);
  const [onDark, setOnDark] = useState(false);

  const hidden =
    pathname.startsWith("/rendez-vous") || pathname.startsWith("/commande") || pathname === "/styleguide" || cartOpen;

  useEffect(() => {
    if (hidden) return;
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const y = rect.top + rect.height / 2;
        const stack = document.elementsFromPoint(window.innerWidth / 2, y);
        const below = stack.find((node) => !el.contains(node) && node !== el);
        setOnDark(Boolean(below?.closest('[data-tone="dark"]')));
      });
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [hidden, pathname]);

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(14px,env(safe-area-inset-bottom))] lg:hidden">
      <Link
        ref={ref}
        href="/rendez-vous"
        className={cn(
          "pointer-events-auto flex min-h-13 w-full items-center justify-center rounded-full text-[15px] transition-colors duration-300",
          onDark ? "bg-white text-ink" : "bg-ink text-white",
        )}
      >
        {t("label")}
      </Link>
    </div>
  );
}
