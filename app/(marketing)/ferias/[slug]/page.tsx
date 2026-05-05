import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { Calendar, MapPin, ExternalLink, Ticket, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateRange, pickI18n } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fair = await prisma.perfumeFair.findUnique({ where: { slug } });
  if (!fair) return buildMetadata({ title: "Feria no encontrada", noindex: true });
  return buildMetadata({
    title: pickI18n(fair.title, "es"),
    description: pickI18n(fair.description, "es") || `${fair.city}, ${fair.country}`,
    path: `/ferias/${slug}`,
    image: fair.coverImage ?? undefined,
  });
}

export default async function FairDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const fair = await prisma.perfumeFair.findFirst({
    where: { slug, deletedAt: null },
  });
  if (!fair) notFound();

  const title = pickI18n(fair.title, locale);
  const desc = pickI18n(fair.description, locale);

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description: desc,
    startDate: fair.startDate.toISOString(),
    endDate: fair.endDate.toISOString(),
    eventStatus:
      fair.status === "CANCELLED"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: fair.venue ?? `${fair.city}, ${fair.country}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: fair.address ?? undefined,
        addressLocality: fair.city,
        addressCountry: fair.country,
      },
      ...(fair.lat && fair.lng
        ? { geo: { "@type": "GeoCoordinates", latitude: fair.lat, longitude: fair.lng } }
        : {}),
    },
    image: fair.coverImage ? [fair.coverImage] : undefined,
    url: `${env.NEXT_PUBLIC_APP_URL}/ferias/${slug}`,
    ...(fair.websiteUrl && {
      organizer: { "@type": "Organization", name: fair.venue ?? title, url: fair.websiteUrl },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <article>
        <header className="relative h-[60vh] min-h-[480px] overflow-hidden">
          {fair.coverImage ? (
            <Image
              src={fair.coverImage}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--color-bg-night)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.015_60)] via-[oklch(0.14_0.015_60_/_0.7)] to-[oklch(0.14_0.015_60_/_0.4)]" />

          <div className="relative h-full mx-auto max-w-[1280px] px-6 md:px-12 flex flex-col justify-end pb-16">
            <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-ink-subtle)] mb-4">
              <Link href="/ferias">← Calendario de ferias</Link>
            </nav>
            <p className="accent text-[0.7rem] text-[var(--color-gold)] mb-3">
              {fair.tags?.[0] ?? "Feria"}
            </p>
            <h1 className="display text-4xl md:text-7xl text-[var(--color-ink)] max-w-3xl">{title}</h1>
            <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-ink-muted)]">
              <li className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[var(--color-gold)]" aria-hidden />
                {formatDateRange(fair.startDate, fair.endDate, locale)}
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--color-gold)]" aria-hidden />
                {fair.venue ? `${fair.venue} · ` : ""}{fair.city}, {fair.country}
              </li>
            </ul>
          </div>
        </header>

        <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-16 grid lg:grid-cols-[1fr_360px] gap-12">
          <div className="space-y-8 prose-lg">
            {desc && (
              <p className="text-lg text-[var(--color-ink-muted)] leading-relaxed">{desc}</p>
            )}
            {fair.address && (
              <div>
                <h2 className="accent text-[0.7rem] text-[var(--color-gold)] mb-2">Dirección</h2>
                <p className="text-[var(--color-ink)]">{fair.address}</p>
              </div>
            )}
          </div>

          <aside className="card-velvet p-6 space-y-4 lg:sticky lg:top-28 lg:self-start">
            <h2 className="display text-xl">Asistir</h2>
            {fair.websiteUrl && (
              <a href={fair.websiteUrl} target="_blank" rel="noreferrer" className="btn-ghost w-full">
                <ExternalLink className="h-4 w-4" /> Web oficial
              </a>
            )}
            {fair.ticketUrl && (
              <a href={fair.ticketUrl} target="_blank" rel="noreferrer" className="btn-primary w-full">
                <Ticket className="h-4 w-4" /> Comprar entradas
              </a>
            )}
            <a href={`/api/ferias/ical?slug=${slug}`} className="btn-ghost w-full">
              <Download className="h-4 w-4" /> Añadir a mi calendario
            </a>

            {fair.lat && fair.lng && (
              <div className="aspect-square w-full rounded-md overflow-hidden border border-[oklch(0.55_0.10_70_/_0.25)] bg-[var(--color-bg-night)] grid place-items-center text-xs text-[var(--color-ink-subtle)]">
                Mapa: {fair.lat.toFixed(3)}, {fair.lng.toFixed(3)}
              </div>
            )}
          </aside>
        </div>
      </article>
    </>
  );
}
