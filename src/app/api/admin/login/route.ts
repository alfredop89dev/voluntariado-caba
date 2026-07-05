import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { User, verifyPassword, hashPassword } from "@/lib/models/user";
import { createToken } from "@/lib/auth";
import { ADMIN } from "@/lib/config";

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    const db = await connectDB();

    if (!db) {
      return NextResponse.json(
        { error: "Error de conexión con la base de datos" },
        { status: 503 },
      );
    }

    const user = await User.findOne({ username });

    if (user) {
      if (!verifyPassword(password, user.password)) {
        return NextResponse.json(
          { error: "Credenciales inválidas" },
          { status: 401 },
        );
      }
    } else {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        await User.create({
          username,
          password: hashPassword(password),
          role: "admin",
        });
      } else {
        return NextResponse.json(
          { error: "Credenciales inválidas" },
          { status: 401 },
        );
      }
    }

    const token = createToken(username);
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN.SESSION_MAX_AGE,
    });

    return NextResponse.json({ success: true, username });
  } catch {
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 },
    );
  }
}
