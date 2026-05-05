import Link from "next/link";
import { Download } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { take: 4 } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="card-velvet p-12 text-center space-y-3">
        <p className="display text-2xl">Aún no has hecho ningún pedido</p>
        <Link href="/perfumes" className="btn-primary mt-2 inline-flex">Hacer mi primer pedido</Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.id} className="card-velvet p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="accent text-[0.7rem] text-[var(--color-gold)]">{o.status}</p>
              <p className="display text-lg">{o.number}</p>
              <p className="text-xs text-[var(--color-ink-subtle)]">
                {new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(o.createdAt)} · {o.items.length} productos
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <span className="display text-xl gold-text">{formatPriceCents(o.totalCents)}</span>
              <a
                href={`/api/orders/${o.id}/invoice`}
                target="_blank"
                rel="noreferrer"
                className="accent text-[0.65rem] inline-flex items-center gap-1 text-[var(--color-gold)] hover:text-[var(--color-gold-bright)]"
              >
                <Download className="h-3 w-3" /> Factura
              </a>
            </div>
          </div>
          {o.trackingNumber && (
            <p className="text-xs text-[var(--color-ink-muted)]">
              Seguimiento: <span className="font-mono">{o.trackingNumber}</span>
              {o.trackingUrl && (
                <> · <a href={o.trackingUrl} className="text-[var(--color-gold)]" target="_blank" rel="noreferrer">Ver en {o.carrier}</a></>
              )}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
