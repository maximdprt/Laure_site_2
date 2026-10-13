"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type CartLine = { slug: string; quantity: number };

export const MAX_QUANTITY = 10;

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

/** localStorage peut être indisponible (navigation privée, stockage bloqué) : on ne plante jamais. */
const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      /* stockage indisponible : le panier reste en mémoire */
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

const clamp = (n: number) => Math.max(1, Math.min(MAX_QUANTITY, Math.round(n)));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (slug, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.slug === slug);
          const lines = existing
            ? state.lines.map((l) => (l.slug === slug ? { ...l, quantity: clamp(l.quantity + quantity) } : l))
            : [...state.lines, { slug, quantity: clamp(quantity) }];
          return { lines, isOpen: true };
        }),
      setQuantity: (slug, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) => (l.slug === slug ? { ...l, quantity: clamp(quantity) } : l)),
        })),
      remove: (slug) => set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "nlight-cart",
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
