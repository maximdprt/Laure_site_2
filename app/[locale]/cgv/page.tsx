// À faire relire par un professionnel avant mise en ligne
import type { Metadata } from "next";
import { getLegalContent } from "@/content/legal";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { LegalDocument } from "@/components/legal/legal-document";

export async function generateMetadata({ params }: PageProps<"/[locale]/cgv">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const doc = getLegalContent(locale).cgv;
  return buildMetadata({ locale, href: "/cgv", title: doc.seoTitle, description: doc.seoDescription });
}

export default async function TermsPage({ params }: PageProps<"/[locale]/cgv">) {
  const locale = await resolveLocale(params);
  return <LegalDocument doc={getLegalContent(locale).cgv} href="/cgv" />;
}
