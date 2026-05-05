import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.formData();
  const itemId = data.get("itemId")?.toString();
  const quantity = Number(data.get("quantity") ?? 1);
  if (!itemId) return NextResponse.redirect(new URL("/carrito", req.url), 303);

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  return NextResponse.redirect(new URL("/carrito", req.url), 303);
}
