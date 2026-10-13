"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not([data-revealed])";

/**
 * Déclenche les animations [data-reveal] (globals.css) quand les éléments entrent dans l'écran.
 * - Ce qui est déjà visible au chargement est marqué révélé tout de suite (pas de clignotement).
 * - Les éléments ajoutés ensuite (navigation, étapes de réservation…) sont observés automatiquement.
 * Sans JavaScript, ou avant l'hydratation, rien n'est masqué.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const observe = (scope: ParentNode) => {
      scope.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    };

    // Au premier passage : ce qui est déjà à l'écran reste affiché tel quel
    const limit = window.innerHeight * 0.92;
    document.querySelectorAll(SELECTOR).forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < limit && rect.bottom > 0) el.setAttribute("data-revealed", "");
      else io.observe(el);
    });
    root.setAttribute("data-reveal-ready", "");

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(SELECTOR)) io.observe(node);
          observe(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.removeAttribute("data-reveal-ready");
    };
  }, []);

  return null;
}
