import type { ReactNode } from "react";

/** Le vrai layout (html, body) est dans app/[locale]/layout.tsx */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
