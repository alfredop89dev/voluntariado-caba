import { notFound } from "next/navigation";
import Link from "next/link";
import { getEvent, getRelatedEvents } from "@/lib/get-event";
import { Button } from "@/components/ui/button";
import { EventHeroImage } from "@/components/event-hero-image";
import { CardImage } from "@/components/card-image";
import { EventCountdown } from "@/components/event-countdown";
import { EventAddToCalendar } from "@/components/event-add-to-calendar";
import { EventShare } from "@/components/event-share";
import { ArrowLeft, MapPin } from "lucide-react";
import { SECTION_IDS, INSTAGRAM_BASE_URL } from "@/lib/config";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";
import type { IEventData } from "@/lib/models/event";

interface Props {
  params: Promise<{ id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voluntariadocaba.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return { title: "Evento no encontrado" };
  }

  const imageUrl = event.flyer || event.image;

  return {
    title: event.title,
    description: event.description,
    alternates: { canonical: `/events/${id}` },
    openGraph: {
      type: "article",
      locale: "es_AR",
      title: event.title,
      description: event.description,
      url: `/events/${id}`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

function getDayNum(date: Date): number {
  return new Date(date).getDate();
}

function getMonthAbbr(date: Date): string {
  return new Date(date).toLocaleDateString("es-ES", { month: "short" }).replace(".", "");
}

function RelatedEventCard({ event }: { event: IEventData }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-coral/25"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <CardImage src={event.flyer || event.image} title={event.title} sizes="(max-width: 640px) 100vw, 33vw" />
        <div className="absolute left-3 top-3 flex flex-col items-center rounded-xl bg-white/90 px-2.5 py-1 shadow-xs backdrop-blur-xs">
          <span className="text-sm font-bold leading-none text-navy">
            {getDayNum(event.date)}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-coral">
            {getMonthAbbr(event.date)}
          </span>
        </div>
      </div>
      <div className="p-4">
        {event.organizer && (
          <span className="mb-1.5 inline-flex items-center rounded-full bg-navy/5 px-2 py-0.5 text-[10px] font-medium text-navy/70">
            {event.organizer}
          </span>
        )}
        <h3 className="text-sm font-semibold leading-snug text-navy transition-colors group-hover:text-coral">
          {event.title}
        </h3>
      </div>
    </Link>
  );
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) notFound();

  const relatedEvents = await getRelatedEvents(id);

  const formattedDate = new Date(event.date).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eventUrl = `${SITE_URL}/events/${id}`;

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: new Date(event.date).toISOString(),
    location: event.location ? {
      "@type": "Place",
      name: event.location,
    } : undefined,
    organizer: event.organizer ? {
      "@type": "Organization",
      name: event.organizer,
    } : undefined,
    image: event.flyer || event.image,
    url: eventUrl,
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <header className="absolute top-0 z-10 w-full">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
          <Link
            href={`/#${SECTION_IDS.calendario}`}
            className="cursor-pointer text-xs font-medium text-white/70 transition-colors duration-200 hover:text-white uppercase tracking-[0.15em]"
          >
            &larr; Volver al calendario
          </Link>
        </div>
      </header>

      <section className="relative flex min-h-[55dvh] items-center justify-center overflow-hidden">
        <EventHeroImage src={event.flyer || event.image} title={event.title} />

        <div className="relative z-1 mx-auto max-w-2xl px-6 text-center">
          <p className="mb-4 text-xs font-medium text-coral uppercase tracking-[0.25em]">
            {formattedDate} {event.time && `— ${event.time} hs`}
          </p>
          <h1 className="text-3xl font-light leading-tight text-white sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>
        </div>
      </section>

      <main className="flex-1 px-6 py-16 sm:py-20">
        <article className="mx-auto max-w-2xl">
          <EventCountdown date={event.date} time={event.time} />

          <div className="mb-6 flex flex-wrap gap-3">
            {event.organizer && (
              <span className="inline-flex items-center rounded-full bg-navy/5 px-3 py-1 text-xs font-medium text-navy/70">
                {event.organizer}
              </span>
            )}
            {event.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/20 px-3 py-1 text-xs text-taupe">
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {event.location}
              </span>
            )}
          </div>

          {event.description && (
            <div className="prose prose-sm max-w-none text-taupe">
              <p className="leading-relaxed">{event.description}</p>
            </div>
          )}

          <hr className="my-10 border-muted/30" />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              <Link href={`/#${SECTION_IDS.calendario}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={16} />
                </Button>
              </Link>
              {event.instagram && (
                <Button
                  variant="ghost"
                  size="sm"
                  href={event.instagram.startsWith("http") ? event.instagram : `${INSTAGRAM_BASE_URL}${event.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </Button>
              )}
              {event.googleMaps && (
                <Button
                  variant="ghost"
                  size="sm"
                  href={event.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin size={16} />
                </Button>
              )}
              <EventAddToCalendar
                title={event.title}
                date={event.date}
                time={event.time}
                description={event.description}
                location={event.location}
              />
            </div>

            <EventShare
              title={event.title}
              description={event.description}
              phone={event.phone}
              url={eventUrl}
            />
          </div>
        </article>

        {relatedEvents.length > 0 && (
          <section className="mx-auto mt-32 max-w-5xl">
            <div className="mb-12 flex items-center gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-muted/50 to-transparent" />
              <h2 className="shrink-0 text-center text-2xl font-light text-navy sm:text-3xl">
                Otros <span className="font-semibold">eventos</span>
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-muted/50 to-transparent" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.map((related) => (
                <RelatedEventCard key={related.id} event={related} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
