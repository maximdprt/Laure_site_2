import { ViewTransition, type ReactNode } from "react";

/**
 * Transition entre pages : le template est recréé à chaque navigation,
 * <ViewTransition> anime la sortie de l'ancienne page et l'entrée de la nouvelle
 * (classes .page dans globals.css). Sans prise en charge du navigateur, rien ne change.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
