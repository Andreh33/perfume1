"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { email } from "@/lib/email";
import { env } from "@/lib/env";

const statusSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
});

export async function setOrderStatusAction(input: z.infer<typeof statusSchema>) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return { ok: false as const, error: "No autorizado" };
  }

  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos" };

  const before = await prisma.order.findUnique({ where: { id: parsed.data.id } });
  const order = await prisma.order.update({
    where: { id: parsed.data.id },
    data: {
      status: parsed.data.status,
      shippedAt: parsed.data.status === "SHIPPED" ? new Date() : before?.shippedAt,
      deliveredAt: parsed.data.status === "DELIVERED" ? new Date() : before?.deliveredAt,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "order.status",
      entity: "Order",
      entityId: order.id,
      before: before as object | null,
      after: order as unknown as object,
    },
  });

  revalidatePath(`/admin/pedidos/${order.id}`);
  revalidatePath("/admin/pedidos");
  return { ok: true as const };
}

const trackingSchema = z.object({
  id: z.string().cuid(),
  carrier: z.string().min(1),
  trackingNumber: z.string().min(1),
  trackingUrl: z.string().url().optional(),
  notify: z.boolean().default(true),
});

export async function setTrackingAction(input: z.infer<typeof trackingSchema>) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return { ok: false as const, error: "No autorizado" };
  }
  const parsed = trackingSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos" };

  const order = await prisma.order.update({
    where: { id: parsed.data.id },
    data: {
      carrier: parsed.data.carrier,
      trackingNumber: parsed.data.trackingNumber,
      trackingUrl: parsed.data.trackingUrl ?? null,
      status: "SHIPPED",
      shippedAt: new Date(),
    },
  });

  if (parsed.data.notify) {
    await email.orderShipped({
      to: order.email,
      orderNumber: order.number,
      customerName: (order.shippingAddress as { firstName?: string }).firstName ?? "Cliente",
      carrier: parsed.data.carrier,
      trackingNumber: parsed.data.trackingNumber,
      trackingUrl: parsed.data.trackingUrl ?? `${env.NEXT_PUBLIC_APP_URL}/cuenta/pedidos`,
    });
  }

  revalidatePath(`/admin/pedidos/${order.id}`);
  return { ok: true as const };
}

const refundSchema = z.object({ id: z.string().cuid(), amountCents: z.number().int().positive().optional() });

export async function refundOrderAction(input: z.infer<typeof refundSchema>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false as const, error: "No autorizado" };
  }
  const parsed = refundSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos" };

  const order = await prisma.order.findUnique({ where: { id: parsed.data.id } });
  if (!order?.stripePaymentIntentId) return { ok: false as const, error: "Sin payment intent" };

  await stripe.refunds.create({
    payment_intent: order.stripePaymentIntentId,
    amount: parsed.data.amountCents,
  });

  // El estado lo confirmará el webhook charge.refunded
  return { ok: true as const };
}
