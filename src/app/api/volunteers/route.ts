import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Volunteer } from "@/lib/models/volunteer";
import { volunteerSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limiter";
import { headers } from "next/headers";

export async function GET() {
  return NextResponse.json(
    { error: "Autenticación requerida. El panel de administración estará disponible próximamente." },
    { status: 401 },
  );
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
    const parsed = volunteerSchema.parse(body);
    const volunteer = await Volunteer.create(parsed);
    return NextResponse.json(volunteer, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && "issues" in err) {
      return NextResponse.json(
        { error: "Datos inválidos", details: (err as { issues: unknown[] }).issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Error al registrar voluntario" }, { status: 500 });
  }
}
