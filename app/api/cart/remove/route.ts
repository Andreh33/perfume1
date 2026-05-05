import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.formData();
  const itemId = data.get("itemId")?.toString();
  if (itemId) await prisma.cartItem.delete({ where: { id: itemId } }).catch(() => undefined);
  return NextResponse.redirect(new URL("/carrito", req.url), 303);
}
