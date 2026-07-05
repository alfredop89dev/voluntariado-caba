"use client";

import useSWR from "swr";
import type { IEventData } from "@/lib/models/event";

const fetcher = async (url: string): Promise<IEventData[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener eventos");
  return res.json();
};

export function useEvents() {
  const { data, error, isLoading, mutate } = useSWR<IEventData[]>("/api/events", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    events: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
