import { Text } from "@react-email/components";
import { EmailLayout, styles, SummaryRow } from "./components/layout";

export type NewsletterNotificationProps = {
  firstName: string;
  email: string;
  date: string;
  locale: "fr" | "en";
  siteUrl: string;
};

/** Notification à Laure : nouvelle inscription à la newsletter */
export default function NewsletterNotification({ firstName, email, date, locale, siteUrl }: NewsletterNotificationProps) {
  return (
    <EmailLayout preview={`Nouvelle inscription newsletter : ${email}`} lang="fr" siteUrl={siteUrl}>
      <Text style={styles.h1}>
        Nouvelle inscription <span style={styles.accent}>newsletter</span>
      </Text>
      <Text style={styles.text}>
        Nouvelle inscription newsletter : {firstName || "(prénom non indiqué)"} {email} {date} {locale.toUpperCase()}
      </Text>
      <SummaryRow label="Prénom" value={firstName || "—"} />
      <SummaryRow label="E-mail" value={email} />
      <SummaryRow label="Date" value={date} />
      <SummaryRow label="Langue" value={locale === "fr" ? "Français" : "Anglais"} />
      <Text style={{ ...styles.muted, marginTop: "20px" }}>
        La personne a coché la case de consentement explicite. Pensez à l&apos;ajouter à votre liste de diffusion.
      </Text>
    </EmailLayout>
  );
}

NewsletterNotification.PreviewProps = {
  firstName: "Camille",
  email: "camille@example.com",
  date: "13/10/2026 10:00",
  locale: "fr",
  siteUrl: "https://example.com",
} satisfies NewsletterNotificationProps;
