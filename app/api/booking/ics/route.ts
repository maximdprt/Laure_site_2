import { jsonError, logError } from "@/lib/api";
import { bookingIcs, fromStripeMetadata, verifyRef } from "@/lib/booking";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/booking/ics?session_id=… ou ?ref=… → fichier .ics du rendez-vous */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const ref = verifyRef(url.searchParams.get("ref"));

  let ics: string | null = null;
  if (ref) {
    ics = bookingIcs(ref);
  } else if (sessionId && /^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    const stripe = getStripe();
    if (!stripe) return jsonError("unavailable", 503);
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const record = session.payment_status === "paid" ? fromStripeMetadata(session.metadata) : null;
      if (record) ics = bookingIcs(record);
    } catch (error) {
      logError("booking:ics", error);
    }
  }

  if (!ics) return jsonError("not_found", 404);
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="rendez-vous-nlight.ics"',
      "Cache-Control": "private, no-store",
    },
  });
}
