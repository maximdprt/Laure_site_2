"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** false pendant le rendu serveur et l'hydratation, true ensuite (évite les écarts d'hydratation) */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
