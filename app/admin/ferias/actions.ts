"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fairSchema, type FairInput } from "@/lib/validations/fair";

export async function saveFairAction(args: { id?: string; data: FairInput }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return { ok: false as const, error: "No autorizado" };
  }

  const parsed = fairSchema.safeParse(args.data);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos no válidos" };
  }

  const data = parsed.data;
  const before = args.id ? await prisma.perfumeFair.findUnique({ where: { id: args.id } }) : null;

  const saved = args.id
    ? await prisma.perfumeFair.update({
        where: { id: args.id },
        data: {
          slug: data.slug,
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          timezone: data.timezone,
          allDay: data.allDay,
          city: data.city,
          country: data.country.toUpperCase(),
          venue: data.venue,
          address: data.address,
          lat: data.lat,
          lng: data.lng,
          websiteUrl: data.websiteUrl,
          ticketUrl: data.ticketUrl,
          coverImage: data.coverImage,
          gallery: data.gallery,
          status: data.status,
          statusManual: data.statusManual,
          isFeatured: data.isFeatured,
          tags: data.tags,
        },
      })
    : await prisma.perfumeFair.create({
        data: {
          slug: data.slug,
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          timezone: data.timezone,
          allDay: data.allDay,
          city: data.city,
          country: data.country.toUpperCase(),
          venue: data.venue,
          address: data.address,
          lat: data.lat,
          lng: data.lng,
          websiteUrl: data.websiteUrl,
          ticketUrl: data.ticketUrl,
          coverImage: data.coverImage,
          gallery: data.gallery,
          status: data.status,
          statusManual: data.statusManual,
          isFeatured: data.isFeatured,
          tags: data.tags,
          createdById: session.user.id,
        },
      });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: args.id ? "fair.update" : "fair.create",
      entity: "PerfumeFair",
      entityId: saved.id,
      before: before as object | null,
      after: saved as unknown as object,
    },
  });

  revalidatePath("/ferias");
  revalidatePath(`/ferias/${saved.slug}`);
  revalidatePath("/admin/ferias");
  revalidateTag("fairs");

  return { ok: true as const, id: saved.id };
}

export async function deleteFairAction(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return { ok: false as const, error: "No autorizado" };

  await prisma.perfumeFair.update({ where: { id }, data: { deletedAt: new Date() } });
  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "fair.delete", entity: "PerfumeFair", entityId: id },
  });

  revalidatePath("/ferias");
  revalidatePath("/admin/ferias");
  return { ok: true as const };
}
