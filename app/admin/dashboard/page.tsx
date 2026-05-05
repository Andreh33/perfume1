import Link from "next/link";
import { TrendingUp, Package, ShoppingCart, Calendar, MessageSquare, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPriceCents, formatDateRange, pickI18n } from "@/lib/utils";
import { startOfDay, subDays, startOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(new Date());

  const [salesToday, salesMonth, pendingOrders, productsLow, recentOrders, pendingReviews, upcomingFairs] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { totalCents: true },
        _count: true,
        where: { createdAt: { gte: today }, status: { not: "CANCELLED" } },
      }),
      prisma.order.aggregate({
        _sum: { totalCents: true },
        _count: true,
        where: { createdAt: { gte: monthStart }, status: { not: "CANCELLED" } },
      }),
      prisma.order.count({ where: { status: { in: ["PENDING", "PAID", "PROCESSING"] } } }),
      prisma.productVariant.count({ where: { stock: { lte: 3 }, isActive: true } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { items: { take: 1 } },
      }),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.perfumeFair.findMany({
        where: { status: "UPCOMING", startDate: { gte: subDays(new Date(), 30) } },
        orderBy: { startDate: "asc" },
        take: 4,
      }),
    ]);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="display text-3xl md:text-4xl">Dashboard</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">Visión general de la tienda</p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          icon={TrendingUp}
          label="Ventas hoy"
          value={formatPriceCents(salesToday._sum.totalCents ?? 0)}
          hint={`${salesToday._count} pedidos`}
        />
        <Kpi
          icon={TrendingUp}
          label="Ventas este mes"
          value={formatPriceCents(salesMonth._sum.totalCents ?? 0)}
          hint={`${salesMonth._count} pedidos`}
        />
        <Kpi
          icon={ShoppingCart}
          label="Pedidos pendientes"
          value={pendingOrders.toString()}
          hint="por procesar"
          accent={pendingOrders > 0}
        />
        <Kpi
          icon={Package}
          label="Stock crítico"
          value={productsLow.toString()}
          hint="variantes ≤ 3 uds"
          accent={productsLow > 0}
        />
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card-velvet p-6">
          <header className="flex items-center justify-between mb-5">
            <h2 className="display text-xl">Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="accent text-[0.65rem] text-[var(--color-gold)]">
              Ver todos →
            </Link>
          </header>
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between text-sm">
                <Link href={`/admin/pedidos/${order.id}`} className="hover:text-[var(--color-gold)]">
                  <p className="font-medium">{order.number}</p>
                  <p className="text-xs text-[var(--color-ink-subtle)]">
                    {order.email} · {order.status}
                  </p>
                </Link>
                <span className="tabular-nums">{formatPriceCents(order.totalCents)}</span>
              </li>
            ))}
            {recentOrders.length === 0 && <li className="text-sm text-[var(--color-ink-subtle)]">Sin pedidos.</li>}
          </ul>
        </section>

        <section className="card-velvet p-6">
          <header className="flex items-center justify-between mb-5">
            <h2 className="display text-xl">Próximas ferias</h2>
            <Link href="/admin/ferias" className="accent text-[0.65rem] text-[var(--color-gold)]">
              Gestionar →
            </Link>
          </header>
          <ul className="space-y-3">
            {upcomingFairs.map((fair) => (
              <li key={fair.id} className="flex items-start gap-3 text-sm">
                <Calendar className="h-4 w-4 mt-0.5 text-[var(--color-gold)]" />
                <div>
                  <p className="font-medium">{pickI18n(fair.title, "es")}</p>
                  <p className="text-xs text-[var(--color-ink-subtle)]">
                    {formatDateRange(fair.startDate, fair.endDate)} · {fair.city}
                  </p>
                </div>
              </li>
            ))}
            {upcomingFairs.length === 0 && <li className="text-sm text-[var(--color-ink-subtle)]">Sin ferias próximas.</li>}
          </ul>
        </section>

        {pendingReviews > 0 && (
          <section className="card-velvet p-6 lg:col-span-2 border-l-4 border-l-[var(--color-warning)]">
            <header className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-5 w-5 text-[var(--color-warning)]" />
              <h2 className="display text-xl">Reseñas pendientes</h2>
            </header>
            <p className="text-sm text-[var(--color-ink-muted)]">
              Tienes <strong>{pendingReviews}</strong> reseñas esperando moderación.{" "}
              <Link href="/admin/reseñas" className="text-[var(--color-gold)] hover:underline">
                Revisar ahora
              </Link>
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className={`card-velvet p-5 ${accent ? "border-l-4 border-l-[var(--color-warning)]" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="accent text-[0.65rem] text-[var(--color-ink-subtle)]">{label}</p>
        {accent ? (
          <AlertTriangle className="h-4 w-4 text-[var(--color-warning)]" />
        ) : (
          <Icon className="h-4 w-4 text-[var(--color-gold)]" />
        )}
      </div>
      <p className="display text-2xl">{value}</p>
      {hint && <p className="text-xs text-[var(--color-ink-subtle)] mt-1">{hint}</p>}
    </div>
  );
}
