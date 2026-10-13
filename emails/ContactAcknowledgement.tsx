import { Text } from "@react-email/components";
import { EmailLayout, styles } from "./components/layout";
import { wellnessNotice } from "./components/wellness";

export type ContactAcknowledgementProps = {
  locale: "fr" | "en";
  name: string;
  message: string;
  siteUrl: string;
};

const copy = {
  fr: {
    preview: "Votre message a bien été reçu.",
    hello: (name: string) => `Bonjour ${name},`,
    title: "Message",
    accent: "bien reçu.",
    text: "Merci pour votre message. Laure vous répond personnellement dans les meilleurs délais.",
    yours: "Votre message",
    signature: "À très bientôt,\nLaure Dupuch",
  },
  en: {
    preview: "Your message has been received.",
    hello: (name: string) => `Hello ${name},`,
    title: "Message",
    accent: "received.",
    text: "Thank you for your message. Laure will reply to you personally as soon as possible.",
    yours: "Your message",
    signature: "Warm regards,\nLaure Dupuch",
  },
} as const;

/** Accusé de réception envoyé au visiteur */
export default function ContactAcknowledgement(props: ContactAcknowledgementProps) {
  const c = copy[props.locale];
  return (
    <EmailLayout preview={c.preview} lang={props.locale} siteUrl={props.siteUrl} wellnessNotice={wellnessNotice[props.locale]}>
      <Text style={styles.text}>{c.hello(props.name)}</Text>
      <Text style={styles.h1}>
        {c.title} <span style={styles.accent}>{c.accent}</span>
      </Text>
      <Text style={styles.text}>{c.text}</Text>
      <Text style={{ ...styles.label, marginTop: "20px" }}>{c.yours}</Text>
      <Text style={{ ...styles.muted, whiteSpace: "pre-line" }}>{props.message}</Text>
      <Text style={{ ...styles.text, whiteSpace: "pre-line", marginTop: "20px" }}>{c.signature}</Text>
    </EmailLayout>
  );
}

ContactAcknowledgement.PreviewProps = {
  locale: "fr",
  name: "Camille",
  message: "Bonjour, je souhaiterais en savoir plus sur le test à distance.",
  siteUrl: "http://localhost:3000",
} satisfies ContactAcknowledgementProps;
