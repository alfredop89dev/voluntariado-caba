"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Search, X, Clock, MapPin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEvents } from "@/hooks/use-events";
import { SECTION_IDS } from "@/lib/config";
import { FadeIn } from "@/components/ui/fade-in";
import { CardImage } from "@/components/card-image";
import { Pagination } from "@/components/ui/pagination";
import { useI18n } from "@/lib/i18n/translations-context";
import type { IEventData } from "@/lib/models/event";

const STATUS_STYLES: Record<string, string> = {
  activo: "bg-green-50/80 text-green-700 border-green-200/50",
  cerrado: "bg-red-50/80 text-red-700 border-red-200/50",
  pendiente: "bg-amber-50/80 text-amber-700 border-amber-200/50",
  pospuesto: "bg-blue-50/80 text-blue-700 border-blue-200/50",
};

function getDayNum(date: Date): number {
  return new Date(date).getDate();
}

function getMonthAbbr(date: Date): string {
  return new Date(date).toLocaleDateString("es-ES", { month: "short" }).replace(".", "");
}

const ASPECTS = ["aspect-[16/9]", "aspect-[4/5]", "aspect-[3/2]", "aspect-[1/1]", "aspect-[16/10]", "aspect-[5/4]"];

function EventCard({ event, index }: { event: IEventData; index: number }) {
  const aspect = ASPECTS[index % ASPECTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-6 break-inside-avoid"
    >
      <Link href={`/events/${event.id}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-coral/20">
          <div className={`relative ${aspect} overflow-hidden`}>
            <CardImage
              src={event.image ?? event.flyer}
              title={event.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            <div className="absolute top-3 left-3 flex items-start gap-2">
              <div className="rounded-xl bg-white/90 px-3 py-1.5 text-center shadow-xs backdrop-blur-xs">
                <p className="text-lg font-bold leading-none text-navy">{getDayNum(event.date)}</p>
                <p className="text-[10px] font-semibold tracking-wider text-coral uppercase">{getMonthAbbr(event.date)}</p>
              </div>
              {event.status && event.status !== "activo" && (
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium shadow-xs backdrop-blur-xs ${STATUS_STYLES[event.status] ?? "bg-white/80 text-taupe border-muted/50"}`}
                >
                  {event.status === "pendiente"
                    ? "Pendiente"
                    : event.status === "pospuesto"
                      ? "Pospuesto"
                      : event.status === "cerrado"
                        ? "Cerrado"
                        : event.status}
                </span>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <h3 className="text-base font-semibold text-navy transition-colors duration-200 group-hover:text-coral">
              {event.title}
            </h3>

            {event.description && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-taupe/80">
                {event.description}
              </p>
            )}

            <div className="mt-4 flex items-center gap-4 text-[12px] text-taupe">
              {event.time && (
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {event.time}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  {event.location}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-1 text-[12px] font-medium text-coral transition-all duration-200 group-hover:gap-2.5">
              <span>Ver evento</span>
              <ArrowRight size={12} />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const skRng = mulberry32(7);

function EventSkeleton() {
  const aspect = ASPECTS[Math.floor(skRng() * ASPECTS.length)];

  return (
    <div className="mb-6 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-black/5">
      <div className={`${aspect} animate-pulse bg-muted/30`} />
      <div className="space-y-3 p-5 sm:p-6">
        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-muted/30" />
        <div className="h-3 w-full animate-pulse rounded-lg bg-muted/20" />
        <div className="h-3 w-2/3 animate-pulse rounded-lg bg-muted/20" />
        <div className="h-3 w-1/3 animate-pulse rounded-lg bg-muted/30" />
      </div>
    </div>
  );
}

const PAGE_SIZE = 8;

export function CalendarSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { events, isLoading, isError } = useEvents();

  const filteredEvents = useMemo(
    () =>
      (events ?? []).filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.organizer ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.location ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [events, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages - 1);
  const paginatedEvents = filteredEvents.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.calendario}
      className="bg-warm px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-4 inline-block text-[11px] font-semibold tracking-[0.2em] text-coral uppercase">
              {t("calendar.badge")}
            </span>
            <h2 className="text-3xl font-light leading-tight text-navy sm:text-4xl">
              {t("calendar.title")}{" "}
              <span className="font-semibold">{t("calendar.title_accent")}</span>
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative mx-auto mb-12 max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-taupe/50"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t("calendar.search_placeholder")}
              className="w-full rounded-xl border border-muted/50 bg-white py-3 pr-4 pl-11 text-sm text-navy outline-none transition-all duration-200 placeholder:text-taupe/40 focus:border-coral/40 focus:ring-2 focus:ring-coral/10"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-1 text-taupe/50 transition-colors hover:text-navy"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </FadeIn>

        {isError && (
          <div className="mx-auto mb-8 max-w-md rounded-xl border border-coral/20 bg-coral/5 px-4 py-3 text-center text-xs text-coral">
            Error al cargar eventos
          </div>
        )}

        {isLoading && (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && searchQuery && filteredEvents.length === 0 && (
          <FadeIn>
            <div className="mx-auto max-w-md rounded-2xl border border-muted/30 bg-white px-12 py-16 text-center shadow-xs">
              <p className="text-sm text-taupe">{t("calendar.no_results_search")}</p>
              <button
                onClick={() => handleSearch("")}
                className="mt-4 cursor-pointer text-xs font-medium text-coral transition-colors hover:text-coral/80"
              >
                {t("calendar.clear_search")}
              </button>
            </div>
          </FadeIn>
        )}

        {!isLoading && !isError && filteredEvents.length === 0 && !searchQuery && (
          <FadeIn>
            <div className="mx-auto max-w-md rounded-2xl border border-muted/30 bg-white px-12 py-16 text-center shadow-xs">
              <p className="text-sm text-taupe">{t("calendar.no_results")}</p>
            </div>
          </FadeIn>
        )}

        <AnimatePresence mode="wait">
          {!isLoading && !isError && paginatedEvents.length > 0 && (
            <motion.div
              key={safePage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="columns-1 gap-6 sm:columns-2 lg:columns-3"
            >
              {paginatedEvents.map((event, idx) => (
                <EventCard key={event.id} event={event} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <FadeIn delay={0.2}>
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
