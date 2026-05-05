import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { CalendarDays, Download, List, Map as MapIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FairCard } from "@/components/ferias/FairCard";
import { FairsCalendarView } from "@/components/ferias/FairsCalendarView";
import { FairsMapView } from "@/components/ferias/FairsMapView";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { fairStatusFromDates } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 300;
export const metadata = buildMetadata({
  title: "Calendario de ferias",
  description: "Descubre dónde estaremos cada estación y huele las nuevas colecciones antes que nadie.",
  path: "/ferias",
});

type SearchParams = { country?: string; status?: string; view?: "list" | "calendar" | "map" };

export default async function FairsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const view = params.view ?? "list";
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("fairs");

  const where = {
    deletedAt: null,
    ...(params.country ? { country: params.country.toUpperCase() } : {}),
    ...(params.status && ["UPCOMING", "ONGOING", "PAST"].includes(params.status)
      ? { status: params.status as "UPCOMING" | "ONGOING" | "PAST" }
      : {}),
  };

  const [allActive, upcoming, past, countries] = await Promise.all([
    prisma.perfumeFair.findMany({ where, orderBy: { startDate: "asc" } }),
    prisma.perfumeFair.findMany({
      where: { ...where, status: { in: ["UPCOMING", "ONGOING"] } },
      orderBy: { startDate: "asc" },
    }),
    prisma.perfumeFair.findMany({
      where: { ...where, status: "PAST" },
      orderBy: { startDate: "desc" },
      take: 12,
    }),
    prisma.perfumeFair.groupBy({ by: ["country"], where: { deletedAt: null } }),
  ]);

  const enrich = <T extends { startDate: Date; endDate: Date; statusManual?: boolean; status: string }>(f: T) => ({
    ...f,
    status: f.statusManual ? f.status : fairStatusFromDates(f.startDate, f.endDate),
  });

  const buildHref = (next: Partial<SearchParams>) => {
    const qs = new URLSearchParams();
    const merged = { ...params, ...next };
    for (const [k, v] of Object.entries(merged)) {
      if (v) qs.set(k, String(v));
    }
    const query = qs.toString();
    return query ? `/ferias?${query}` : "/ferias";
  };

  const tabs = [
    { key: "list", label: t("viewList"), icon: List },
    { key: "calendar", label: t("viewCalendar"), icon: CalendarDays },
    { key: "map", label: t("viewMap"), icon: MapIcon },
  ] as const;

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16">
      <SectionHeader kicker="Donde estaremos" title={t("title")} subtitle={t("subtitle")} />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "", label: "Todas" },
            { key: "UPCOMING", label: t("upcoming") },
            { key: "ONGOING", label: t("ongoing") },
            { key: "PAST", label: t("past") },
          ].map((tab) => (
            <Link
              key={tab.label}
              href={buildHref({ status: tab.key as SearchParams["status"] })}
              className={`accent text-[0.7rem] px-4 py-2 rounded-full border ${
                (params.status ?? "") === tab.key
                  ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                  : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)] hover:border-[var(--color-gold-deep)]"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-[oklch(0.55_0.10_70_/_0.3)] p-0.5" role="tablist">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={buildHref({ view: tab.key })}
                role="tab"
                aria-selected={view === tab.key}
                className={`accent text-[0.65rem] flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                  view === tab.key
                    ? "bg-[var(--color-gold)] text-[var(--color-bg-deep)]"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" /> {tab.label}
              </Link>
            ))}
          </div>
          <a
            href="/api/ferias/ical"
            className="accent text-[0.7rem] inline-flex items-center gap-1.5 text-[var(--color-gold)] hover:text-[var(--color-gold-bright)]"
          >
            <Download className="h-3.5 w-3.5" /> {t("subscribe")}
          </a>
        </div>
      </div>

      {countries.length > 1 && (
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <span className="accent text-[0.65rem] text-[var(--color-ink-subtle)] mr-2">País:</span>
          <Link
            href={buildHref({ country: undefined })}
            className={`accent text-[0.65rem] px-3 py-1 rounded-full border ${
              !params.country
                ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)]"
            }`}
          >
            Todos
          </Link>
          {countries.map((c) => (
            <Link
              key={c.country}
              href={buildHref({ country: c.country })}
              className={`accent text-[0.65rem] px-3 py-1 rounded-full border ${
                params.country === c.country
                  ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                  : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)] hover:border-[var(--color-gold-deep)]"
              }`}
            >
              {c.country}
            </Link>
          ))}
        </div>
      )}

      {view === "list" && (
        upcoming.length === 0 && past.length === 0 ? (
          <p className="card-velvet p-12 text-center text-[var(--color-ink-muted)]">{t("noResults")}</p>
        ) : (
          <div className="space-y-6">
            {upcoming.map((fair) => (
              <FairCard key={fair.id} fair={enrich(fair)} locale={locale} />
            ))}
            {past.length > 0 && (
              <>
                <h2 className="display text-2xl mt-16 mb-6 text-[var(--color-ink-muted)]">Pasadas</h2>
                <div className="grid md:grid-cols-2 gap-6 opacity-80">
                  {past.map((fair) => (
                    <FairCard key={fair.id} fair={enrich(fair)} locale={locale} />
                  ))}
                </div>
              </>
            )}
          </div>
        )
      )}

      {view === "calendar" && (
        <FairsCalendarView
          fairs={allActive.map((f) => ({
            id: f.id,
            slug: f.slug,
            title: f.title as { es: string },
            startDate: f.startDate,
            endDate: f.endDate,
            city: f.city,
            country: f.country,
          }))}
        />
      )}

      {view === "map" && (
        <FairsMapView
          fairs={allActive.map((f) => ({
            id: f.id,
            slug: f.slug,
            title: f.title as { es: string },
            city: f.city,
            country: f.country,
            lat: f.lat,
            lng: f.lng,
          }))}
          maptilerKey={env.NEXT_PUBLIC_MAPTILER_KEY}
        />
      )}
    </div>
  );
}
