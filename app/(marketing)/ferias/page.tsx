import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { CalendarDays, Download, List, Map as MapIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FairCard } from "@/components/ferias/FairCard";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { fairStatusFromDates } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 300;
export const metadata = buildMetadata({
  title: "Calendario de ferias",
  description: "Descubre dónde estaremos cada estación y huele las nuevas colecciones antes que nadie.",
  path: "/ferias",
});

type SearchParams = { country?: string; status?: string };

export default async function FairsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("fairs");

  const where = {
    deletedAt: null,
    ...(params.country ? { country: params.country.toUpperCase() } : {}),
    ...(params.status && ["UPCOMING", "ONGOING", "PAST"].includes(params.status)
      ? { status: params.status as "UPCOMING" | "ONGOING" | "PAST" }
      : {}),
  };

  const [upcoming, past, countries] = await Promise.all([
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

  // recalcular estado dinámicamente para que sea coherente con la fecha actual
  const enrich = <T extends { startDate: Date; endDate: Date; statusManual?: boolean; status: string }>(f: T) => ({
    ...f,
    status: f.statusManual ? f.status : fairStatusFromDates(f.startDate, f.endDate),
  });

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16">
      <SectionHeader kicker="Donde estaremos" title={t("title")} subtitle={t("subtitle")} />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/ferias"
            className={`accent text-[0.7rem] px-4 py-2 rounded-full border ${!params.status ? "border-[var(--color-gold)] text-[var(--color-gold)]" : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)] hover:border-[var(--color-gold-deep)]"}`}
          >
            Todas
          </Link>
          <Link
            href="/ferias?status=UPCOMING"
            className={`accent text-[0.7rem] px-4 py-2 rounded-full border ${params.status === "UPCOMING" ? "border-[var(--color-gold)] text-[var(--color-gold)]" : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)]"}`}
          >
            {t("upcoming")}
          </Link>
          <Link
            href="/ferias?status=ONGOING"
            className={`accent text-[0.7rem] px-4 py-2 rounded-full border ${params.status === "ONGOING" ? "border-[var(--color-gold)] text-[var(--color-gold)]" : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)]"}`}
          >
            {t("ongoing")}
          </Link>
          <Link
            href="/ferias?status=PAST"
            className={`accent text-[0.7rem] px-4 py-2 rounded-full border ${params.status === "PAST" ? "border-[var(--color-gold)] text-[var(--color-gold)]" : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)]"}`}
          >
            {t("past")}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-[oklch(0.55_0.10_70_/_0.3)] p-0.5" role="tablist" aria-label="Vista">
            <button type="button" className="accent text-[0.65rem] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-gold)] text-[var(--color-bg-deep)]" aria-pressed="true">
              <List className="h-3.5 w-3.5" /> {t("viewList")}
            </button>
            <button type="button" className="accent text-[0.65rem] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[var(--color-ink-muted)]" disabled aria-pressed="false">
              <CalendarDays className="h-3.5 w-3.5" /> {t("viewCalendar")}
            </button>
            <button type="button" className="accent text-[0.65rem] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[var(--color-ink-muted)]" disabled aria-pressed="false">
              <MapIcon className="h-3.5 w-3.5" /> {t("viewMap")}
            </button>
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
          {countries.map((c) => (
            <Link
              key={c.country}
              href={`/ferias?country=${c.country}`}
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

      {upcoming.length === 0 && past.length === 0 ? (
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
      )}
    </div>
  );
}
