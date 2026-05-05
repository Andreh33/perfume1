import "server-only";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

const CART_COOKIE = "sol_cart";
const CART_TTL_DAYS = 30;

export type CartTotals = {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
};

export async function getOrCreateCart() {
  const session = await auth();
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get(CART_COOKIE)?.value ?? null;

  let cart = await prisma.cart.findFirst({
    where: session?.user?.id
      ? { userId: session.user.id }
      : sessionKey
        ? { sessionKey }
        : { id: "__never__" },
    include: {
      items: { include: { product: { include: { images: { take: 1, orderBy: { position: "asc" } } } }, variant: true } },
      coupon: true,
    },
  });

  if (!cart) {
    const key = sessionKey ?? crypto.randomUUID();
    cart = await prisma.cart.create({
      data: {
        userId: session?.user?.id ?? null,
        sessionKey: session?.user?.id ? null : key,
        expiresAt: new Date(Date.now() + CART_TTL_DAYS * 24 * 60 * 60 * 1000),
      },
      include: {
        items: { include: { product: { include: { images: { take: 1, orderBy: { position: "asc" } } } }, variant: true } },
        coupon: true,
      },
    });
    if (!session?.user?.id) {
      cookieStore.set(CART_COOKIE, key, {
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: CART_TTL_DAYS * 24 * 60 * 60,
      });
    }
  }

  return cart;
}

export function calculateTotals(args: {
  items: Array<{ unitPriceCents: number; quantity: number }>;
  coupon?: { type: "PERCENT" | "FIXED" | "FREE_SHIPPING"; value: number; minSubtotalCents: number } | null;
  shippingCents?: number;
  taxRate?: number;
}): CartTotals {
  const subtotalCents = args.items.reduce((acc, i) => acc + i.unitPriceCents * i.quantity, 0);

  let discountCents = 0;
  let shippingCents = args.shippingCents ?? 0;

  if (args.coupon && subtotalCents >= args.coupon.minSubtotalCents) {
    if (args.coupon.type === "PERCENT") {
      discountCents = Math.floor((subtotalCents * args.coupon.value) / 10000);
    } else if (args.coupon.type === "FIXED") {
      discountCents = Math.min(args.coupon.value, subtotalCents);
    } else if (args.coupon.type === "FREE_SHIPPING") {
      shippingCents = 0;
    }
  }

  const afterDiscount = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.round(afterDiscount * (args.taxRate ?? 0));
  const totalCents = afterDiscount + shippingCents + taxCents;

  return { subtotalCents, discountCents, shippingCents, taxCents, totalCents };
}
