"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useEvents } from "@/hooks/use-events";
import { CALENDAR } from "@/lib/config";
import { SECTION_IDS } from "@/lib/config";
import { useI18n } from "@/lib/i18n/translations-context";
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

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="rounded-sm bg-coral/20 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

function EventCardImage({ event, title }: { event: IEventData; title: string }) {
  const [error, setError] = useState(false);
  const src = event.flyer || event.image;

  if (!src || error) {
    return (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-navy/5 via-white to-muted/20">
        <span className="select-none text-[clamp(4rem,10vw,7rem)] font-bold text-muted/30">
          {title.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <>
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover transition-all duration-500 ease-out group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, 50vw"
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const GROUPS_PER_PAGE = CALENDAR.GROUPS_PER_PAGE;

export function CalendarSection() {
  const { t } = useI18n();
  const { events, isLoading } = useEvents();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  function handlePageChange(newPage: number) {
    setPage(newPage);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const query = search.trim();
  const filtered = events.filter(
    (e) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.organizer?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q)
      );
    },
  );
  const grouped = groupEventsByDate(filtered);
  const entries = Object.entries(grouped);
  const totalPages = Math.ceil(entries.length / GROUPS_PER_PAGE);
  const paginatedEntries = entries.slice(page * GROUPS_PER_PAGE, (page + 1) * GROUPS_PER_PAGE);

  return (
    <section ref={sectionRef} id={SECTION_IDS.calendario} className="bg-muted/20 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p className="mb-3 text-center text-xs font-medium text-coral uppercase tracking-[0.2em]">
            {t("calendar.badge")}
          </p>
          <h2 className="text-center text-3xl font-light text-navy sm:text-4xl">
            {t("calendar.title")} <span className="font-semibold">{t("calendar.title_accent")}</span>
          </h2>
        </FadeIn>

        <div className="relative mx-auto mt-10 max-w-md">
          <svg
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-taupe"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder={t("calendar.search_placeholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handlePageChange(0);
            }}
            className="w-full rounded-xl border border-muted/50 bg-white py-3 pr-4 pl-11 text-sm text-navy outline-none transition-all duration-200 placeholder:text-taupe/50 focus:border-coral/40 focus:ring-2 focus:ring-coral/10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer text-taupe transition-all duration-200 hover:scale-110 hover:text-navy"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {!search && (
            <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-md border border-muted/30 bg-muted/10 px-1.5 py-0.5 text-[10px] font-medium text-taupe/50">
              /
            </kbd>
          )}
        </div>

        {query && entries.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center text-xs text-taupe"
          >
            {filtered.length} {filtered.length === 1 ? t("calendar.search_found") : t("calendar.search_found_plural")}
          </motion.p>
        )}

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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-16 max-w-md rounded-2xl border border-muted/40 bg-white px-12 py-20 text-center shadow-xs"
            >
              {search ? (
                <>
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted/30">
                    <svg className="size-5 text-taupe" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                  </div>
                    <p className="text-sm text-taupe">{t("calendar.no_results_search")}</p>
                    <button
                      onClick={() => setSearch("")}
                      className="mt-4 cursor-pointer text-xs font-medium text-coral transition-colors hover:text-coral/80"
                    >
                      {t("calendar.clear_search")}
                    </button>
                </>
              ) : (
                <p className="text-sm text-taupe">{t("calendar.no_results")}</p>
              )}
            </motion.div>
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
                            <EventCardImage event={event} title={event.title} />

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
                                <Highlight text={event.organizer} query={query} />
                              </span>
                            )}

                            <h3 className="mb-2.5 text-base font-semibold leading-snug text-navy transition-colors duration-200 group-hover:text-coral">
                              <Highlight text={event.title} query={query} />
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
                                  <Highlight text={event.location} query={query} />
                                </span>
                              )}
                            </div>

                            {event.description && (
                              <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-taupe/80">
                                <Highlight text={event.description} query={query} />
                              </p>
                            )}

                            <span className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-coral transition-all duration-200 group-hover:gap-2.5">
                              {t("calendar.view_event")}
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
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </section>
  );
}
