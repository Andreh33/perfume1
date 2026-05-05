"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/lib/cart";

const addSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid(),
  quantity: z.number().int().min(1).max(20),
});

export async function addToCartAction(input: z.infer<typeof addSchema>) {
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Datos inválidos" };

  const cart = await getOrCreateCart();
  const variant = await prisma.productVariant.findUnique({
    where: { id: parsed.data.variantId },
  });
  if (!variant || !variant.isActive) return { ok: false, error: "Variante no disponible" };
  if (variant.stock < parsed.data.quantity) return { ok: false, error: "Stock insuficiente" };

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId: variant.id } },
    update: { quantity: { increment: parsed.data.quantity } },
    create: {
      cartId: cart.id,
      productId: parsed.data.productId,
      variantId: variant.id,
      quantity: parsed.data.quantity,
      unitPriceCents: variant.priceCents,
    },
  });

  revalidatePath("/carrito");
  return { ok: true };
}

const updateSchema = z.object({
  itemId: z.string().cuid(),
  quantity: z.number().int().min(0).max(20),
});

export async function updateCartItemAction(input: z.infer<typeof updateSchema>) {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Datos inválidos" };

  if (parsed.data.quantity === 0) {
    await prisma.cartItem.delete({ where: { id: parsed.data.itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: parsed.data.itemId },
      data: { quantity: parsed.data.quantity },
    });
  }
  revalidatePath("/carrito");
  return { ok: true };
}
