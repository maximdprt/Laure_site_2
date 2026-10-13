import "server-only";
import NewsletterNotification from "@/emails/NewsletterNotification";
import { env } from "./env";
import { laureEmail, sendEmail } from "./resend";
import type { NewsletterInput } from "./validation";

/**
 * Inscription à la newsletter.
 * v1 : stockage simple — un e-mail est envoyé à Laure pour chaque inscription.
 * Pour passer à Brevo plus tard, il suffit de remplacer le corps de `subscribe`
 * par un appel à l'API Brevo (POST /v3/contacts) : le reste du site ne change pas.
 */
export async function subscribe(input: Pick<NewsletterInput, "email" | "firstName" | "locale">): Promise<boolean> {
  const to = laureEmail();
  if (!to) {
    console.info(`[NLIGHT:newsletter] EMAIL_LAURE absente : inscription non transmise (${input.email})`);
    return !env.isProduction;
  }
  const date = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date());
  const firstName = input.firstName.trim();
  return sendEmail({
    to,
    subject: `Nouvelle inscription newsletter : ${firstName ? `${firstName} ` : ""}${input.email}`,
    react: NewsletterNotification({
      firstName,
      email: input.email,
      date,
      locale: input.locale,
      siteUrl: env.siteUrl,
    }),
  });
}
