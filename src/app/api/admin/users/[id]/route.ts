import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/user";
import { checkAuth } from "@/lib/auth-utils";
import { checkAdminRateLimit } from "@/lib/rate-limiter";
import { verifyToken } from "@/lib/auth";
import { ADMIN } from "@/lib/config";

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

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const { username: currentUsername } = verifyToken(token ?? "", ADMIN.SESSION_MAX_AGE * 1000);

    const target = await User.findById(id);
    if (!target) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (target.username === currentUsername) {
      return NextResponse.json(
        { error: "No puedes eliminar tu propio usuario" },
        { status: 400 },
      );
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "Usuario eliminado" });
  } catch {
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 });
  }
}
