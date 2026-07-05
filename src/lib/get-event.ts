import "server-only";

import { connectDB } from "@/lib/mongodb";
import { Event, type IEventData } from "@/lib/models/event";

export async function getEvent(id: string): Promise<IEventData | null> {
  const db = await connectDB();
  if (!db) return null;

  try {
    const event = await Event.findById(id).lean();
    if (!event) return null;
    const { _id, ...rest } = event as Record<string, unknown>;
    return { id: String(_id), ...rest } as unknown as IEventData;
  } catch {
    return null;
  }
}
