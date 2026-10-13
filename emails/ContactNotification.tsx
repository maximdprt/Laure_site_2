import { Text } from "@react-email/components";
import { EmailLayout, Hr, styles, SummaryRow } from "./components/layout";

export type ContactNotificationProps = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  locale: "fr" | "en";
  date: string;
  siteUrl: string;
};

/** Message reçu via le formulaire de contact (envoyé à Laure, « Répondre » = visiteur) */
export default function ContactNotification(props: ContactNotificationProps) {
  return (
    <EmailLayout preview={`Nouveau message de ${props.name} : ${props.subject}`} lang="fr" siteUrl={props.siteUrl}>
      <Text style={styles.h1}>
        Nouveau <span style={styles.accent}>message.</span>
      </Text>
      <Text style={styles.muted}>Répondez directement à cet e-mail pour écrire à {props.name}.</Text>
      <Hr style={styles.hrStrong} />
      <SummaryRow label="Nom" value={props.name} />
      <SummaryRow label="E-mail" value={props.email} />
      {props.phone && <SummaryRow label="Téléphone" value={props.phone} />}
      <SummaryRow label="Sujet" value={props.subject} />
      <SummaryRow label="Date" value={props.date} />
      <SummaryRow label="Langue" value={props.locale === "fr" ? "Français" : "Anglais"} />
      <Text style={{ ...styles.label, marginTop: "20px" }}>Message</Text>
      <Text style={{ ...styles.text, whiteSpace: "pre-line" }}>{props.message}</Text>
    </EmailLayout>
  );
}

ContactNotification.PreviewProps = {
  name: "Camille Martin",
  email: "camille@exemple.fr",
  phone: "06 00 00 00 00",
  subject: "Question",
  message: "Bonjour,\nJe souhaiterais en savoir plus sur le test à distance.",
  locale: "fr",
  date: "13 octobre 2026, 10:30",
  siteUrl: "http://localhost:3000",
} satisfies ContactNotificationProps;
