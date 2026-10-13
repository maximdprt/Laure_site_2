import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";

/**
 * Gabarit commun des e-mails, aux couleurs du site :
 * pierre claire, encre, filets fins, titres légers, accent serif italique.
 */
export const colors = {
  bg: "#EFEEEA",
  paper: "#FFFFFF",
  ink: "#111111",
  muted: "#6B6862",
  line: "#CFCBC3",
};

const fontSans = "'Geist', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const fontSerif = "'Instrument Serif', Georgia, 'Times New Roman', serif";
const fontMono = "'Geist Mono', 'SFMono-Regular', Menlo, Consolas, monospace";

export const styles = {
  h1: {
    fontFamily: fontSans,
    fontWeight: 300,
    fontSize: "34px",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
    color: colors.ink,
    margin: "0 0 20px",
  } satisfies CSSProperties,
  accent: { fontFamily: fontSerif, fontStyle: "italic", fontWeight: 400 } satisfies CSSProperties,
  text: { fontFamily: fontSans, fontSize: "16px", lineHeight: "1.65", color: colors.ink, margin: "0 0 16px" } satisfies CSSProperties,
  muted: { fontFamily: fontSans, fontSize: "14px", lineHeight: "1.6", color: colors.muted, margin: "0 0 12px" } satisfies CSSProperties,
  label: {
    fontFamily: fontMono,
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: colors.muted,
    margin: "0 0 4px",
  } satisfies CSSProperties,
  value: { fontFamily: fontSans, fontSize: "16px", lineHeight: "1.5", color: colors.ink, margin: "0" } satisfies CSSProperties,
  button: {
    display: "inline-block",
    backgroundColor: colors.ink,
    color: "#FFFFFF",
    fontFamily: fontSans,
    fontSize: "15px",
    padding: "14px 28px",
    borderRadius: "999px",
    textDecoration: "none",
  } satisfies CSSProperties,
  hr: { borderColor: colors.line, borderTopWidth: "1px", margin: "24px 0" } satisfies CSSProperties,
  hrStrong: { borderColor: colors.ink, borderTopWidth: "1px", margin: "24px 0 0" } satisfies CSSProperties,
};

type EmailLayoutProps = {
  preview: string;
  lang: "fr" | "en";
  children: ReactNode;
  /** Mention bien-être en pied d'e-mail (obligatoire pour les e-mails clients) */
  wellnessNotice?: string;
  siteUrl: string;
};

export function EmailLayout({ preview, lang, children, wellnessNotice, siteUrl }: EmailLayoutProps) {
  return (
    <Html lang={lang}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.bg, margin: 0, padding: "32px 0" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px" }}>
          <Text
            style={{
              fontFamily: fontSans,
              fontWeight: 500,
              fontSize: "15px",
              letterSpacing: "0.32em",
              color: colors.ink,
              margin: "0 0 28px",
            }}
          >
            NLIGHT
          </Text>
          <Section style={{ backgroundColor: colors.paper, padding: "36px 32px" }}>{children}</Section>
          <Section style={{ padding: "24px 4px 0" }}>
            {wellnessNotice && <Text style={{ ...styles.muted, fontSize: "12px" }}>{wellnessNotice}</Text>}
            <Text style={{ ...styles.muted, fontSize: "12px" }}>
              NLIGHT – Laure Dupuch · Lacanau ·{" "}
              <Link href={siteUrl} style={{ color: colors.muted }}>
                {siteUrl.replace(/^https?:\/\//, "")}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/** Ligne « label / valeur » d'un récapitulatif */
export function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Section style={{ borderBottom: `1px solid ${colors.line}`, padding: "12px 0" }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Section>
  );
}

export { Hr };
