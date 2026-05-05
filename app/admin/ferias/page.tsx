import Link from "next/link";
import { Plus, MapPin, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateRange, pickI18n } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminFairsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const fairs = await prisma.perfumeFair.findMany({
    where: {
      deletedAt: null,
      ...(status ? { status: status as "UPCOMING" | "ONGOING" | "PAST" | "CANCELLED" } : {}),
    },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="display text-3xl">Ferias</h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1">{fairs.length} eventos</p>
        </div>
        <Link href="/admin/ferias/nueva" className="btn-primary">
          <Plus className="h-4 w-4" /> Nueva feria
        </Link>
      </header>

      <nav className="flex gap-2" aria-label="Filtro estado">
        {[
          { key: "", label: "Todas" },
          { key: "UPCOMING", label: "Próximas" },
          { key: "ONGOING", label: "En curso" },
          { key: "PAST", label: "Pasadas" },
          { key: "CANCELLED", label: "Canceladas" },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.key ? `/admin/ferias?status=${tab.key}` : "/admin/ferias"}
            className={`accent text-[0.7rem] px-4 py-2 rounded-full border ${
              (status ?? "") === tab.key
                ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="card-velvet overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[oklch(0.20_0.02_55)] text-left">
            <tr>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Feria</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Fechas</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Ubicación</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {fairs.map((f) => (
              <tr key={f.id} className="border-t border-[oklch(0.55_0.10_70_/_0.15)] hover:bg-[oklch(0.78_0.13_82_/_0.04)]">
                <td className="px-5 py-4">
                  <Link href={`/admin/ferias/${f.id}`} className="flex items-center gap-2 hover:text-[var(--color-gold)]">
                    <span className="display">{pickI18n(f.title, "es")}</span>
                    {f.isFeatured && <span className="badge badge-gold">★</span>}
                  </Link>
                  <p className="text-xs text-[var(--color-ink-subtle)] mt-0.5">{f.slug}</p>
                </td>
                <td className="px-5 py-4 text-[var(--color-ink-muted)]">
                  <Calendar className="inline h-3.5 w-3.5 mr-1" />
                  {formatDateRange(f.startDate, f.endDate)}
                </td>
                <td className="px-5 py-4 text-[var(--color-ink-muted)]">
                  <MapPin className="inline h-3.5 w-3.5 mr-1" />
                  {f.city}, {f.country}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={f.status} />
                </td>
              </tr>
            ))}
            {fairs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-[var(--color-ink-subtle)]">
                  No hay ferias. <Link href="/admin/ferias/nueva" className="text-[var(--color-gold)]">Crear la primera →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    UPCOMING: "badge-outline",
    ONGOING: "badge-new",
    PAST: "badge-limited",
    CANCELLED: "badge-outline",
  };
  return <span className={`badge ${map[status] ?? "badge-outline"}`}>{status}</span>;
}
