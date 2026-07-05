import { describe, it, expect } from "vitest";
import { volunteerSchema, eventSchema } from "@/lib/schemas";

describe("volunteerSchema", () => {
  it("accepts valid volunteer data", () => {
    const result = volunteerSchema.safeParse({
      name: "Juan Pérez",
      email: "juan@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = volunteerSchema.safeParse({
      email: "juan@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = volunteerSchema.safeParse({
      name: "Juan Pérez",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = volunteerSchema.safeParse({
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "+54 11 1234 5678",
      skills: "salud, logística",
      availability: "fines de semana",
    });
    expect(result.success).toBe(true);
  });
});

describe("eventSchema", () => {
  it("accepts valid event data with all fields", () => {
    const result = eventSchema.safeParse({
      title: "Jornada de Acopio",
      organizer: "Red de Voluntarios",
      image: "https://example.com/image.jpg",
      date: "2026-07-15T10:00:00Z",
      time: "10:00",
      description: "Recolección de alimentos",
      location: "Plaza Central, CABA",
      flyer: "https://example.com/flyer.jpg",
      logo: "https://example.com/logo.png",
      instagram: "@redvoluntarios",
      googleMaps: "https://maps.google.com/?q=plaza+central",
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimal event data", () => {
    const result = eventSchema.safeParse({
      title: "Jornada de Acopio",
      date: "2026-07-15",
      description: "Recolección de alimentos",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = eventSchema.safeParse({
      date: "2026-07-15T10:00:00Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid image URL", () => {
    const result = eventSchema.safeParse({
      title: "Evento",
      date: "2026-07-15T10:00:00Z",
      image: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
