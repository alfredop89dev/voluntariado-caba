import { NextResponse } from "next/server";

const limits = new Map<string, { count: number; reset: number }>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

export function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = limits.get(ip);

  if (!entry || now > entry.reset) {
    limits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return null;
  }

  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429 },
    );
  }

  return null;
}
