import Link from "next/link";
import { Plus, Copy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="display text-3xl">Cupones</h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1">{coupons.length} cupones</p>
        </div>
        <Link href="/admin/cupones/nuevo" className="btn-primary">
          <Plus className="h-4 w-4" /> Nuevo cupón
        </Link>
      </header>

      <div className="card-velvet overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[oklch(0.20_0.02_55)] text-left">
            <tr>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Código</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Tipo</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Valor</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Usos</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Vigencia</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-[oklch(0.55_0.10_70_/_0.15)]">
                <td className="px-5 py-4 font-mono tracking-wider text-[var(--color-gold)]">{c.code}</td>
                <td className="px-5 py-4 text-[var(--color-ink-muted)]">{c.type}</td>
                <td className="px-5 py-4">
                  {c.type === "PERCENT"
                    ? `${(c.value / 100).toFixed(0)} %`
                    : c.type === "FIXED"
                      ? formatPriceCents(c.value)
                      : "Envío gratis"}
                </td>
                <td className="px-5 py-4 tabular-nums">
                  {c.redemptions}
                  {c.maxRedemptions ? ` / ${c.maxRedemptions}` : ""}
                </td>
                <td className="px-5 py-4 text-xs text-[var(--color-ink-subtle)]">
                  {c.startsAt ? new Intl.DateTimeFormat("es-ES").format(c.startsAt) : "—"}
                  {" · "}
                  {c.endsAt ? new Intl.DateTimeFormat("es-ES").format(c.endsAt) : "—"}
                </td>
                <td className="px-5 py-4">
                  {c.isActive ? <span className="badge badge-new">Activo</span> : <span className="badge badge-outline">Pausado</span>}
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[var(--color-ink-subtle)]">
                  Sin cupones aún. <Link href="/admin/cupones/nuevo" className="text-[var(--color-gold)]">Crear el primero →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--color-ink-subtle)] flex items-center gap-1.5">
        <Copy className="h-3 w-3" /> Tip: pulsa un código para copiarlo al portapapeles.
      </p>
    </div>
  );
}
