import { NextResponse } from "next/server";
import { TIME_ZONE } from "@/config/availability";
import { getService, isServiceId } from "@/config/services";
import { jsonError, logError } from "@/lib/api";
import { isBookingFormat, slotQuery, slotRules } from "@/lib/booking";
import { getBusyIntervals, isCalendarConfigured, isCalendarMock } from "@/lib/google-calendar";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { computeSlots, dayKey, monthBounds, zonedTime } from "@/lib/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/availability?service=test&format=cabinet&month=2026-11 → { days: { "2026-11-03": ["ISO", …] } } */
export async function GET(request: Request) {
  if (!rateLimit(`availability:${clientIp(request)}`, 120, 60_000)) return jsonError("rateLimit", 429);

  const url = new URL(request.url);
  const serviceId = url.searchParams.get("service");
  const format = url.searchParams.get("format");
  const month = url.searchParams.get("month") ?? "";
  if (!isServiceId(serviceId) || !isBookingFormat(format) || !/^\d{4}-\d{2}$/.test(month)) {
    return jsonError("invalid_query", 400);
  }
  if (!getService(serviceId).formats.includes(format)) return jsonError("invalid_format", 400);
  if (!isCalendarConfigured() && !isCalendarMock()) return jsonError("unavailable", 503);

  const now = new Date();
  let bounds: { fromDay: string; toDay: string };
  try {
    bounds = monthBounds(month);
  } catch {
    return jsonError("invalid_query", 400);
  }
  const today = dayKey(now, TIME_ZONE);
  const lastDay = dayKey(new Date(now.getTime() + slotRules.windowDays * 86_400_000), TIME_ZONE);
  const fromDay = bounds.fromDay < today ? today : bounds.fromDay;
  const toDay = bounds.toDay > lastDay ? lastDay : bounds.toDay;
  if (fromDay > toDay) return NextResponse.json({ days: {} }, { headers: { "Cache-Control": "no-store" } });

  try {
    const busy = await getBusyIntervals(zonedTime(fromDay, "00:00", TIME_ZONE), zonedTime(toDay, "23:59", TIME_ZONE));
    const days = computeSlots(slotRules, { ...slotQuery(serviceId, format, now, busy), fromDay, toDay });
    return NextResponse.json({ days }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logError("availability", error);
    return jsonError("unavailable", 503);
  }
}
