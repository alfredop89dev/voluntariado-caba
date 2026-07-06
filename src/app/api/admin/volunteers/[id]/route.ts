import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Volunteer } from "@/lib/models/volunteer";
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
    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) {
      return NextResponse.json({ error: "Voluntario no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Voluntario eliminado" });
  } catch {
    return NextResponse.json({ error: "Error al eliminar voluntario" }, { status: 500 });
  }
}

export async function PATCH(
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
    const { status } = body;

    if (!["pending", "contacted", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(id, { status }, { new: true });
    if (!volunteer) {
      return NextResponse.json({ error: "Voluntario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Estado actualizado" });
  } catch {
    return NextResponse.json({ error: "Error al actualizar voluntario" }, { status: 500 });
  }
}
