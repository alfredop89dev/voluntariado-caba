import type { IEventData } from "@/lib/models/event";

export function mapEvent(e: Record<string, unknown>): IEventData {
  const { _id, ...rest } = e;
  return { id: String(_id), ...rest } as unknown as IEventData;
}

export async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar datos");
  return res.json();
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
