"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let instance: Lenis | null = null;

/** Instance Lenis active (null si le défilement fluide est désactivé) */
export function getLenis(): Lenis | null {
  return instance;
}

/** Défile en haut de page (fluide si possible) */
export function scrollToTop() {
  if (instance) instance.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Défilement fluide à la molette (Lenis) sur ordinateur.
 * Désactivé si prefers-reduced-motion ; le tactile garde le défilement natif.
 * Mis en pause pendant qu'une fenêtre (menu, panier) bloque le défilement de la page.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      anchors: { offset: -96 },
      stopInertiaOnNavigate: true,
      prevent: (node) => node.closest("[role='dialog'], [data-lenis-prevent]") !== null,
    });
    instance = lenis;

    // Radix pose data-scroll-locked sur <body> quand un menu ou le panier est ouvert
    const body = document.body;
    const sync = () => (body.hasAttribute("data-scroll-locked") ? lenis.stop() : lenis.start());
    const mo = new MutationObserver(sync);
    mo.observe(body, { attributes: true, attributeFilter: ["data-scroll-locked"] });

    return () => {
      mo.disconnect();
      lenis.destroy();
      instance = null;
    };
  }, []);

  // La hauteur de page change à chaque navigation
  useEffect(() => {
    instance?.resize();
  }, [pathname]);

  return null;
}
