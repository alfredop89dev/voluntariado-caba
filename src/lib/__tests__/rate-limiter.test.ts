import { describe, it, expect } from "vitest";
import { checkRateLimit, checkAdminRateLimit } from "@/lib/rate-limiter";

describe("checkRateLimit", () => {
  it("allows first request", () => {
    const result = checkRateLimit("1.2.3.4");
    expect(result).toBeNull();
  });

  it("blocks after exceeding limit", () => {
    const ip = "5.6.7.8";
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(ip)).toBeNull();
    }
    const blocked = checkRateLimit(ip);
    expect(blocked).not.toBeNull();
    expect(blocked!.status).toBe(429);
  });

  it("tracks different IPs separately", () => {
    for (let i = 0; i < 12; i++) {
      checkRateLimit("10.0.0.1");
    }
    expect(checkRateLimit("10.0.0.2")).toBeNull();
  });
});

describe("checkAdminRateLimit", () => {
  it("allows first request", () => {
    const result = checkAdminRateLimit("192.168.1.1");
    expect(result).toBeNull();
  });

  it("blocks after exceeding admin limit (30)", () => {
    const ip = "192.168.1.100";
    for (let i = 0; i < 30; i++) {
      expect(checkAdminRateLimit(ip)).toBeNull();
    }
    const blocked = checkAdminRateLimit(ip);
    expect(blocked).not.toBeNull();
    expect(blocked!.status).toBe(429);
  });

  it("tracks admin IPs separately from public rate limit", () => {
    checkRateLimit("10.0.0.99");
    expect(checkAdminRateLimit("10.0.0.99")).toBeNull();
  });
});
