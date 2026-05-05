import { notFound } from "next/navigation";
import Link from "next/link";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/utils";
import { OrderActions } from "./OrderActions";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: { select: { name: true, email: true } } },
  });
  if (!order) notFound();

  const ship = order.shippingAddress as {
    firstName?: string;
    lastName?: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="accent text-[0.65rem] text-[var(--color-gold)]">Pedido</p>
          <h1 className="display text-3xl">{order.number}</h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1">
            {new Intl.DateTimeFormat("es-ES", { dateStyle: "long", timeStyle: "short" }).format(order.createdAt)} · {order.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/api/orders/${order.id}/invoice`} target="_blank" rel="noreferrer" className="btn-ghost">
            <Download className="h-4 w-4" /> Descargar factura
          </a>
        </div>
      </header>

      <OrderActions
        id={order.id}
        status={order.status}
        carrier={order.carrier ?? ""}
        trackingNumber={order.trackingNumber ?? ""}
        trackingUrl={order.trackingUrl ?? ""}
      />

      <div className="grid md:grid-cols-[1.6fr_1fr] gap-6">
        <section className="card-velvet p-6 space-y-4">
          <h2 className="display text-xl">Productos</h2>
          <ul className="divide-y divide-[oklch(0.55_0.10_70_/_0.15)]">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="display text-base">{item.productName}</p>
                  <p className="text-xs text-[var(--color-ink-subtle)]">
                    {item.variantSize} ml · SKU {item.variantSku} · ×{item.quantity}
                  </p>
                </div>
                <span className="tabular-nums">{formatPriceCents(item.totalCents)}</span>
              </li>
            ))}
          </ul>
          <hr />
          <dl className="space-y-1 text-sm">
            <Row label="Subtotal" value={formatPriceCents(order.subtotalCents)} />
            <Row label="Envío" value={order.shippingCents === 0 ? "Gratis" : formatPriceCents(order.shippingCents)} />
            <Row label="IVA" value={formatPriceCents(order.taxCents)} />
            {order.discountCents > 0 && (
              <Row label="Descuento" value={`−${formatPriceCents(order.discountCents)}`} />
            )}
          </dl>
          <div className="flex justify-between items-baseline border-t border-[var(--color-gold-deep)] pt-3">
            <span className="display text-lg">Total</span>
            <span className="display text-2xl gold-text">{formatPriceCents(order.totalCents)}</span>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card-velvet p-6 text-sm space-y-2">
            <h3 className="display text-lg mb-2">Cliente</h3>
            <p>{order.user?.name ?? `${ship.firstName ?? ""} ${ship.lastName ?? ""}`.trim()}</p>
            <p className="text-[var(--color-ink-muted)]">{order.email}</p>
            {ship.phone && <p className="text-[var(--color-ink-muted)]">{ship.phone}</p>}
            {order.userId && (
              <Link href={`/admin/clientes/${order.userId}`} className="accent text-[0.65rem] text-[var(--color-gold)]">
                Ver cliente →
              </Link>
            )}
          </section>

          <section className="card-velvet p-6 text-sm space-y-1">
            <h3 className="display text-lg mb-2">Envío</h3>
            <p>{ship.line1}</p>
            {ship.line2 && <p>{ship.line2}</p>}
            <p>
              {ship.postalCode} {ship.city}
            </p>
            <p>{ship.country}</p>
          </section>

          {order.notes && (
            <section className="card-velvet p-6 text-sm">
              <h3 className="display text-lg mb-2">Nota del cliente</h3>
              <p className="text-[var(--color-ink-muted)]">{order.notes}</p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-[var(--color-ink-muted)]">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
