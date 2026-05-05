import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status: status as "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" } : {}),
      ...(q
        ? {
            OR: [
              { number: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="display text-3xl">Pedidos</h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1">{orders.length} resultados</p>
        </div>
      </header>

      <form className="flex gap-3">
        <input name="q" defaultValue={q ?? ""} placeholder="Nº pedido o email…" className="field max-w-sm" />
        <select name="status" defaultValue={status ?? ""} className="field max-w-[180px]">
          <option value="">Todos los estados</option>
          {["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </form>

      <div className="card-velvet overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[oklch(0.20_0.02_55)] text-left">
            <tr>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Pedido</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Cliente</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Items</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Total</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Estado</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-t border-[oklch(0.55_0.10_70_/_0.15)] hover:bg-[oklch(0.78_0.13_82_/_0.04)]"
              >
                <td className="px-5 py-4">
                  <Link href={`/admin/pedidos/${o.id}`} className="display hover:text-[var(--color-gold)]">
                    {o.number}
                  </Link>
                </td>
                <td className="px-5 py-4 text-[var(--color-ink-muted)]">{o.email}</td>
                <td className="px-5 py-4 tabular-nums text-[var(--color-ink-muted)]">{o._count.items}</td>
                <td className="px-5 py-4 tabular-nums">{formatPriceCents(o.totalCents)}</td>
                <td className="px-5 py-4"><span className="badge badge-outline">{o.status}</span></td>
                <td className="px-5 py-4 text-xs text-[var(--color-ink-subtle)]">
                  {new Intl.DateTimeFormat("es-ES").format(o.createdAt)}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[var(--color-ink-subtle)]">
                  No hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
