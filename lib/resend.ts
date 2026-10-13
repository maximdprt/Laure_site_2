import "server-only";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { env } from "./env";
import { logError } from "./api";

let client: Resend | null = null;

function getResend(): Resend | null {
  if (!env.resendApiKey) return null;
  client ??= new Resend(env.resendApiKey);
  return client;
}

export type EmailAttachment = { filename: string; content: string | Buffer; contentType?: string };

type SendEmailInput = {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
  attachments?: EmailAttachment[];
  /** Clé d'idempotence Resend (évite les doublons si Stripe renvoie un webhook) */
  idempotencyKey?: string;
};

/**
 * Envoie un e-mail via Resend.
 * Sans RESEND_API_KEY (développement), l'e-mail est simplement journalisé dans la console.
 */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.info(`[NLIGHT:email] (non envoyé, RESEND_API_KEY absente) → ${String(input.to)} : ${input.subject}`);
    return !env.isProduction;
  }
  try {
    const { error } = await resend.emails.send(
      {
        from: env.emailFrom,
        to: input.to,
        subject: input.subject,
        react: input.react,
        replyTo: input.replyTo,
        attachments: input.attachments,
      },
      input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
    );
    if (error) {
      logError("email", `${error.name}: ${error.message}`);
      return false;
    }
    return true;
  } catch (error) {
    logError("email", error);
    return false;
  }
}

/** Adresse de Laure pour les notifications */
export function laureEmail(): string | null {
  return env.emailLaure ?? null;
}
