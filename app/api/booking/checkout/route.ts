import { NextResponse } from "next/server";
import { TIME_ZONE } from "@/config/availability";
import { getService, HOLD_MINUTES, onlineAmountCents, PAYMENT_MODE } from "@/config/services";
import { jsonError, logError, readJson, zodFields } from "@/lib/api";
import {
  confirmationUrl,
  confirmedTitle,
  eventDescription,
  holdTitle,
  signRef,
  slotQuery,
  slotRules,
  toStripeMetadata,
  type BookingRecord,
} from "@/lib/booking";
import { sendBookingEmails } from "@/lib/booking-webhook";
import { env } from "@/lib/env";
import {
  createEvent,
  deleteEvent,
  getBusyIntervals,
  isCalendarConfigured,
  isCalendarMock,
  listOverlappingEvents,
  type BookingProps,
} from "@/lib/google-calendar";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { localizedPath } from "@/lib/seo";
import { isSlotAvailable, zonedTime, dayKey } from "@/lib/slots";
import { getStripe } from "@/lib/stripe";
import { bookingSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOUR = 3_600_000;

/**
 * POST /api/booking/checkout
 * 1. valide les données (zod) ; 2. revérifie que le créneau est libre ;
 * 3. crée un événement provisoire (ou confirmé pour l'appel découverte) ;
 * 4. crée la session Stripe Checkout (30 min) ; 5. renvoie l'URL de redirection.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`booking:ip:${ip}`, 10, HOUR)) return jsonError("rateLimit", 429);

  const parsed = bookingSchema.safeParse(await readJson(request));
  if (!parsed.success) return jsonError("invalid", 400, zodFields(parsed.error));
  const input = parsed.data;
  if (input.website) return jsonError("invalid", 400);

  const service = getService(input.serviceId);
  if (!service.formats.includes(input.format)) return jsonError("invalid", 400, { format: "required" });

  const email = input.email.toLowerCase();
  const emailLimit = service.requiresPayment ? 5 : 3;
  const emailWindow = service.requiresPayment ? HOUR : 24 * HOUR;
  if (!rateLimit(`booking:email:${email}`, emailLimit, emailWindow)) return jsonError("rateLimit", 429);

  if (!isCalendarConfigured() && !isCalendarMock()) return jsonError("unavailable", 503);
  const stripe = service.requiresPayment ? getStripe() : null;
  if (service.requiresPayment && !stripe) return jsonError("unavailable", 503);

  const now = new Date();
  const start = new Date(input.start);
  const end = new Date(start.getTime() + service.blockMinutes * 60_000);

  // 2. Revérification du créneau
  try {
    const day = dayKey(start, TIME_ZONE);
    const busy = await getBusyIntervals(zonedTime(day, "00:00", TIME_ZONE), zonedTime(day, "23:59", TIME_ZONE));
    if (!isSlotAvailable(slotRules, slotQuery(input.serviceId, input.format, now, busy), start.toISOString())) {
      return jsonError("slot_taken", 409);
    }
  } catch (error) {
    logError("booking:freebusy", error);
    return jsonError("unavailable", 503);
  }

  const record: BookingRecord = {
    eventId: "",
    serviceId: input.serviceId,
    format: input.format,
    start: start.toISOString(),
    end: end.toISOString(),
    locale: input.locale,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    addressLine: input.addressLine,
    postalCode: input.postalCode,
    city: input.city,
    message: input.message,
  };

  const props: BookingProps = {
    status: service.requiresPayment ? "hold" : "confirmed",
    holdUntil: service.requiresPayment ? new Date(now.getTime() + HOLD_MINUTES * 60_000).toISOString() : "",
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
  };

  // 3. Événement provisoire (ou confirmé)
  let eventId: string;
  try {
    eventId = await createEvent({
      summary: service.requiresPayment ? holdTitle(record) : confirmedTitle(record),
      description: eventDescription(record, service.requiresPayment ? "En attente de paiement (30 min)." : undefined),
      start,
      end,
      props,
    });
  } catch (error) {
    logError("booking:create", error);
    return jsonError("unavailable", 503);
  }
  record.eventId = eventId;

  // Double vérification : une autre réservation a-t-elle été posée au même moment ?
  try {
    const overlapping = await listOverlappingEvents(start, end);
    const mine = overlapping.find((e) => e.id === eventId);
    const conflict = overlapping.some((other) => {
      if (other.id === eventId || other.transparent) return false;
      if (other.props.status !== "hold" || !mine) return true;
      // Deux créneaux provisoires simultanés : le plus ancien l'emporte
      const diff = other.created.getTime() - mine.created.getTime();
      return diff < 0 || (diff === 0 && other.id < eventId);
    });
    if (conflict) {
      await deleteEvent(eventId);
      return jsonError("slot_taken", 409);
    }
  } catch (error) {
    logError("booking:overlap", error);
  }

  // Appel découverte : confirmation directe, sans paiement
  if (!service.requiresPayment || !stripe) {
    try {
      await sendBookingEmails(record, { paidCents: 0, idempotencyKey: `booking-free-${eventId}` });
    } catch (error) {
      logError("booking:emails", error);
    }
    const ref = signRef({
      eventId,
      serviceId: record.serviceId,
      format: record.format,
      start: record.start,
      end: record.end,
      firstName: record.firstName,
      locale: record.locale,
    });
    return NextResponse.json({ url: confirmationUrl(record.locale, `ref=${encodeURIComponent(ref)}`) });
  }

  // 4. Session Stripe Checkout (acompte ou totalité)
  try {
    const amount = onlineAmountCents(service);
    const metadata = toStripeMetadata(record);
    const label =
      PAYMENT_MODE === "deposit"
        ? record.locale === "fr"
          ? `Acompte – ${service.name.fr}`
          : `Deposit – ${service.name.en}`
        : service.name[record.locale];
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: record.locale,
      customer_email: record.email,
      client_reference_id: eventId,
      expires_at: Math.floor(now.getTime() / 1000) + 31 * 60,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: {
              name: label,
              description:
                record.locale === "fr"
                  ? `Rendez-vous avec Laure Dupuch – déduit du prix de la séance`
                  : `Appointment with Laure Dupuch – deducted from the session price`,
            },
          },
        },
      ],
      metadata,
      payment_intent_data: { metadata: { kind: "booking", eventId }, description: `${service.name.fr} – ${record.start}` },
      success_url: `${env.siteUrl}${localizedPath("/rendez-vous/confirmation", record.locale)}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.siteUrl}${localizedPath("/rendez-vous", record.locale)}?service=${record.serviceId}`,
    });
    if (!session.url) throw new Error("Session Stripe sans URL");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    logError("booking:stripe", error);
    await deleteEvent(eventId).catch((e: unknown) => logError("booking:cleanup", e));
    return jsonError("unavailable", 503);
  }
}
