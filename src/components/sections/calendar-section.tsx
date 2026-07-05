"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useEvents } from "@/hooks/use-events";
import type { IEventData } from "@/lib/models/event";

function groupEventsByDate(events: IEventData[]): Record<string, IEventData[]> {
  const grouped: Record<string, IEventData[]> = {};

  for (const event of events) {
    const dateKey = new Date(event.date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(event);
  }

  return grouped;
}

function formatTime(date: Date, time?: string): string {
  if (time) return time;
  return new Date(date).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMonthAbbr(date: Date): string {
  return new Date(date).toLocaleDateString("es-ES", { month: "short" }).replace(".", "");
}

function getDayNum(date: Date): number {
  return new Date(date).getDate();
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const GROUPS_PER_PAGE = 2;

export function CalendarSection() {
  const { events, isLoading } = useEvents();
  const grouped = groupEventsByDate(events);
  const entries = Object.entries(grouped);
  const totalPages = Math.ceil(entries.length / GROUPS_PER_PAGE);
  const [page, setPage] = useState(0);
  const paginatedEntries = entries.slice(page * GROUPS_PER_PAGE, (page + 1) * GROUPS_PER_PAGE);

  return (
    <section id="calendario" className="bg-muted/20 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p className="mb-3 text-center text-xs font-medium text-coral uppercase tracking-[0.2em]">
            Calendario
          </p>
          <h2 className="text-center text-3xl font-light text-navy sm:text-4xl">
            Próximos <span className="font-semibold">eventos</span>
          </h2>
        </FadeIn>

        {isLoading ? (
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-black/5">
                <Skeleton className="aspect-[16/9] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-full rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <FadeIn delay={0.15}>
            <div className="mx-auto mt-16 max-w-md rounded-2xl border border-muted/40 bg-white px-12 py-20 text-center shadow-xs">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted/20">
                <svg className="size-6 text-taupe/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-taupe">No hay eventos próximos. Vuelve pronto.</p>
            </div>
          </FadeIn>
        ) : (
          <>
            <div className="mt-16 space-y-20">
              {paginatedEntries.map(([date, dateEvents], dateIdx) => (
                <FadeIn key={date} delay={dateIdx * 0.1}>
                  <div className="relative mb-10 flex items-center gap-4">
                    <span className="shrink-0 rounded-full bg-coral/10 px-4 py-1.5 text-xs font-semibold text-coral uppercase tracking-wider">
                      {date}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-muted/50 to-transparent" />
                  </div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1, transition: { staggerChildren: 0.1 } },
                    }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid gap-8 sm:grid-cols-2"
                  >
                    {dateEvents.map((event, idx) => (
                      <motion.article
                        key={`${date}-${idx}`}
                        variants={cardVariants}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="group relative overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-black/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:ring-coral/25"
                      >
                        <Link href={`/events/${event.id}`} className="block cursor-pointer">
                          <div className="relative aspect-[16/9] w-full overflow-hidden">
                            {(event.flyer || event.image) ? (
                              <>
                                <Image
                                  src={event.flyer ?? event.image!}
                                  alt={event.title}
                                  fill
                                  className="object-cover transition-all duration-500 ease-out group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                              </>
                            ) : (
                              <div className="flex size-full items-center justify-center bg-gradient-to-br from-navy/5 via-white to-muted/20">
                                <span className="select-none text-[clamp(4rem,10vw,7rem)] font-bold text-muted/30">
                                  {event.title.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}

                            <div className="absolute left-3 top-3 flex flex-col items-center rounded-xl bg-white/90 px-3 py-1.5 shadow-xs backdrop-blur-xs">
                              <span className="text-lg font-bold leading-none text-navy">
                                {getDayNum(event.date)}
                              </span>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-coral">
                                {getMonthAbbr(event.date)}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            {event.organizer && (
                              <span className="mb-2.5 inline-flex items-center rounded-full bg-navy/5 px-2.5 py-0.5 text-[11px] font-medium text-navy/70">
                                {event.organizer}
                              </span>
                            )}

                            <h3 className="mb-2.5 text-base font-semibold leading-snug text-navy transition-colors duration-200 group-hover:text-coral">
                              {event.title}
                            </h3>

                            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
                              {(event.time || event.date) && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] text-taupe">
                                  <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {formatTime(event.date, event.time)} hs
                                </span>
                              )}
                              {event.location && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] text-taupe">
                                  <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {event.location}
                                </span>
                              )}
                            </div>

                            {event.description && (
                              <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-taupe/80">
                                {event.description}
                              </p>
                            )}

                            <span className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-coral transition-all duration-200 group-hover:gap-2.5">
                              Ver evento
                              <svg className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </motion.div>
                </FadeIn>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </section>
  );
}
