import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPriceCents, pickI18n } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; published?: string }>;
}) {
  const { q, published } = await searchParams;

  const where = {
    deletedAt: null,
    ...(q ? { OR: [{ slug: { contains: q, mode: "insensitive" as const } }, { family: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(published === "true" ? { isPublished: true } : published === "false" ? { isPublished: false } : {}),
  };

  const products = await prisma.product.findMany({
    where,
    include: {
      images: { take: 1, orderBy: { position: "asc" } },
      variants: { where: { isActive: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="display text-3xl">Productos</h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1">{products.length} resultados</p>
        </div>
        <Link href="/admin/productos/nuevo" className="btn-primary">
          <Plus className="h-4 w-4" /> Nuevo producto
        </Link>
      </header>

      <form className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-ink-subtle)]" />
          <input name="q" defaultValue={q ?? ""} placeholder="Buscar productos…" className="field !pl-10" />
        </div>
        <select name="published" defaultValue={published ?? ""} className="field max-w-[180px]">
          <option value="">Todos</option>
          <option value="true">Publicados</option>
          <option value="false">Borrador</option>
        </select>
      </form>

      <div className="card-velvet overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[oklch(0.20_0.02_55)] text-left">
            <tr>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Producto</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Familia</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Precio desde</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Stock</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const cheapest = [...p.variants].sort((a, b) => a.priceCents - b.priceCents)[0];
              const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
              return (
                <tr
                  key={p.id}
                  className="border-t border-[oklch(0.55_0.10_70_/_0.15)] hover:bg-[oklch(0.78_0.13_82_/_0.04)]"
                >
                  <td className="px-5 py-4">
                    <Link href={`/admin/productos/${p.id}`} className="flex items-center gap-3 hover:text-[var(--color-gold)]">
                      <span className="display">{pickI18n(p.name, "es")}</span>
                      {p.isFeatured && <span className="badge badge-gold">★</span>}
                      {p.isLimited && <span className="badge badge-limited">LTD</span>}
                    </Link>
                    <p className="text-xs text-[var(--color-ink-subtle)] mt-0.5">{p.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-ink-muted)] capitalize">
                    {p.family.replace(/_/g, " · ")}
                  </td>
                  <td className="px-5 py-4 tabular-nums">
                    {cheapest ? formatPriceCents(cheapest.priceCents) : "—"}
                  </td>
                  <td className={`px-5 py-4 tabular-nums ${totalStock < 10 ? "text-[var(--color-warning)]" : ""}`}>
                    {totalStock}
                  </td>
                  <td className="px-5 py-4">
                    {p.isPublished ? (
                      <span className="badge badge-new">Publicado</span>
                    ) : (
                      <span className="badge badge-outline">Borrador</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[var(--color-ink-subtle)]">
                  No hay productos. <Link href="/admin/productos/nuevo" className="text-[var(--color-gold)]">Crear el primero →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
