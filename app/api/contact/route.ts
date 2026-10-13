import { NextResponse } from "next/server";
import ContactAcknowledgement from "@/emails/ContactAcknowledgement";
import ContactNotification from "@/emails/ContactNotification";
import { jsonError, readJson, zodFields } from "@/lib/api";
import { env } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { laureEmail, sendEmail } from "@/lib/resend";
import { contactSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOUR = 3_600_000;

const subjectLabels = {
  question: "Question",
  preparation: "Préparation",
  shop: "Boutique",
  other: "Autre",
} as const;

/** POST /api/contact : e-mail à Laure (Répondre = visiteur) + accusé de réception au visiteur */
export async function POST(request: Request) {
  if (!rateLimit(`contact:ip:${clientIp(request)}`, 5, HOUR)) return jsonError("rateLimit", 429);

  const body = await readJson(request);
  // Champ piège rempli : on fait comme si tout s'était bien passé
  if (typeof body === "object" && body !== null && "website" in body && body.website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return jsonError("invalid", 400, zodFields(parsed.error));
  const input = parsed.data;

  if (!rateLimit(`contact:email:${input.email.toLowerCase()}`, 3, HOUR)) return jsonError("rateLimit", 429);

  const to = laureEmail();
  if (!to && env.isProduction) return jsonError("unavailable", 503);

  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" }).format(
    new Date(),
  );

  const sent = await sendEmail({
    to: to ?? "dev@localhost",
    replyTo: input.email,
    subject: `Nouveau message (${subjectLabels[input.subject]}) – ${input.name}`,
    react: ContactNotification({
      name: input.name,
      email: input.email,
      phone: input.phone || undefined,
      subject: subjectLabels[input.subject],
      message: input.message,
      locale: input.locale,
      date,
      siteUrl: env.siteUrl,
    }),
  });
  if (!sent) return jsonError("generic", 502);

  await sendEmail({
    to: input.email,
    subject: input.locale === "fr" ? "Votre message à Laure Dupuch – NLIGHT" : "Your message to Laure Dupuch – NLIGHT",
    react: ContactAcknowledgement({ locale: input.locale, name: input.name, message: input.message, siteUrl: env.siteUrl }),
  });

  return NextResponse.json({ ok: true });
}
