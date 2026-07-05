import crypto from "crypto";

function getSecret(): string {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_TOKEN_SECRET no está configurado. " +
        "Debe definirse en .env.local con un valor aleatorio seguro.",
    );
  }
  return secret;
}

export function createToken(username: string): string {
  const payload = `${username}:${Date.now()}`;
  const signature = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifyToken(token: string): { username: string; valid: boolean } {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return { username: "", valid: false };
    const [encodedPayload, signature] = parts;
    const payload = Buffer.from(encodedPayload, "base64url").toString();
    const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (signature !== expected) return { username: "", valid: false };
    const username = payload.split(":")[0];
    if (!username) return { username: "", valid: false };
    return { username, valid: true };
  } catch {
    return { username: "", valid: false };
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  return match?.[1] ?? null;
}
