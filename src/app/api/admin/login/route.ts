import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { User, verifyPassword, hashPassword } from "@/lib/models/user";
import { createToken } from "@/lib/auth";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

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

    if (db) {
      const user = await User.findOne({ username });

      if (user) {
        if (!verifyPassword(password, user.password)) {
          return NextResponse.json(
            { error: "Credenciales inválidas" },
            { status: 401 },
          );
        }
      } else if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        await User.create({
          username: ADMIN_USERNAME,
          password: hashPassword(ADMIN_PASSWORD),
          role: "admin",
        });
      } else {
        return NextResponse.json(
          { error: "Credenciales inválidas" },
          { status: 401 },
        );
      }

      const token = createToken(username);
      const cookieStore = await cookies();
      cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return NextResponse.json({ success: true, username });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    const token = createToken(username);
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ success: true, username });
  } catch {
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 },
    );
  }
}
