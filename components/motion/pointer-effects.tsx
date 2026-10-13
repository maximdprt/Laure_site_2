"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CURSOR_KEYS = ["view", "read", "book"] as const;
export type CursorKey = (typeof CURSOR_KEYS)[number];

function isCursorKey(value: string | undefined): value is CursorKey {
  return value !== undefined && (CURSOR_KEYS as readonly string[]).includes(value);
}

/** Attraction des boutons [data-magnetic] vers le pointeur (en px, plafonnée) */
const MAGNET = 0.22;
const MAGNET_MAX = 9;

const clamp = (value: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, value));

/**
 * Effets liés à la souris (ordinateur uniquement, désactivés si prefers-reduced-motion) :
 * - pastille de lecture « Voir / Lire / Réserver » qui suit le pointeur sur les zones [data-cursor] ;
 * - boutons pilule légèrement aimantés ([data-magnetic], variables --mx / --my lues par le CSS).
 * Le curseur natif reste affiché : la pastille n'est qu'un indice visuel (aria-hidden).
 */
export function PointerEffects() {
  const t = useTranslations("cursor");
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<CursorKey>("view");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let x = -200;
    let y = -200;
    let cx = x;
    let cy = y;
    let frame = 0;
    let active: CursorKey | null = null;
    let magnet: HTMLElement | null = null;

    const tick = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      frame = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const releaseMagnet = () => {
      if (!magnet) return;
      magnet.style.removeProperty("--mx");
      magnet.style.removeProperty("--my");
      magnet = null;
    };

    const update = (target: Element | null) => {
      const key = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      const next = isCursorKey(key) ? key : null;
      if (next !== active) {
        if (active === null) {
          // La pastille apparaît sous le pointeur, sans traverser l'écran
          cx = x;
          cy = y;
        }
        active = next;
        if (next) setLabel(next);
        setVisible(next !== null);
      }
      if (!frame) frame = requestAnimationFrame(tick);

      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) releaseMagnet();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        m.style.setProperty("--mx", `${clamp((x - (r.left + r.width / 2)) * MAGNET).toFixed(1)}px`);
        m.style.setProperty("--my", `${clamp((y - (r.top + r.height / 2)) * MAGNET * 1.4).toFixed(1)}px`);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      update(event.target instanceof Element ? event.target : null);
    };

    // Le contenu défile sous un pointeur immobile : on réévalue la zone survolée
    const onScroll = () => {
      if (x < 0) return;
      update(document.elementFromPoint(x, y));
    };

    const onLeave = () => {
      active = null;
      setVisible(false);
      releaseMagnet();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      releaseMagnet();
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] hidden pointer-fine:block">
      <div
        className={cn(
          "label-mono -ml-12 -mt-12 grid size-24 place-items-center rounded-full bg-bg text-ink transition-[scale,opacity] duration-500 ease-soft",
          visible ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
      >
        {t(label)}
      </div>
    </div>
  );
}
