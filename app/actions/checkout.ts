"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { calculateTotals } from "@/lib/cart";
import { generateOrderNumber, pickI18n } from "@/lib/utils";
import { env } from "@/lib/env";
import { auth } from "@/lib/auth";

const schema = z.object({
  cartId: z.string().cuid(),
  address: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    postalCode: z.string().min(3),
    region: z.string().optional(),
    country: z.string().length(2),
    notes: z.string().optional(),
  }),
});

export async function createCheckoutSession(
  input: z.infer<typeof schema>,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Datos no válidos" };

  const { cartId, address } = parsed.data;
  const session = await auth();

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: { include: { product: { include: { images: { take: 1, orderBy: { position: "asc" } } } }, variant: true } },
      coupon: true,
    },
  });
  if (!cart || cart.items.length === 0) return { ok: false, error: "Carrito vacío" };

  // Verificar stock
  for (const item of cart.items) {
    if (item.variant.stock < item.quantity) {
      return { ok: false, error: `Sin stock suficiente: ${pickI18n(item.product.name, "es")}` };
    }
  }

  const totals = calculateTotals({
    items: cart.items.map((i) => ({ unitPriceCents: i.unitPriceCents, quantity: i.quantity })),
    coupon: cart.coupon
      ? { type: cart.coupon.type, value: cart.coupon.value, minSubtotalCents: cart.coupon.minSubtotalCents }
      : null,
    shippingCents: 590,
    taxRate: 0.21,
  });

  const order = await prisma.order.create({
    data: {
      number: generateOrderNumber(),
      userId: session?.user?.id ?? null,
      email: address.email,
      status: "PENDING",
      subtotalCents: totals.subtotalCents,
      discountCents: totals.discountCents,
      shippingCents: totals.shippingCents,
      taxCents: totals.taxCents,
      totalCents: totals.totalCents,
      shippingAddress: address as object,
      billingAddress: address as object,
      couponCode: cart.coupon?.code ?? null,
      couponId: cart.couponId,
      notes: address.notes ?? null,
      items: {
        create: cart.items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          productName: pickI18n(i.product.name, "es"),
          variantSku: i.variant.sku,
          variantSize: i.variant.sizeMl,
          imageUrl: i.product.images[0]?.url ?? null,
          unitPriceCents: i.unitPriceCents,
          quantity: i.quantity,
          totalCents: i.unitPriceCents * i.quantity,
        })),
      },
    },
  });

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? env.NEXT_PUBLIC_APP_URL;

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: address.email,
    line_items: cart.items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "eur",
        unit_amount: i.unitPriceCents,
        product_data: {
          name: pickI18n(i.product.name, "es"),
          description: `${i.variant.sizeMl} ml · SKU ${i.variant.sku}`,
          images: i.product.images[0]?.url ? [i.product.images[0].url] : undefined,
        },
      },
    })),
    shipping_options: totals.shippingCents > 0
      ? [
          {
            shipping_rate_data: {
              display_name: "Envío estándar",
              type: "fixed_amount",
              fixed_amount: { amount: totals.shippingCents, currency: "eur" },
            },
          },
        ]
      : undefined,
    metadata: { orderId: order.id, orderNumber: order.number },
    success_url: `${origin}/confirmacion/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/carrito`,
    locale: "es",
  });

  if (!stripeSession.url) return { ok: false, error: "No se pudo iniciar la sesión de pago" };

  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentIntentId: stripeSession.payment_intent as string | null },
  });

  return { ok: true, url: stripeSession.url };
}
