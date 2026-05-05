import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { pickI18n } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    where: { isActive: true, product: { deletedAt: null } },
    include: { product: { select: { id: true, slug: true, name: true } } },
    orderBy: { stock: "asc" },
    take: 200,
  });

  const lowStock = variants.filter((v) => v.stock <= v.lowStockAt);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-3xl">Inventario</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
          {variants.length} variantes · <span className="text-[var(--color-warning)]">{lowStock.length} bajo umbral</span>
        </p>
      </header>

      {lowStock.length > 0 && (
        <div className="card-velvet p-4 border-l-4 border-l-[var(--color-warning)] flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-[var(--color-warning)]" />
          <p className="text-sm">Hay {lowStock.length} variantes con stock crítico. Reabastece pronto.</p>
        </div>
      )}

      <div className="card-velvet overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[oklch(0.20_0.02_55)] text-left">
            <tr>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Producto</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">SKU</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Tamaño</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Stock</th>
              <th className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3">Umbral</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="border-t border-[oklch(0.55_0.10_70_/_0.15)]">
                <td className="px-5 py-3">
                  <Link href={`/admin/productos/${v.product.id}`} className="display hover:text-[var(--color-gold)]">
                    {pickI18n(v.product.name, "es")}
                  </Link>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-[var(--color-ink-muted)]">{v.sku}</td>
                <td className="px-5 py-3">{v.sizeMl} ml</td>
                <td className={`px-5 py-3 tabular-nums ${v.stock <= v.lowStockAt ? "text-[var(--color-warning)]" : ""}`}>
                  {v.stock}
                </td>
                <td className="px-5 py-3 tabular-nums text-[var(--color-ink-subtle)]">{v.lowStockAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
