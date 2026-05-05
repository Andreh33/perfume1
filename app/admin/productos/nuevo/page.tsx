import { prisma } from "@/lib/prisma";
import { pickI18n } from "@/lib/utils";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage() {
  const [collections, notes] = await Promise.all([
    prisma.collection.findMany({ where: { deletedAt: null }, orderBy: { position: "asc" } }),
    prisma.olfactiveNote.findMany({ where: { deletedAt: null }, orderBy: { slug: "asc" } }),
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h1 className="display text-3xl">Nuevo producto</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">Rellena los datos por idioma. Se publica solo cuando marques «Publicado».</p>
      </header>

      <ProductForm
        collections={collections.map((c) => ({ id: c.id, slug: c.slug, name: pickI18n(c.name, "es") }))}
        notes={notes.map((n) => ({ id: n.id, slug: n.slug, name: pickI18n(n.name, "es") }))}
      />
    </div>
  );
}
