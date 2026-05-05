"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const i18n = z.object({ es: z.string().min(1), en: z.string().min(1), ar: z.string().min(1) });

const variantSchema = z.object({
  id: z.string().optional(),
  sizeMl: z.number().int().positive(),
  sku: z.string().min(2).max(64),
  priceCents: z.number().int().nonnegative(),
  compareAtCents: z.number().int().nonnegative().nullable().optional(),
  weightGrams: z.number().int().positive().default(150),
  stock: z.number().int().nonnegative(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  alt: i18n.partial().optional(),
  blurDataUrl: z.string().optional(),
  position: z.number().int().nonnegative(),
  isCover: z.boolean().default(false),
});

const noteSchema = z.object({
  noteId: z.string(),
  type: z.enum(["SALIDA", "CORAZON", "FONDO"]),
  position: z.number().int().nonnegative().default(0),
});

const productSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  name: i18n,
  shortDescription: i18n.partial().optional(),
  description: z.unknown().optional(),
  story: z.unknown().optional(),
  howToUse: z.unknown().optional(),
  gender: z.enum(["MASCULINO", "FEMENINO", "UNISEX"]),
  family: z.string().min(1),
  perfumer: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  releaseYear: z.number().int().min(1800).max(2100).optional().nullable(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isLimited: z.boolean(),
  isPublished: z.boolean(),
  metaTitle: i18n.partial().optional(),
  metaDescription: i18n.partial().optional(),
  ogImage: z.string().url().optional().nullable(),
  collectionId: z.string().optional().nullable(),
  variants: z.array(variantSchema).min(1),
  images: z.array(imageSchema),
  notes: z.array(noteSchema),
});

export async function saveProductAction(args: { id?: string; data: z.infer<typeof productSchema> }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return { ok: false as const, error: "No autorizado" };
  }

  const parsed = productSchema.safeParse(args.data);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const data = parsed.data;

  const before = args.id ? await prisma.product.findUnique({ where: { id: args.id } }) : null;

  const result = await prisma.$transaction(async (tx) => {
    const product = args.id
      ? await tx.product.update({
          where: { id: args.id },
          data: {
            slug: data.slug,
            name: data.name,
            shortDescription: data.shortDescription as object | undefined,
            description: data.description as object | undefined,
            story: data.story as object | undefined,
            howToUse: data.howToUse as object | undefined,
            gender: data.gender,
            family: data.family,
            perfumer: data.perfumer ?? null,
            origin: data.origin ?? null,
            releaseYear: data.releaseYear ?? null,
            isFeatured: data.isFeatured,
            isNew: data.isNew,
            isLimited: data.isLimited,
            isPublished: data.isPublished,
            metaTitle: data.metaTitle as object | undefined,
            metaDescription: data.metaDescription as object | undefined,
            ogImage: data.ogImage ?? null,
            collectionId: data.collectionId ?? null,
          },
        })
      : await tx.product.create({
          data: {
            slug: data.slug,
            name: data.name,
            shortDescription: data.shortDescription as object | undefined,
            description: data.description as object | undefined,
            story: data.story as object | undefined,
            howToUse: data.howToUse as object | undefined,
            gender: data.gender,
            family: data.family,
            perfumer: data.perfumer ?? null,
            origin: data.origin ?? null,
            releaseYear: data.releaseYear ?? null,
            isFeatured: data.isFeatured,
            isNew: data.isNew,
            isLimited: data.isLimited,
            isPublished: data.isPublished,
            metaTitle: data.metaTitle as object | undefined,
            metaDescription: data.metaDescription as object | undefined,
            ogImage: data.ogImage ?? null,
            collectionId: data.collectionId ?? null,
          },
        });

    // Variantes — reemplazar
    const existingVariantIds = (await tx.productVariant.findMany({
      where: { productId: product.id },
      select: { id: true },
    })).map((v) => v.id);
    const incomingIds = data.variants.filter((v) => v.id).map((v) => v.id!);
    const toDelete = existingVariantIds.filter((id) => !incomingIds.includes(id));
    if (toDelete.length) await tx.productVariant.deleteMany({ where: { id: { in: toDelete } } });

    for (const v of data.variants) {
      if (v.id) {
        await tx.productVariant.update({
          where: { id: v.id },
          data: {
            sizeMl: v.sizeMl,
            sku: v.sku,
            priceCents: v.priceCents,
            compareAtCents: v.compareAtCents ?? null,
            weightGrams: v.weightGrams,
            stock: v.stock,
            isDefault: v.isDefault,
            isActive: v.isActive,
          },
        });
      } else {
        await tx.productVariant.create({
          data: {
            productId: product.id,
            sizeMl: v.sizeMl,
            sku: v.sku,
            priceCents: v.priceCents,
            compareAtCents: v.compareAtCents ?? null,
            weightGrams: v.weightGrams,
            stock: v.stock,
            isDefault: v.isDefault,
            isActive: v.isActive,
          },
        });
      }
    }

    // Imágenes — reemplazar todo
    await tx.productImage.deleteMany({ where: { productId: product.id } });
    for (const [i, img] of data.images.entries()) {
      await tx.productImage.create({
        data: {
          productId: product.id,
          url: img.url,
          alt: (img.alt ?? { es: "", en: "", ar: "" }) as object,
          blurDataUrl: img.blurDataUrl,
          position: i,
          isCover: i === 0,
        },
      });
    }

    // Notas — reemplazar
    await tx.productNote.deleteMany({ where: { productId: product.id } });
    for (const n of data.notes) {
      await tx.productNote.create({
        data: { productId: product.id, noteId: n.noteId, type: n.type, position: n.position },
      });
    }

    return product;
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: args.id ? "product.update" : "product.create",
      entity: "Product",
      entityId: result.id,
      before: before as object | null,
      after: result as unknown as object,
    },
  });

  revalidatePath("/perfumes");
  revalidatePath(`/perfumes/${result.slug}`);
  revalidatePath("/admin/productos");
  revalidateTag("products");

  return { ok: true as const, id: result.id };
}

export async function deleteProductAction(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return { ok: false as const, error: "No autorizado" };
  await prisma.product.update({ where: { id }, data: { deletedAt: new Date(), isPublished: false } });
  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "product.delete", entity: "Product", entityId: id },
  });
  revalidatePath("/perfumes");
  revalidatePath("/admin/productos");
  return { ok: true as const };
}
