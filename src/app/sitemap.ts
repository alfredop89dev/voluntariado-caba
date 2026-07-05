import { connectDB } from "@/lib/mongodb";
import { Event } from "@/lib/models/event";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voluntariadocaba.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];

  const db = await connectDB();
  if (db) {
    try {
      const events = await Event.find().select("_id updatedAt").lean();
      const eventRoutes: MetadataRoute.Sitemap = events.map((e: Record<string, unknown>) => ({
        url: `${BASE_URL}/events/${String(e._id)}`,
        lastModified: (e.updatedAt as Date) ?? new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
      return [...staticRoutes, ...eventRoutes];
    } catch {
      return staticRoutes;
    }
  }

  return staticRoutes;
}
