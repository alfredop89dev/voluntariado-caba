"use client";

import useSWR from "swr";
import type { IEventData } from "@/lib/models/event";
import { DEMO_EVENTS } from "@/lib/demo-events";

const fetcher = async (url: string): Promise<IEventData[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener eventos");
  return res.json();
};

export function useEvents() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IEventData[]>("/api/events", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: DEMO_EVENTS,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  return {
    events: data ?? DEMO_EVENTS,
    isLoading: isLoading && !data,
    isError: !!error,
    isValidating,
    mutate,
  };
}
