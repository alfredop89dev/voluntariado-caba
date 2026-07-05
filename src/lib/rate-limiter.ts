import { NextResponse } from "next/server";
import { RATE_LIMIT } from "@/lib/config";

const limits = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = limits.get(ip);

  if (!entry || now > entry.reset) {
    limits.set(ip, { count: 1, reset: now + RATE_LIMIT.WINDOW_MS });
    return null;
  }

  entry.count++;

  if (entry.count > RATE_LIMIT.MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429 },
    );
  }

  return null;
}
