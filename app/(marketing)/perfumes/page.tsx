import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 120;
export const metadata = buildMetadata({
  title: "Catálogo de perfumes",
  description: "Descubre nuestra selección completa de attars, mukhallats, ouds y bakhoor.",
  path: "/perfumes",
});

type SearchParams = {
  family?: string;
  gender?: string;
  note?: string;
  collection?: string;
  sort?: string;
  page?: string;
};

async function getProducts(params: SearchParams) {
  const where = {
    isPublished: true,
    deletedAt: null,
    ...(params.family ? { family: params.family } : {}),
    ...(params.gender && ["MASCULINO", "FEMENINO", "UNISEX"].includes(params.gender)
      ? { gender: params.gender as "MASCULINO" | "FEMENINO" | "UNISEX" }
      : {}),
    ...(params.collection ? { collection: { slug: params.collection } } : {}),
    ...(params.note
      ? { productNotes: { some: { note: { slug: params.note } } } }
      : {}),
  };

  const orderBy =
    params.sort === "price-asc"
      ? { variants: { _count: "desc" as const } }
      : params.sort === "newest"
        ? { createdAt: "desc" as const }
        : { isFeatured: "desc" as const };

  const page = Math.max(1, Number(params.page ?? 1));
  const perPage = 24;

  const [items, total, families, collections, notes] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        variants: { where: { isActive: true }, orderBy: { priceCents: "asc" } },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
    prisma.product.groupBy({ by: ["family"], where: { isPublished: true, deletedAt: null } }),
    prisma.collection.findMany({ where: { deletedAt: null }, orderBy: { position: "asc" } }),
    prisma.olfactiveNote.findMany({ where: { deletedAt: null }, orderBy: { slug: "asc" }, take: 30 }),
  ]);

  return { items, total, families, collections, notes, page, perPage };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;
  const { items, total, families, collections, notes, page, perPage } = await getProducts(params);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16">
      <SectionHeader
        kicker="Catálogo"
        title="Nuestros perfumes"
        subtitle={`${total} fragancias seleccionadas a mano.`}
      />

      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start" aria-label="Filtros">
          <FilterGroup title="Familia">
            <FilterLink href="/perfumes" active={!params.family} label="Todas" />
            {families.map((f) => (
              <FilterLink
                key={f.family}
                href={`/perfumes?family=${f.family}`}
                active={params.family === f.family}
                label={f.family.replace(/_/g, " · ")}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Género">
            {(["MASCULINO", "FEMENINO", "UNISEX"] as const).map((g) => (
              <FilterLink
                key={g}
                href={`/perfumes?gender=${g}`}
                active={params.gender === g}
                label={g.toLowerCase()}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Colección">
            {collections.map((c) => (
              <FilterLink
                key={c.id}
                href={`/perfumes?collection=${c.slug}`}
                active={params.collection === c.slug}
                label={typeof c.name === "object" && c.name ? (c.name as Record<string, string>)[locale] ?? c.slug : c.slug}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Notas olfativas">
            <div className="flex flex-wrap gap-1.5">
              {notes.slice(0, 16).map((n) => (
                <a
                  key={n.id}
                  href={`/perfumes?note=${n.slug}`}
                  className={`note-chip ${params.note === n.slug ? "border-[var(--color-gold)] bg-[oklch(0.78_0.13_82_/_0.12)]" : ""}`}
                >
                  {typeof n.name === "object" && n.name ? (n.name as Record<string, string>)[locale] ?? n.slug : n.slug}
                </a>
              ))}
            </div>
          </FilterGroup>
        </aside>

        <Suspense fallback={<div className="text-[var(--color-ink-muted)]">Cargando…</div>}>
          {items.length === 0 ? (
            <div className="card-velvet p-12 text-center">
              <p className="text-[var(--color-ink-muted)]">No hay productos con esos filtros.</p>
              <a href="/perfumes" className="mt-4 inline-block accent text-[0.75rem] text-[var(--color-gold)]">
                Limpiar filtros →
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} locale={locale} />
                ))}
              </div>
              {totalPages > 1 && (
                <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginación">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    const qs = new URLSearchParams(params as Record<string, string>);
                    qs.set("page", String(n));
                    return (
                      <a
                        key={n}
                        href={`/perfumes?${qs.toString()}`}
                        className={`accent text-xs px-3 py-2 rounded-md ${
                          n === page
                            ? "bg-[var(--color-gold)] text-[var(--color-bg-deep)]"
                            : "border border-[var(--color-gold-deep)] text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]"
                        }`}
                      >
                        {n}
                      </a>
                    );
                  })}
                </nav>
              )}
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="accent text-[0.65rem] text-[var(--color-gold)] mb-3">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={`block text-sm py-1.5 capitalize ${
        active ? "text-[var(--color-gold)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]"
      }`}
    >
      {label}
    </a>
  );
}
