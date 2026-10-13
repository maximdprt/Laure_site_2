import { Section, Text } from "@react-email/components";
import { formatLabels, getService, type BookingFormat, type ServiceId } from "@/config/services";
import { EmailLayout, Hr, styles, SummaryRow } from "./components/layout";

export type BookingNotificationProps = {
  serviceId: ServiceId;
  format: BookingFormat;
  when: string;
  name: string;
  email: string;
  phone: string;
  /** Adresse postale (test ou pack à distance) */
  postalAddress?: string;
  message?: string;
  /** Montant réglé en ligne, déjà mis en forme */
  paid?: string;
  balance?: string;
  locale: "fr" | "en";
  siteUrl: string;
};

/** Notification à Laure pour chaque nouveau rendez-vous confirmé (en français) */
export default function BookingNotification(props: BookingNotificationProps) {
  const service = getService(props.serviceId);
  return (
    <EmailLayout preview={`Nouveau rendez-vous : ${service.name.fr} – ${props.when}`} lang="fr" siteUrl={props.siteUrl}>
      <Text style={styles.h1}>
        Nouveau <span style={styles.accent}>rendez-vous.</span>
      </Text>
      {props.postalAddress && (
        <Section style={{ borderLeft: "2px solid #111111", padding: "4px 0 4px 14px", margin: "0 0 20px" }}>
          <Text style={{ ...styles.text, margin: 0 }}>
            <strong>Envoyer le support couleurs à :</strong> {props.postalAddress}
          </Text>
        </Section>
      )}
      <Hr style={styles.hrStrong} />
      <SummaryRow label="Prestation" value={service.name.fr} />
      <SummaryRow label="Date" value={props.when} />
      <SummaryRow label="Format" value={formatLabels[props.format].fr} />
      <SummaryRow label="Nom" value={props.name} />
      <SummaryRow label="E-mail" value={props.email} />
      <SummaryRow label="Téléphone" value={props.phone} />
      {props.postalAddress && <SummaryRow label="Adresse postale" value={props.postalAddress} />}
      {props.paid && <SummaryRow label="Réglé en ligne" value={props.paid} />}
      {props.balance && <SummaryRow label="Solde à régler en séance" value={props.balance} />}
      <SummaryRow label="Langue" value={props.locale === "fr" ? "Français" : "Anglais"} />
      {props.message && <SummaryRow label="Ce qui l'amène" value={props.message} />}
      <Text style={{ ...styles.muted, marginTop: "20px" }}>
        L&apos;événement est confirmé dans votre Google Agenda.
      </Text>
    </EmailLayout>
  );
}

BookingNotification.PreviewProps = {
  serviceId: "test",
  format: "distance",
  when: "mardi 3 novembre 2026 à 10:00",
  name: "Camille Martin",
  email: "camille@exemple.fr",
  phone: "06 00 00 00 00",
  postalAddress: "1 rue des Pins, 33680 Lacanau",
  message: "Une période de changement professionnel.",
  paid: "20 €",
  balance: "45 €",
  locale: "fr",
  siteUrl: "http://localhost:3000",
} satisfies BookingNotificationProps;
