import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { isLocale, routing } from "@/i18n/routing";

/** Image Open Graph générée au design de la marque (pierre, encre, Geist fine + Instrument Serif italique) */
export const alt = "NLIGHT – Laure Dupuch · Test de Profil Chromatique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const fontDir = join(process.cwd(), "node_modules", "@fontsource");

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : routing.defaultLocale;
  const [geistLight, geistRegular, instrumentItalic] = await Promise.all([
    readFile(join(fontDir, "geist-sans/files/geist-sans-latin-300-normal.woff")),
    readFile(join(fontDir, "geist-sans/files/geist-sans-latin-400-normal.woff")),
    readFile(join(fontDir, "instrument-serif/files/instrument-serif-latin-400-italic.woff")),
  ]);

  const copy =
    locale === "fr"
      ? { lead: "Test de Profil Chromatique", accent: "& accompagnement émotionnel", place: "Lacanau · à distance partout en France" }
      : { lead: "Chromatic Profile Test", accent: "& emotional support", place: "Lacanau · remotely anywhere in France" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#EFEEEA",
          color: "#111111",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22 }}>
          <span style={{ letterSpacing: "0.32em", fontWeight: 400 }}>NLIGHT</span>
          <span style={{ color: "#6B6862", fontSize: 18, letterSpacing: "0.1em" }}>LAURE DUPUCH</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 86, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1 }}>{copy.lead}</span>
          <span style={{ fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 80, lineHeight: 1.1 }}>
            {copy.accent}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #111111",
            paddingTop: 24,
            fontSize: 20,
            color: "#6B6862",
          }}
        >
          <span>{copy.place}</span>
          <span>{siteConfig.jobTitle[locale]}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistLight, weight: 300, style: "normal" },
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Instrument Serif", data: instrumentItalic, weight: 400, style: "italic" },
      ],
    },
  );
}
