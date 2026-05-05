"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateSettingAction(args: { key: string; value: unknown }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false as const, error: "No autorizado" };
  }

  await prisma.setting.upsert({
    where: { key: args.key },
    update: { value: args.value as object },
    create: { key: args.key, value: args.value as object },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "setting.update",
      entity: "Setting",
      entityId: args.key,
      after: { value: args.value } as object,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true as const };
}
