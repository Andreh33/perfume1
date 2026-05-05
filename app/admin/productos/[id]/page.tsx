import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { pickI18n } from "@/lib/utils";
import { ProductForm } from "../ProductForm";

type I18n = { es: string; en: string; ar: string };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, collections, notes] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { sizeMl: "asc" } },
        images: { orderBy: { position: "asc" } },
        productNotes: true,
      },
    }),
    prisma.collection.findMany({ where: { deletedAt: null }, orderBy: { position: "asc" } }),
    prisma.olfactiveNote.findMany({ where: { deletedAt: null }, orderBy: { slug: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <p className="accent text-[0.65rem] text-[var(--color-gold)]">Editar producto</p>
        <h1 className="display text-3xl">{pickI18n(product.name, "es")}</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">/{product.slug}</p>
      </header>

      <ProductForm
        collections={collections.map((c) => ({ id: c.id, slug: c.slug, name: pickI18n(c.name, "es") }))}
        notes={notes.map((n) => ({ id: n.id, slug: n.slug, name: pickI18n(n.name, "es") }))}
        defaults={{
          id: product.id,
          slug: product.slug,
          name: product.name as I18n,
          shortDescription: (product.shortDescription as I18n) ?? undefined,
          description: product.description as object | null,
          story: product.story as object | null,
          howToUse: product.howToUse as object | null,
          gender: product.gender,
          family: product.family,
          perfumer: product.perfumer,
          origin: product.origin,
          releaseYear: product.releaseYear,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          isLimited: product.isLimited,
          isPublished: product.isPublished,
          metaTitle: (product.metaTitle as I18n) ?? undefined,
          metaDescription: (product.metaDescription as I18n) ?? undefined,
          ogImage: product.ogImage,
          collectionId: product.collectionId,
          variants: product.variants.map((v) => ({
            id: v.id,
            sizeMl: v.sizeMl,
            sku: v.sku,
            priceCents: v.priceCents,
            compareAtCents: v.compareAtCents,
            weightGrams: v.weightGrams,
            stock: v.stock,
            isDefault: v.isDefault,
            isActive: v.isActive,
          })),
          images: product.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: (img.alt as I18n) ?? { es: "", en: "", ar: "" },
            position: img.position,
            isCover: img.isCover,
          })),
          notes: product.productNotes.map((pn) => ({
            noteId: pn.noteId,
            type: pn.type,
            position: pn.position,
          })),
        }}
      />
    </div>
  );
}
