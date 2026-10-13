// À faire relire par un professionnel avant mise en ligne
import type { Metadata } from "next";
import { getLegalContent } from "@/content/legal";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { LegalDocument } from "@/components/legal/legal-document";

export async function generateMetadata({ params }: PageProps<"/[locale]/mentions-legales">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const doc = getLegalContent(locale).mentions;
  return buildMetadata({ locale, href: "/mentions-legales", title: doc.seoTitle, description: doc.seoDescription });
}

export default async function LegalNoticePage({ params }: PageProps<"/[locale]/mentions-legales">) {
  const locale = await resolveLocale(params);
  return <LegalDocument doc={getLegalContent(locale).mentions} href="/mentions-legales" />;
}
