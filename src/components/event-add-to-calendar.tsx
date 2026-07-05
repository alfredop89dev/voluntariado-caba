"use client";

import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

interface EventAddToCalendarProps {
  title: string;
  date: Date;
  time?: string;
  description?: string;
  location?: string;
}

function formatGoogleCalendar(event: EventAddToCalendarProps): string {
  const start = new Date(event.date);
  if (event.time) {
    const [h, m] = event.time.split(":").map(Number);
    start.setHours(h, m, 0, 0);
  }
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: event.description ?? "",
    location: event.location ?? "",
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function EventAddToCalendar(event: EventAddToCalendarProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      href={formatGoogleCalendar(event)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agregar al calendario"
    >
      <CalendarPlus size={16} />
    </Button>
  );
}
