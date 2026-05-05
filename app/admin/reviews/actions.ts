"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function setReviewStatusAction(id: string, status: "PENDING" | "APPROVED" | "REJECTED") {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return { ok: false as const, error: "No autorizado" };
  }
  const before = await prisma.review.findUnique({ where: { id } });
  const after = await prisma.review.update({ where: { id }, data: { status } });
  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "review.moderate",
      entity: "Review",
      entityId: id,
      before: before as object | null,
      after: after as unknown as object,
    },
  });
  revalidatePath("/admin/reviews");
  return { ok: true as const };
}
