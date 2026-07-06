import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/lib/models/event";
import { eventSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limiter";
import { mapEvent } from "@/lib/api-utils";
import type { IEventData } from "@/lib/models/event";
import { headers } from "next/headers";

export async function GET() {
  const db = await connectDB();
  if (!db) {
    return NextResponse.json({ error: "Base de datos no disponible" }, { status: 503 });
  }

  try {
    const events = await Event.find().sort({ date: 1 }).lean();
    const mapped: IEventData[] = events.map((e) => mapEvent(e as Record<string, unknown>));
    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const rateLimitResponse = checkRateLimit(ip);
  if (rateLimitResponse) return rateLimitResponse;

  const db = await connectDB();
  if (!db) {
    return NextResponse.json({ error: "Base de datos no disponible" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = eventSchema.parse(body);
    const event = await Event.create(parsed);
    return NextResponse.json(event, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && "issues" in err) {
      return NextResponse.json(
        { error: "Datos inválidos", details: (err as { issues: unknown[] }).issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Error al crear evento" }, { status: 500 });
  }
}
