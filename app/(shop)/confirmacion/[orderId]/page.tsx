import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Confirmación de pedido", noindex: true });
export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-[760px] px-6 md:px-12 py-20 text-center">
      <Sparkles className="mx-auto h-14 w-14 text-[var(--color-gold)] mb-6 animate-pulse-gold" aria-hidden />
      <p className="accent text-[0.7rem] text-[var(--color-gold)] mb-3">Pedido confirmado</p>
      <h1 className="display text-4xl md:text-6xl mb-4">Gracias por tu confianza</h1>
      <p className="text-lg text-[var(--color-ink-muted)] mb-10">
        Tu pedido <span className="text-[var(--color-gold)]">{order.number}</span> ha sido recibido.
        Te hemos enviado un email de confirmación a <strong>{order.email}</strong>.
      </p>

      <article className="card-velvet p-7 text-left space-y-4 mb-8">
        <h2 className="display text-2xl">Resumen</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.productName} · {item.variantSize} ml × {item.quantity}
              </span>
              <span className="tabular-nums">{formatPriceCents(item.totalCents)}</span>
            </li>
          ))}
        </ul>
        <hr />
        <div className="flex justify-between items-baseline">
          <span className="display text-lg">Total</span>
          <span className="display text-2xl gold-text">{formatPriceCents(order.totalCents)}</span>
        </div>
      </article>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/perfumes" className="btn-ghost">
          Seguir descubriendo
        </Link>
        <Link href="/cuenta/pedidos" className="btn-primary">
          Ver mis pedidos
        </Link>
      </div>
    </div>
  );
}
