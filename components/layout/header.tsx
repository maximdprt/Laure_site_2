"use client";

import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { mainNav } from "@/config/nav";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CartButton } from "@/components/shop/cart-button";
import { ButtonLink } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";

/**
 * Header fixe : transparent (texte blanc) par-dessus la photo du hero,
 * fond pierre translucide au défilement, masqué en descendant, réapparaît en remontant.
 */
export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setAtTop(y < 12);
        const delta = y - lastY.current;
        if (Math.abs(delta) > 6) setHidden(delta > 0 && y > 200);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      data-at-top={atTop}
      className={cn(
        "site-header fixed inset-x-0 top-0 z-40 h-[var(--header-h)] transition-[translate,background-color,color,border-color] duration-700 ease-soft",
        hidden && !menuOpen && "-translate-y-full",
      )}
      // Le header reste immobile pendant les transitions entre pages (globals.css)
      style={{ viewTransitionName: "site-header" }}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="container-site flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label={t("a11y.home")} className="shrink-0 py-3">
          <Logo />
        </Link>

        <nav aria-label={t("a11y.mainNav")} className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {mainNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="link-underline text-[14px] after:scale-x-0 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 lg:gap-6">
          <LocaleSwitcher className="hidden lg:flex" />
          <CartButton />
          <ButtonLink
            href="/rendez-vous"
            size="sm"
            className="header-cta hidden border border-current bg-transparent text-current hover:bg-transparent lg:inline-flex"
          >
            {t("common.bookCta")}
          </ButtonLink>

          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger
              className="group -mr-2 grid size-11 cursor-pointer place-items-center lg:hidden"
              aria-label={t("a11y.openMenu")}
            >
              <span aria-hidden className="flex w-6 flex-col items-end gap-[7px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 bg-current transition-[width] duration-500 ease-soft group-hover:w-full" />
              </span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content
                className="mobile-menu fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg text-ink"
                aria-describedby={undefined}
                data-lenis-prevent
              >
                <Dialog.Title className="sr-only">{t("a11y.mainNav")}</Dialog.Title>
                <div className="container-site flex h-[var(--header-h)] shrink-0 items-center justify-between">
                  <Link href="/" onClick={() => setMenuOpen(false)} aria-label={t("a11y.home")} className="py-3">
                    <Logo />
                  </Link>
                  <Dialog.Close
                    className="-mr-2 grid size-11 cursor-pointer place-items-center"
                    aria-label={t("a11y.closeMenu")}
                  >
                    <span aria-hidden className="relative block size-6 transition-[rotate] duration-500 ease-soft hover:rotate-90">
                      <span className="absolute left-0 top-1/2 h-px w-6 rotate-45 bg-current" />
                      <span className="absolute left-0 top-1/2 h-px w-6 -rotate-45 bg-current" />
                    </span>
                  </Dialog.Close>
                </div>
                <nav aria-label={t("a11y.mainNav")} className="container-site flex flex-1 flex-col pb-10 pt-8">
                  <ul className="flex flex-col gap-1">
                    {mainNav.map((item, i) => (
                      <li key={item.key} className="menu-item overflow-hidden" style={{ "--i": i } as CSSProperties}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          aria-current={isActive(item.href) ? "page" : undefined}
                          className="flex items-baseline gap-4 py-1.5 text-[40px] font-light leading-[1.15] tracking-[-0.03em] aria-[current=page]:font-serif aria-[current=page]:italic"
                        >
                          <span className="label-mono w-6 shrink-0 text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                          {t(`nav.${item.key}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="menu-foot mt-auto flex flex-col gap-6 pt-12">
                    <LocaleSwitcher onNavigate={() => setMenuOpen(false)} />
                    <ButtonLink href="/rendez-vous" fullWidth onClick={() => setMenuOpen(false)}>
                      {t("common.bookCta")}
                    </ButtonLink>
                  </div>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
