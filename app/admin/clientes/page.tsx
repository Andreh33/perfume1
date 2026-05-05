import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER", deletedAt: null },
    include: {
      _count: { select: { orders: true } },
      orders: { select: { totalCents: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-3xl">Clientes</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">{customers.length} clientes</p>
      </header>

      <div className="card-velvet overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[oklch(0.20_0.02_55)] text-left">
            <tr>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Cliente</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Pedidos</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">LTV</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Alta</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const ltv = c.orders.reduce((acc, o) => acc + o.totalCents, 0);
              return (
                <tr key={c.id} className="border-t border-[oklch(0.55_0.10_70_/_0.15)]">
                  <td className="px-5 py-4">
                    <p className="display">{c.name ?? "—"}</p>
                    <p className="text-xs text-[var(--color-ink-subtle)]">{c.email}</p>
                  </td>
                  <td className="px-5 py-4 tabular-nums">{c._count.orders}</td>
                  <td className="px-5 py-4 tabular-nums">{formatPriceCents(ltv)}</td>
                  <td className="px-5 py-4 text-xs text-[var(--color-ink-subtle)]">
                    {new Intl.DateTimeFormat("es-ES").format(c.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
