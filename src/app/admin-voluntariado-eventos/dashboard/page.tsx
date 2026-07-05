"use client";

import useSWR from "swr";
import type { IEventData } from "@/lib/models/event";

interface VolunteerEntry {
  id: string;
  status: string;
}

interface UserEntry {
  id: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar datos");
  return res.json();
};

export default function AdminDashboardPage() {
  const { data: events } = useSWR<IEventData[]>("/api/admin/events", fetcher);
  const { data: volunteers } = useSWR<VolunteerEntry[]>("/api/admin/volunteers", fetcher);
  const { data: users } = useSWR<UserEntry[]>("/api/admin/users", fetcher);

  const pendingVolunteers = volunteers?.filter((v) => v.status === "pending").length ?? 0;
  const upcomingEvents = events?.filter((e) => new Date(e.date) >= new Date()).length ?? 0;

  const cards = [
    {
      label: "Eventos",
      value: events?.length ?? 0,
      sub: `${upcomingEvents} próximos`,
      icon: "calendar",
    },
    {
      label: "Voluntarios",
      value: volunteers?.length ?? 0,
      sub: `${pendingVolunteers} pendientes`,
      icon: "users",
    },
    {
      label: "Usuarios",
      value: users?.length ?? 0,
      icon: "admin",
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium text-coral uppercase tracking-[0.2em]">
          Admin
        </p>
        <h1 className="text-3xl font-light text-navy">
          Panel de <span className="font-semibold">control</span>
        </h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-muted/30 bg-white p-6 shadow-xs sm:p-8"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
              {card.icon === "calendar" && (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              )}
              {card.icon === "users" && (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              )}
              {card.icon === "admin" && (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              )}
            </div>
            <p className="text-xs font-semibold text-taupe uppercase tracking-[0.15em]">{card.label}</p>
            <p className="mt-1 text-3xl font-light text-navy">{card.value}</p>
            {card.sub && <p className="mt-1 text-xs text-taupe">{card.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
