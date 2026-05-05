"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const couponSchema = z.object({
  code: z.string().min(2).max(40).transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENT", "FIXED", "FREE_SHIPPING"]),
  value: z.number().int().nonnegative(),
  minSubtotalCents: z.number().int().nonnegative().default(0),
  maxRedemptions: z.number().int().positive().nullable().optional(),
  firstOrderOnly: z.boolean().default(false),
  startsAt: z.coerce.date().nullable().optional(),
  endsAt: z.coerce.date().nullable().optional(),
  isActive: z.boolean().default(true),
  description: z.string().max(280).optional(),
});

export async function saveCouponAction(args: { id?: string; data: z.infer<typeof couponSchema> }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return { ok: false as const, error: "No autorizado" };
  }

  const parsed = couponSchema.safeParse(args.data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const data = parsed.data;

  const before = args.id ? await prisma.coupon.findUnique({ where: { id: args.id } }) : null;

  const saved = args.id
    ? await prisma.coupon.update({ where: { id: args.id }, data })
    : await prisma.coupon.create({ data });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: args.id ? "coupon.update" : "coupon.create",
      entity: "Coupon",
      entityId: saved.id,
      before: before as object | null,
      after: saved as unknown as object,
    },
  });

  revalidatePath("/admin/cupones");
  return { ok: true as const, id: saved.id };
}
