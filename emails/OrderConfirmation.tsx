import { Text } from "@react-email/components";
import { EmailLayout, Hr, styles, SummaryRow } from "./components/layout";

export type OrderEmailProps = {
  locale: "fr" | "en";
  siteUrl: string;
  reference: string;
  name: string | null;
  items: { name: string; quantity: number; amount: string }[];
  subtotal: string;
  shipping: string;
  total: string;
  shippingMethod: string | null;
  shippingAddress: string | null;
  testReference: string | null;
  wellnessNotice: string;
  contactEmail: string;
};

const copy = {
  fr: {
    preview: "Merci pour votre commande NLIGHT",
    title: "Merci pour",
    accent: "votre commande.",
    hello: (name: string | null) => (name ? `Bonjour ${name},` : "Bonjour,"),
    intro: "Votre paiement est confirmé. Laure prépare votre commande avec soin et vous informera de l'expédition ou du retrait.",
    reference: "Référence",
    items: "Articles",
    subtotal: "Sous-total",
    shipping: "Livraison",
    total: "Total payé",
    method: "Mode de livraison",
    address: "Adresse",
    test: "Référence du test",
    questions: "Une question ? Répondez simplement à cet e-mail ou écrivez à",
  },
  en: {
    preview: "Thank you for your NLIGHT order",
    title: "Thank you for",
    accent: "your order.",
    hello: (name: string | null) => (name ? `Hello ${name},` : "Hello,"),
    intro: "Your payment is confirmed. Laure is preparing your order with care and will let you know when it ships or is ready for collection.",
    reference: "Reference",
    items: "Items",
    subtotal: "Subtotal",
    shipping: "Delivery",
    total: "Total paid",
    method: "Delivery method",
    address: "Address",
    test: "Test reference",
    questions: "Any question? Simply reply to this email or write to",
  },
};

/** E-mail de confirmation de commande envoyé au client */
export default function OrderConfirmation(props: OrderEmailProps) {
  const c = copy[props.locale];
  return (
    <EmailLayout preview={c.preview} lang={props.locale} siteUrl={props.siteUrl} wellnessNotice={props.wellnessNotice}>
      <Text style={styles.h1}>
        {c.title} <span style={styles.accent}>{c.accent}</span>
      </Text>
      <Text style={styles.text}>{c.hello(props.name)}</Text>
      <Text style={styles.text}>{c.intro}</Text>
      <Hr style={styles.hrStrong} />
      <SummaryRow label={c.reference} value={props.reference} />
      <SummaryRow
        label={c.items}
        value={props.items.map((item) => `${item.quantity} × ${item.name} — ${item.amount}`).join("\n")}
      />
      <SummaryRow label={c.subtotal} value={props.subtotal} />
      <SummaryRow label={c.shipping} value={props.shipping} />
      <SummaryRow label={c.total} value={<span style={{ ...styles.accent, fontSize: "22px" }}>{props.total}</span>} />
      {props.shippingMethod && <SummaryRow label={c.method} value={props.shippingMethod} />}
      {props.shippingAddress && <SummaryRow label={c.address} value={props.shippingAddress} />}
      {props.testReference && <SummaryRow label={c.test} value={props.testReference} />}
      <Text style={{ ...styles.muted, marginTop: "24px" }}>
        {c.questions} {props.contactEmail}.
      </Text>
    </EmailLayout>
  );
}
