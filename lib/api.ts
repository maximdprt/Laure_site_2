import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";

export type ApiError = { error: string; fields?: Record<string, string> };

export function jsonError(error: string, status: number, fields?: Record<string, string>) {
  return NextResponse.json<ApiError>({ error, ...(fields ? { fields } : {}) }, { status });
}

/** Transforme les erreurs zod en { champ: cléDeMessage } */
export function zodFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !fields[key]) fields[key] = issue.message;
  }
  return fields;
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function logError(scope: string, error: unknown) {
  const message = error instanceof Error ? `${error.message}\n${error.stack ?? ""}` : String(error);
  console.error(`[NLIGHT:${scope}] ${message}`);
}
