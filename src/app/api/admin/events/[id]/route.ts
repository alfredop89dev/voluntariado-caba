import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/lib/models/event";
import { eventSchema } from "@/lib/schemas";
import { checkAuth } from "@/lib/auth-utils";
import { checkAdminRateLimit } from "@/lib/rate-limiter";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await checkAuth();
  if (authError) return authError;

  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const rateLimitResponse = checkAdminRateLimit(ip);
  if (rateLimitResponse) return rateLimitResponse;

  const db = await connectDB();
  if (!db) {
    return NextResponse.json({ error: "Base de datos no disponible" }, { status: 503 });
  }

  try {
    const { id } = await params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Evento eliminado" });
  } catch {
    return NextResponse.json({ error: "Error al eliminar evento" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await checkAuth();
  if (authError) return authError;

  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const rateLimitResponse = checkAdminRateLimit(ip);
  if (rateLimitResponse) return rateLimitResponse;

  const db = await connectDB();
  if (!db) {
    return NextResponse.json({ error: "Base de datos no disponible" }, { status: 503 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = eventSchema.parse(body);
    const event = await Event.findByIdAndUpdate(id, parsed, { new: true, runValidators: true });
    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (err: unknown) {
    if (err instanceof Error && "issues" in err) {
      return NextResponse.json(
        { error: "Datos inválidos", details: (err as { issues: unknown[] }).issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Error al actualizar evento" }, { status: 500 });
  }
}
