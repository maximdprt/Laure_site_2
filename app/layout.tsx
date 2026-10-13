import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { metadataBase: new URL(siteConfig.url) };

/** Le vrai layout (html, body) est dans app/[locale]/layout.tsx */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
