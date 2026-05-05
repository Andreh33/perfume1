import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getOrCreateCart, calculateTotals } from "@/lib/cart";
import { formatPriceCents, pickI18n } from "@/lib/utils";
import { CheckoutForm } from "./CheckoutForm";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export const metadata = buildMetadata({ title: "Checkout", path: "/checkout", noindex: true });
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const locale = (await getLocale()) as Locale;
  const cart = await getOrCreateCart();
  if (cart.items.length === 0) redirect("/carrito");

  const totals = calculateTotals({
    items: cart.items.map((i) => ({ unitPriceCents: i.unitPriceCents, quantity: i.quantity })),
    coupon: cart.coupon
      ? { type: cart.coupon.type, value: cart.coupon.value, minSubtotalCents: cart.coupon.minSubtotalCents }
      : null,
    shippingCents: 590,
    taxRate: 0.21,
  });

  return (
    <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-12">
      <h1 className="display text-3xl md:text-5xl mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        <CheckoutForm totalCents={totals.totalCents} cartId={cart.id} />

        <aside className="card-velvet p-6 space-y-4 lg:sticky lg:top-28 lg:self-start order-first lg:order-last">
          <h2 className="display text-xl">Resumen del pedido</h2>
          <ul className="space-y-3 text-sm">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="text-[var(--color-ink-muted)] line-clamp-2">
                  {pickI18n(item.product.name, locale)} · {item.variant.sizeMl} ml × {item.quantity}
                </span>
                <span className="shrink-0 tabular-nums">{formatPriceCents(item.unitPriceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <hr />
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPriceCents(totals.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Envío</dt>
              <dd>{totals.shippingCents === 0 ? "Gratis" : formatPriceCents(totals.shippingCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>IVA (21 %)</dt>
              <dd>{formatPriceCents(totals.taxCents)}</dd>
            </div>
            {totals.discountCents > 0 && (
              <div className="flex justify-between text-[var(--color-success)]">
                <dt>Descuento</dt>
                <dd>−{formatPriceCents(totals.discountCents)}</dd>
              </div>
            )}
          </dl>
          <hr />
          <div className="flex justify-between items-baseline">
            <span className="display text-lg">Total</span>
            <span className="display text-2xl gold-text">{formatPriceCents(totals.totalCents)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
