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

export async function GET() {
  const authError = await checkAuth();
  if (authError) return authError;

  const db = await connectDB();
  if (!db) {
    return NextResponse.json({ error: "Base de datos no disponible" }, { status: 503 });
  }

  try {
    const volunteers = await Volunteer.find()
      .sort({ createdAt: -1 })
      .lean()
      .then((docs) =>
        docs.map((v: Record<string, unknown>) => ({
          id: String(v._id),
          name: v.name as string,
          email: v.email as string,
          phone: (v.phone as string) ?? null,
          interestedEvent: (v.interestedEvent as string) ?? null,
          organizer: (v.organizer as string) ?? null,
          instagram: (v.instagram as string) ?? null,
          location: (v.location as string) ?? null,
          skills: (v.skills as string) ?? null,
          availability: (v.availability as string) ?? null,
          status: (v.status as string) ?? "pending",
          createdAt: v.createdAt as Date,
        })),
      );
    return NextResponse.json(volunteers);
  } catch {
    return NextResponse.json({ error: "Error al obtener voluntarios" }, { status: 500 });
  }
}
