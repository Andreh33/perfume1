import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { ShoppingBag, Trash2 } from "lucide-react";
import { getOrCreateCart, calculateTotals } from "@/lib/cart";
import { formatPriceCents, pickI18n } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export const metadata = buildMetadata({ title: "Carrito", path: "/carrito", noindex: true });
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const locale = (await getLocale()) as Locale;
  const cart = await getOrCreateCart();
  const totals = calculateTotals({
    items: cart.items.map((i) => ({ unitPriceCents: i.unitPriceCents, quantity: i.quantity })),
    coupon: cart.coupon
      ? { type: cart.coupon.type, value: cart.coupon.value, minSubtotalCents: cart.coupon.minSubtotalCents }
      : null,
    shippingCents: 590,
    taxRate: 0.21,
  });

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-[800px] px-6 py-32 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-[var(--color-gold)] mb-6" aria-hidden />
        <h1 className="display text-4xl mb-4">Tu carrito está vacío</h1>
        <p className="text-[var(--color-ink-muted)] mb-8">Descubre nuestra selección de perfumes árabes auténticos.</p>
        <Link href="/perfumes" className="btn-primary">
          Ver perfumes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16">
      <h1 className="display text-4xl md:text-5xl mb-10">Tu carrito</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        <ul className="space-y-4">
          {cart.items.map((item) => {
            const cover = item.product.images[0];
            return (
              <li key={item.id} className="card-velvet p-5 flex gap-5">
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-[var(--color-bg-night)]">
                  {cover && (
                    <Image src={cover.url} alt={pickI18n(item.product.name, locale)} fill sizes="96px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="display text-lg">{pickI18n(item.product.name, locale)}</h2>
                  <p className="text-xs text-[var(--color-ink-subtle)] mt-1">
                    {item.variant.sizeMl} ml · SKU {item.variant.sku}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <form action="/api/cart/update" method="post" className="flex items-center gap-2">
                      <input type="hidden" name="itemId" value={item.id} />
                      <select
                        name="quantity"
                        defaultValue={item.quantity}
                        className="field !py-1.5 !px-2 w-20 text-sm"
                      >
                        {Array.from({ length: 10 }).map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="text-xs text-[var(--color-gold)] hover:underline">
                        Actualizar
                      </button>
                    </form>
                    <p className="gold-text font-semibold">
                      {formatPriceCents(item.unitPriceCents * item.quantity)}
                    </p>
                  </div>
                </div>
                <form action="/api/cart/remove" method="post">
                  <input type="hidden" name="itemId" value={item.id} />
                  <button
                    type="submit"
                    aria-label="Eliminar"
                    className="text-[var(--color-ink-subtle)] hover:text-[var(--color-danger)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </li>
            );
          })}
        </ul>

        <aside className="card-velvet p-7 space-y-4 lg:sticky lg:top-28 lg:self-start">
          <h2 className="display text-2xl">Resumen</h2>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-muted)]">Subtotal</dt>
              <dd>{formatPriceCents(totals.subtotalCents)}</dd>
            </div>
            {totals.discountCents > 0 && (
              <div className="flex justify-between text-[var(--color-success)]">
                <dt>Descuento</dt>
                <dd>−{formatPriceCents(totals.discountCents)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-muted)]">Envío</dt>
              <dd>{totals.shippingCents === 0 ? "Gratis" : formatPriceCents(totals.shippingCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-muted)]">IVA (21 %)</dt>
              <dd>{formatPriceCents(totals.taxCents)}</dd>
            </div>
          </dl>

          <hr />

          <div className="flex justify-between items-baseline">
            <span className="display text-lg">Total</span>
            <span className="display text-2xl gold-text">{formatPriceCents(totals.totalCents)}</span>
          </div>

          <Button asChild className="w-full">
            <Link href="/checkout">Tramitar pedido</Link>
          </Button>

          <form action="/api/cart/coupon" method="post" className="flex gap-2 pt-2">
            <input
              name="code"
              placeholder="Código promocional"
              className="field flex-1 !py-2"
            />
            <button type="submit" className="accent text-[0.7rem] text-[var(--color-gold)] px-3">
              Aplicar
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
