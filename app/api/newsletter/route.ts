import { NextResponse } from "next/server";
import { jsonError, logError, readJson, zodFields } from "@/lib/api";
import { subscribe } from "@/lib/newsletter";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/newsletter — inscription (honeypot + limitation de débit) */
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`newsletter:ip:${ip}`, 5, 10 * 60_000)) return jsonError("rateLimit", 429);

  const parsed = newsletterSchema.safeParse(await readJson(request));
  if (!parsed.success) return jsonError("validation", 400, zodFields(parsed.error));

  // Champ piège rempli : on répond « OK » sans rien faire (robot)
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const email = parsed.data.email.toLowerCase();
  if (!rateLimit(`newsletter:email:${email}`, 2, 60 * 60_000)) return jsonError("rateLimit", 429);

  try {
    const ok = await subscribe({ ...parsed.data, email });
    if (!ok) return jsonError("generic", 502);
  } catch (error) {
    logError("newsletter", error);
    return jsonError("generic", 500);
  }
  return NextResponse.json({ ok: true });
}
