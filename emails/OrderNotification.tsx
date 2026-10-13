import { Text } from "@react-email/components";
import { EmailLayout, Hr, styles, SummaryRow } from "./components/layout";

export type OrderNotificationProps = {
  siteUrl: string;
  reference: string;
  date: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  items: { name: string; quantity: number; amount: string }[];
  subtotal: string;
  shipping: string;
  total: string;
  shippingMethod: string | null;
  shippingAddress: string | null;
  testReference: string | null;
  locale: "fr" | "en";
  stripeUrl: string;
};

/** Notification détaillée envoyée à Laure pour chaque commande */
export default function OrderNotification(props: OrderNotificationProps) {
  return (
    <EmailLayout preview={`Nouvelle commande ${props.reference} – ${props.total}`} lang="fr" siteUrl={props.siteUrl}>
      <Text style={styles.h1}>
        Nouvelle <span style={styles.accent}>commande.</span>
      </Text>
      <Text style={styles.text}>
        Commande {props.reference} du {props.date} — {props.total} (site en {props.locale.toUpperCase()}).
      </Text>
      <Hr style={styles.hrStrong} />
      <SummaryRow
        label="Articles"
        value={props.items.map((item) => `${item.quantity} × ${item.name} — ${item.amount}`).join("\n")}
      />
      <SummaryRow label="Sous-total" value={props.subtotal} />
      <SummaryRow label="Livraison" value={`${props.shippingMethod ?? "—"} · ${props.shipping}`} />
      <SummaryRow label="Total" value={props.total} />
      <SummaryRow label="Client" value={[props.name, props.email, props.phone].filter(Boolean).join(" · ")} />
      <SummaryRow label="Adresse de livraison" value={props.shippingAddress ?? "—"} />
      {props.testReference && <SummaryRow label="Nom et date du test (renouvellement)" value={props.testReference} />}
      <Text style={{ ...styles.muted, marginTop: "24px" }}>Détail du paiement : {props.stripeUrl}</Text>
    </EmailLayout>
  );
}
