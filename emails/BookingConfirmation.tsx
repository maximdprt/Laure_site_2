import { Button, Section, Text } from "@react-email/components";
import { FREE_CANCELLATION_HOURS, formatLabels, getService, type BookingFormat, type ServiceId } from "@/config/services";
import { EmailLayout, Hr, styles, SummaryRow } from "./components/layout";
import { wellnessNotice } from "./components/wellness";

export type BookingConfirmationProps = {
  locale: "fr" | "en";
  firstName: string;
  serviceId: ServiceId;
  format: BookingFormat;
  /** Date et heure déjà mises en forme (heure de Paris) */
  when: string;
  phone: string;
  cabinetAddress: string;
  postalAddress?: string;
  /** Montant réglé en ligne et solde à régler en séance, déjà mis en forme */
  paid?: string;
  balance?: string;
  contactEmail: string;
  contactPhone: string;
  siteUrl: string;
  bookingUrl: string;
};

const copy = {
  fr: {
    preview: "Votre rendez-vous avec Laure Dupuch est confirmé.",
    previewFree: "Votre appel découverte avec Laure Dupuch est confirmé.",
    hello: (name: string) => `Bonjour ${name},`,
    title: "Votre rendez-vous",
    titleFree: "Votre appel découverte",
    accent: "est confirmé.",
    intro: "Merci pour votre confiance. Voici le récapitulatif de votre réservation ; l'invitation est jointe à cet e-mail (fichier .ics) pour l'ajouter à votre agenda.",
    service: "Prestation",
    date: "Date",
    format: "Format",
    place: "Lieu",
    terms: "Modalités",
    paid: "Réglé en ligne",
    balance: "Solde à régler en séance",
    cabinet: (address: string) => `Au cabinet : ${address}. Prévoyez d'arriver quelques minutes en avance.`,
    distance: (phone: string, address?: string) =>
      `Votre support couleurs vous est envoyé par courrier${address ? ` (${address})` : ""} ou en PDF avant la séance. Gardez-le à portée de main : Laure vous appelle à l'heure prévue au ${phone}.`,
    phoneCall: (phone: string) => `Laure vous appelle à l'heure prévue au ${phone}. Installez-vous dans un endroit calme.`,
    cancelTitle: "Annuler ou déplacer",
    cancel: (hours: number, email: string, phone: string, deposit: boolean) =>
      `L'annulation ou le report sont gratuits jusqu'à ${hours} h avant le rendez-vous : contactez Laure par e-mail (${email}) ou par téléphone (${phone}).${deposit ? " Au-delà, l'acompte est conservé." : ""}`,
    button: "Voir le site",
    signature: "À très bientôt,\nLaure Dupuch",
  },
  en: {
    preview: "Your appointment with Laure Dupuch is confirmed.",
    previewFree: "Your discovery call with Laure Dupuch is confirmed.",
    hello: (name: string) => `Hello ${name},`,
    title: "Your appointment",
    titleFree: "Your discovery call",
    accent: "is confirmed.",
    intro: "Thank you for your trust. Here is a summary of your booking; the invitation is attached to this email (.ics file) so you can add it to your calendar.",
    service: "Service",
    date: "Date",
    format: "Format",
    place: "Location",
    terms: "Arrangements",
    paid: "Paid online",
    balance: "Balance payable at the session",
    cabinet: (address: string) => `At the practice: ${address}. Please arrive a few minutes early.`,
    distance: (phone: string, address?: string) =>
      `Your colour cards are sent to you by post${address ? ` (${address})` : ""} or as a PDF before the session. Keep them close at hand: Laure will call you at the scheduled time on ${phone}.`,
    phoneCall: (phone: string) => `Laure will call you at the scheduled time on ${phone}. Settle somewhere quiet.`,
    cancelTitle: "Cancel or reschedule",
    cancel: (hours: number, email: string, phone: string, deposit: boolean) =>
      `Cancelling or rescheduling is free of charge up to ${hours} hours before the appointment: contact Laure by email (${email}) or phone (${phone}).${deposit ? " After that, the deposit is kept." : ""}`,
    button: "Visit the website",
    signature: "See you soon,\nLaure Dupuch",
  },
} as const;

export default function BookingConfirmation(props: BookingConfirmationProps) {
  const c = copy[props.locale];
  const service = getService(props.serviceId);
  const free = !service.requiresPayment;
  const terms =
    props.format === "cabinet"
      ? c.cabinet(props.cabinetAddress)
      : props.format === "distance"
        ? c.distance(props.phone, props.postalAddress)
        : c.phoneCall(props.phone);

  return (
    <EmailLayout
      preview={free ? c.previewFree : c.preview}
      lang={props.locale}
      siteUrl={props.siteUrl}
      wellnessNotice={wellnessNotice[props.locale]}
    >
      <Text style={styles.text}>{c.hello(props.firstName)}</Text>
      <Text style={styles.h1}>
        {free ? c.titleFree : c.title} <span style={styles.accent}>{c.accent}</span>
      </Text>
      <Text style={styles.text}>{c.intro}</Text>
      <Hr style={styles.hrStrong} />
      <SummaryRow label={c.service} value={service.name[props.locale]} />
      <SummaryRow label={c.date} value={props.when} />
      <SummaryRow label={c.format} value={formatLabels[props.format][props.locale]} />
      <SummaryRow label={props.format === "cabinet" ? c.place : c.terms} value={terms} />
      {props.paid && <SummaryRow label={c.paid} value={props.paid} />}
      {props.balance && <SummaryRow label={c.balance} value={props.balance} />}
      <Section style={{ paddingTop: "24px" }}>
        <Text style={styles.label}>{c.cancelTitle}</Text>
        <Text style={styles.text}>
          {c.cancel(FREE_CANCELLATION_HOURS, props.contactEmail, props.contactPhone, Boolean(props.paid))}
        </Text>
        <Text style={{ ...styles.text, whiteSpace: "pre-line" }}>{c.signature}</Text>
        <Button href={props.bookingUrl} style={styles.button}>
          {c.button}
        </Button>
      </Section>
    </EmailLayout>
  );
}

BookingConfirmation.PreviewProps = {
  locale: "fr",
  firstName: "Camille",
  serviceId: "pack",
  format: "distance",
  when: "mardi 3 novembre 2026 à 10:00",
  phone: "06 00 00 00 00",
  cabinetAddress: "Lacanau",
  postalAddress: "1 rue des Pins, 33680 Lacanau",
  paid: "20 €",
  balance: "65 €",
  contactEmail: "contact@exemple.fr",
  contactPhone: "06 00 00 00 00",
  siteUrl: "http://localhost:3000",
  bookingUrl: "http://localhost:3000/rendez-vous",
} satisfies BookingConfirmationProps;
