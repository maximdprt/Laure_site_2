import "server-only";

/**
 * Accès centralisé aux variables d'environnement serveur (voir .env.example).
 * Aucune clé secrète n'est écrite dans le code.
 */
function read(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

export const env = {
  siteUrl: (read("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000").replace(/\/$/, ""),
  stripeSecretKey: read("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: read("STRIPE_WEBHOOK_SECRET"),
  googleServiceAccountEmail: read("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  /** Les retours à la ligne de la clé sont souvent échappés (\n) dans Vercel */
  googleServiceAccountPrivateKey: read("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
  googleCalendarId: read("GOOGLE_CALENDAR_ID"),
  resendApiKey: read("RESEND_API_KEY"),
  emailFrom: read("EMAIL_FROM") ?? "NLIGHT – Laure Dupuch <onboarding@resend.dev>",
  emailLaure: read("EMAIL_LAURE"),
  cronSecret: read("CRON_SECRET"),
  /** Clé de signature des liens (confirmation de rendez-vous, annulation en v2) */
  signingSecret: read("SIGNING_SECRET") ?? read("CRON_SECRET") ?? "dev-only-signing-secret",
  isProduction: process.env.NODE_ENV === "production",
};
