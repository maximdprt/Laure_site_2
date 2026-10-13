import { NextResponse } from "next/server";
import { logError } from "@/lib/api";
import { env } from "@/lib/env";
import { deleteEvent, isCalendarConfigured, listExpiredHolds } from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Tâche planifiée Vercel (toutes les 15 min, voir vercel.json) :
 * supprime les créneaux provisoires dont le délai de paiement est dépassé.
 * Filet de sécurité en plus du webhook checkout.session.expired.
 */
export async function GET(request: Request) {
  if (!env.cronSecret || request.headers.get("authorization") !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isCalendarConfigured()) return NextResponse.json({ deleted: 0, skipped: "calendar_not_configured" });

  try {
    const expired = await listExpiredHolds(new Date());
    for (const hold of expired) await deleteEvent(hold.id);
    return NextResponse.json({ deleted: expired.length });
  } catch (error) {
    logError("cron:cleanup-holds", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
