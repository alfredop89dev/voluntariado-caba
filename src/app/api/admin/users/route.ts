import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { User, hashPassword, type IUserData } from "@/lib/models/user";
import { checkAuth } from "@/lib/auth-utils";
import { checkAdminRateLimit } from "@/lib/rate-limiter";
import { z } from "zod";

const createUserSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres").max(50),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100),
  role: z.string().default("admin"),
});

export async function GET() {
  const authError = await checkAuth();
  if (authError) return authError;

  const db = await connectDB();
  if (!db) {
    return NextResponse.json({ error: "Base de datos no disponible" }, { status: 503 });
  }

  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    const mapped: IUserData[] = users.map((u: Record<string, unknown>) => {
      const { _id, ...rest } = u;
      return { id: String(_id), ...rest } as unknown as IUserData;
    });
    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const body = await request.json();
    const parsed = createUserSchema.parse(body);
    const hashed = hashPassword(parsed.password);
    const user = await User.create({
      username: parsed.username,
      password: hashed,
      role: parsed.role,
    });
    const obj = JSON.parse(JSON.stringify(user));
    delete obj.password;
    return NextResponse.json(obj, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && "issues" in err) {
      return NextResponse.json(
        { error: "Datos inválidos", details: (err as { issues: unknown[] }).issues },
        { status: 400 },
      );
    }
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return NextResponse.json(
        { error: "El nombre de usuario ya existe" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}
