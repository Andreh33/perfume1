import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { email } from "@/lib/email";
import { assertCronAuth } from "@/lib/cron";
import { pickI18n } from "@/lib/utils";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await assertCronAuth();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const until = new Date(Date.now() - 1000 * 60 * 60 * 23);

  const carts = await prisma.cart.findMany({
    where: {
      updatedAt: { gte: since, lte: until },
      items: { some: {} },
      user: { isNot: null },
    },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1, orderBy: { position: "asc" } } } },
        },
      },
      user: { select: { email: true, name: true } },
    },
    take: 50,
  });

  let sent = 0;
  for (const cart of carts) {
    if (!cart.user?.email) continue;
    const first = cart.items[0];
    if (!first) continue;
    const result = await email.abandonedCart({
      to: cart.user.email,
      customerName: cart.user.name ?? "amiga",
      itemImage: first.product.images[0]?.url ?? "",
      itemName: pickI18n(first.product.name, cart.user.email.endsWith(".ar") ? "ar" : "es"),
      cartUrl: `${env.NEXT_PUBLIC_APP_URL}/carrito`,
    });
    if (result.ok) sent++;
  }

  return NextResponse.json({ candidates: carts.length, sent });
}
