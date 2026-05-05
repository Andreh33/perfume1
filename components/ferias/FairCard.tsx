import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { formatDateRange, pickI18n } from "@/lib/utils";

type FairCardData = {
  slug: string;
  title: unknown;
  description?: unknown;
  startDate: Date;
  endDate: Date;
  city: string;
  country: string;
  venue?: string | null;
  coverImage?: string | null;
  websiteUrl?: string | null;
  isFeatured: boolean;
  status: "UPCOMING" | "ONGOING" | "PAST" | "CANCELLED";
  tags?: string[];
};

const statusLabels: Record<FairCardData["status"], { es: string; cls: string }> = {
  UPCOMING: { es: "Próxima", cls: "badge-outline" },
  ONGOING: { es: "En curso", cls: "badge-new" },
  PAST: { es: "Pasada", cls: "badge-limited" },
  CANCELLED: { es: "Cancelada", cls: "badge-outline" },
};

export function FairCard({ fair, locale = "es" }: { fair: FairCardData; locale?: string }) {
  const title = pickI18n(fair.title, locale);
  const desc = pickI18n(fair.description, locale);
  const startDay = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : locale, { day: "numeric" }).format(
    fair.startDate,
  );
  const startMonth = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : locale, { month: "short" }).format(
    fair.startDate,
  );
  const status = statusLabels[fair.status];

  return (
    <article className="card-velvet group relative overflow-hidden md:flex">
      <Link
        href={`/ferias/${fair.slug}`}
        className="relative block md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden"
        aria-label={title}
      >
        {fair.coverImage ? (
          <Image
            src={fair.coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-bg-night)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.015_60_/_0.7)] via-transparent to-transparent md:via-transparent" />
        <div className="absolute top-4 left-4 flex flex-col items-center gap-1 rounded-md bg-[oklch(0.14_0.015_60_/_0.85)] px-4 py-2 backdrop-blur-md">
          <span className="display text-3xl text-[var(--color-gold)] leading-none">{startDay}</span>
          <span className="accent text-[0.65rem] text-[var(--color-ink-muted)]">{startMonth}</span>
        </div>
      </Link>

      <div className="flex-1 p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${status.cls}`}>{status.es}</span>
          {fair.isFeatured && <span className="badge badge-gold">Destacada</span>}
          {fair.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="badge badge-outline">
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/ferias/${fair.slug}`}>
          <h3 className="display text-2xl md:text-3xl text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
            {title}
          </h3>
        </Link>

        <ul className="space-y-1.5 text-sm text-[var(--color-ink-muted)]">
          <li className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[var(--color-gold)]" aria-hidden />
            {formatDateRange(fair.startDate, fair.endDate, locale)}
          </li>
          <li className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--color-gold)]" aria-hidden />
            {fair.venue ? `${fair.venue} · ` : ""}{fair.city}, {fair.country}
          </li>
        </ul>

        {desc && <p className="text-sm line-clamp-2">{desc}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Link
            href={`/ferias/${fair.slug}`}
            className="accent text-[0.7rem] text-[var(--color-gold)] hover:text-[var(--color-gold-bright)]"
          >
            Ver detalle →
          </Link>
          {fair.websiteUrl && (
            <a
              href={fair.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="accent text-[0.7rem] text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] inline-flex items-center gap-1"
            >
              Web oficial <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <a
            href={`/api/ferias/ical?slug=${fair.slug}`}
            className="accent text-[0.7rem] text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]"
          >
            + Calendario
          </a>
        </div>
      </div>
    </article>
  );
}
