import { describe, it, expect, beforeEach } from "vitest";
import { createToken, verifyToken } from "@/lib/auth";

beforeEach(() => {
  process.env.ADMIN_TOKEN_SECRET = "test-secret-must-be-at-least-32-chars!!";
});

describe("createToken", () => {
  it("returns a string with two parts separated by a dot", () => {
    const token = createToken("admin");
    const parts = token.split(".");
    expect(parts).toHaveLength(2);
    expect(parts[0]).toBeTruthy();
    expect(parts[1]).toBeTruthy();
  });

  it("produces different tokens for different users", () => {
    const tokenA = createToken("admin1");
    const tokenB = createToken("admin2");
    expect(tokenA).not.toBe(tokenB);
  });
});

describe("verifyToken", () => {
  it("verifies a valid token", () => {
    const token = createToken("admin");
    const result = verifyToken(token);
    expect(result.valid).toBe(true);
    expect(result.username).toBe("admin");
  });

  it("returns invalid for a malformed token", () => {
    const result = verifyToken("invalid-token");
    expect(result.valid).toBe(false);
    expect(result.username).toBe("");
  });

  it("returns invalid for a tampered token", () => {
    const token = createToken("admin");
    const tampered = token.slice(0, -5) + "XXXXX";
    const result = verifyToken(tampered);
    expect(result.valid).toBe(false);
  });

  it("returns invalid for empty token", () => {
    const result = verifyToken("");
    expect(result.valid).toBe(false);
  });

  it("rejects expired token when maxAgeMs is provided", () => {
    const token = createToken("admin");
    const result = verifyToken(token, 0);
    expect(result.valid).toBe(false);
  });

  it("accepts token within maxAgeMs", () => {
    const token = createToken("admin");
    const result = verifyToken(token, 60_000);
    expect(result.valid).toBe(true);
  });

  it("throws when ADMIN_TOKEN_SECRET is not set", () => {
    delete process.env.ADMIN_TOKEN_SECRET;
    expect(() => createToken("admin")).toThrow(
      "ADMIN_TOKEN_SECRET no está configurado",
    );
  });
});
