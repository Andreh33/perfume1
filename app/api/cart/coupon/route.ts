import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/lib/cart";

export async function POST(req: Request) {
  const data = await req.formData();
  const code = data.get("code")?.toString().trim().toUpperCase();
  if (!code) return NextResponse.redirect(new URL("/carrito", req.url), 303);

  const cart = await getOrCreateCart();
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.isActive || coupon.deletedAt) {
    return NextResponse.redirect(new URL("/carrito?coupon=invalid", req.url), 303);
  }
  const now = new Date();
  if ((coupon.startsAt && coupon.startsAt > now) || (coupon.endsAt && coupon.endsAt < now)) {
    return NextResponse.redirect(new URL("/carrito?coupon=expired", req.url), 303);
  }

  await prisma.cart.update({ where: { id: cart.id }, data: { couponId: coupon.id } });
  return NextResponse.redirect(new URL("/carrito?coupon=ok", req.url), 303);
}
