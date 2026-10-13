import "server-only";
import type Stripe from "stripe";
import { getService, needsPostalAddress } from "@/config/services";
import { siteConfig } from "@/config/site";
import BookingConfirmation from "@/emails/BookingConfirmation";
import BookingNotification from "@/emails/BookingNotification";
import { localizedPath } from "./seo";
import {
  bookingIcs,
  cabinetAddress,
  confirmedTitle,
  eventDescription,
  formatDateTime,
  fromStripeMetadata,
  fullName,
  postalAddress,
  type BookingRecord,
} from "./booking";
import { env } from "./env";
import { createEvent, deleteEvent, getEvent, updateEvent, type BookingProps } from "./google-calendar";
import { laureEmail, sendEmail } from "./resend";
import { formatPrice } from "./utils";

function bookingProps(record: BookingRecord, status: BookingProps["status"], stripeSessionId?: string): BookingProps {
  return {
    status,
    holdUntil: "",
    serviceId: record.serviceId,
    format: record.format,
    locale: record.locale,
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
    phone: record.phone,
    addressLine: record.addressLine,
    postalCode: record.postalCode,
    city: record.city,
    message: record.message,
    ...(stripeSessionId ? { stripeSessionId } : {}),
  };
}

/**
 * E-mails de confirmation (client, avec .ics) et de notification (Laure).
 * La clé d'idempotence évite tout doublon si Stripe renvoie le webhook.
 */
export async function sendBookingEmails(
  record: BookingRecord,
  options: { paidCents: number; idempotencyKey: string },
): Promise<void> {
  const service = getService(record.serviceId);
  const locale = record.locale;
  const paid = options.paidCents > 0 ? formatPrice(options.paidCents, locale) : undefined;
  const balanceCents = service.priceCents - options.paidCents;
  const balance = options.paidCents > 0 && balanceCents > 0 ? formatPrice(balanceCents, locale) : undefined;
  const address = needsPostalAddress(record.serviceId, record.format) ? postalAddress(record) : undefined;
  const when = formatDateTime(record.start, locale);

  await sendEmail({
    to: record.email,
    subject:
      locale === "fr"
        ? `${service.requiresPayment ? "Votre rendez-vous est confirmé" : "Votre appel découverte est confirmé"} – NLIGHT`
        : `${service.requiresPayment ? "Your appointment is confirmed" : "Your discovery call is confirmed"} – NLIGHT`,
    react: BookingConfirmation({
      locale,
      firstName: record.firstName,
      serviceId: record.serviceId,
      format: record.format,
      when,
      phone: record.phone,
      cabinetAddress: cabinetAddress(),
      postalAddress: address,
      paid,
      balance,
      contactEmail: siteConfig.contact.email,
      contactPhone: siteConfig.contact.phone,
      siteUrl: env.siteUrl,
      bookingUrl: `${env.siteUrl}${localizedPath("/", locale)}`,
    }),
    attachments: [{ filename: "rendez-vous-nlight.ics", content: bookingIcs(record), contentType: "text/calendar" }],
    idempotencyKey: `${options.idempotencyKey}-client`,
  });

  const to = laureEmail();
  if (to) {
    await sendEmail({
      to,
      replyTo: record.email,
      subject: `Nouveau rendez-vous : ${service.name.fr} – ${formatDateTime(record.start, "fr")}`,
      react: BookingNotification({
        serviceId: record.serviceId,
        format: record.format,
        when: formatDateTime(record.start, "fr"),
        name: fullName(record),
        email: record.email,
        phone: record.phone,
        postalAddress: address,
        message: record.message || undefined,
        paid: options.paidCents > 0 ? formatPrice(options.paidCents, "fr") : undefined,
        balance: balance ? formatPrice(balanceCents, "fr") : undefined,
        locale,
        siteUrl: env.siteUrl,
      }),
      attachments: [{ filename: "rendez-vous.ics", content: bookingIcs({ ...record, locale: "fr" }), contentType: "text/calendar" }],
      idempotencyKey: `${options.idempotencyKey}-laure`,
    });
  }
}

/** checkout.session.completed pour une réservation (metadata.kind = "booking") */
export async function handleBookingCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const record = fromStripeMetadata(session.metadata);
  if (!record) throw new Error(`Métadonnées de réservation invalides (session ${session.id})`);

  const event = await getEvent(record.eventId);
  // Idempotence : déjà pris en compte
  if (event?.props.status === "confirmed") return;

  const paidCents = session.amount_total ?? 0;
  await sendBookingEmails(record, { paidCents, idempotencyKey: `booking-${session.id}` });

  const description = eventDescription(
    record,
    `Paiement Stripe : ${formatPrice(paidCents, "fr")} (session ${session.id})`,
  );
  if (event) {
    await updateEvent(record.eventId, {
      summary: confirmedTitle(record),
      description,
      props: bookingProps(record, "confirmed", session.id),
    });
  } else {
    // Le créneau provisoire a disparu (nettoyage tardif) : le paiement est fait, on recrée l'événement confirmé
    await createEvent({
      summary: confirmedTitle(record),
      description: `${description}\n⚠ Événement recréé après paiement : vérifier l'absence de conflit.`,
      start: new Date(record.start),
      end: new Date(record.end),
      props: bookingProps(record, "confirmed", session.id),
    });
  }
}

/** checkout.session.expired pour une réservation : libère le créneau provisoire */
export async function handleBookingExpired(session: Stripe.Checkout.Session): Promise<void> {
  const eventId = session.metadata?.eventId;
  if (!eventId) return;
  const event = await getEvent(eventId);
  if (event && event.props.status === "hold") await deleteEvent(eventId);
}
