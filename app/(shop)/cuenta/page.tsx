import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPriceCents } from "@/lib/utils";

export default async function AccountHome() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [recentOrders, wishlistCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { items: { take: 3 } },
    }),
    prisma.wishlistItem.count({ where: { wishlist: { userId: session.user.id } } }),
  ]);

  return (
    <div className="space-y-10">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Pedidos" value={recentOrders.length.toString()} />
        <Stat label="Favoritos" value={wishlistCount.toString()} />
        <Stat label="Estado" value="VIP" />
      </div>

      <section>
        <header className="mb-5 flex items-center justify-between">
          <h2 className="display text-2xl">Pedidos recientes</h2>
          <Link href="/cuenta/pedidos" className="accent text-[0.7rem] text-[var(--color-gold)]">
            Ver todos →
          </Link>
        </header>
        {recentOrders.length === 0 ? (
          <p className="card-velvet p-8 text-[var(--color-ink-muted)]">Aún no has hecho ningún pedido.</p>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id} className="card-velvet p-5 flex items-center justify-between">
                <div>
                  <p className="accent text-[0.7rem] text-[var(--color-gold)]">{order.status}</p>
                  <p className="display text-lg">{order.number}</p>
                  <p className="text-xs text-[var(--color-ink-subtle)]">
                    {new Intl.DateTimeFormat("es-ES").format(order.createdAt)} · {order.items.length} productos
                  </p>
                </div>
                <p className="gold-text font-semibold">{formatPriceCents(order.totalCents)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-velvet p-6 text-center">
      <p className="accent text-[0.65rem] text-[var(--color-gold)] mb-2">{label}</p>
      <p className="display text-3xl">{value}</p>
    </div>
  );
}
