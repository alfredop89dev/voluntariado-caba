import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Volunteer } from "@/lib/models/volunteer";
import { verifyToken } from "@/lib/auth";

async function checkAuth(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { valid } = verifyToken(token);
  if (!valid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return null;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await checkAuth();
  if (authError) return authError;

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
