import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { email } from "@/lib/email";
import { assertCronAuth } from "@/lib/cron";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await assertCronAuth();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 8);
  const until = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

  const orders = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      deliveredAt: { gte: since, lte: until },
    },
    include: {
      items: { take: 1, select: { productName: true } },
    },
    take: 100,
  });

  let sent = 0;
  for (const order of orders) {
    const result = await email.reviewRequest({
      to: order.email,
      customerName: (order.shippingAddress as { firstName?: string }).firstName ?? "amiga",
      productName: order.items[0]?.productName ?? "tu perfume",
      reviewUrl: `${env.NEXT_PUBLIC_APP_URL}/cuenta/pedidos`,
    });
    if (result.ok) sent++;
  }

  return NextResponse.json({ candidates: orders.length, sent });
}
