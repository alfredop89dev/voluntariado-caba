import "server-only";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ADMIN } from "@/lib/config";

export async function checkAuth(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { valid } = verifyToken(token, ADMIN.SESSION_MAX_AGE * 1000);
  if (!valid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return null;
}
