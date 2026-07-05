import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getEvent } from "@/lib/get-event";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) return { title: "Evento no encontrado" };

  return {
    title: event.title,
    description: event.description,
  };
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) notFound();

  const formattedDate = new Date(event.date).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="absolute top-0 z-10 w-full">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
          <Link
            href="/#calendario"
            className="cursor-pointer text-xs font-medium text-white/70 transition-colors duration-200 hover:text-white uppercase tracking-[0.15em]"
          >
            &larr; Volver al calendario
          </Link>
        </div>
      </header>

      <section className="relative flex min-h-[55dvh] items-center justify-center overflow-hidden">
        {(event.flyer || event.image) ? (
          <Image
            src={event.flyer ?? event.image!}
            alt={event.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#06101f] via-navy to-navy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

        <div className="relative z-1 mx-auto max-w-2xl px-6 text-center">
          <p className="mb-4 text-xs font-medium text-coral uppercase tracking-[0.25em]">
            {formattedDate}
          </p>
          <h1 className="text-3xl font-light leading-tight text-white sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>
        </div>
      </section>

      <main className="flex-1 px-6 py-16 sm:py-20">
        <article className="mx-auto max-w-2xl">
          <div className="mb-8 flex flex-wrap gap-3">
            {event.organizer && (
              <span className="inline-flex items-center rounded-full bg-navy/5 px-3 py-1 text-xs font-medium text-navy/70">
                {event.organizer}
              </span>
            )}
            {event.time && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/20 px-3 py-1 text-xs text-taupe">
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {event.time} hs
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
            <p className="mb-10 text-sm leading-relaxed text-taupe">
              {event.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Link href="/#calendario">
              <Button variant="outline">Volver al calendario</Button>
            </Link>
            {event.instagram && (
              <a href={event.instagram.startsWith("http") ? event.instagram : `https://instagram.com/${event.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                <Button>Instagram</Button>
              </a>
            )}
            {event.googleMaps && (
              <a href={event.googleMaps} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                <Button variant="secondary">Ver en mapa</Button>
              </a>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
