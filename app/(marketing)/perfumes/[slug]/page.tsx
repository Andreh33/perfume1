import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { Heart, Share2, Truck, RotateCcw, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import { Gallery } from "@/components/product/Gallery";
import { pickI18n } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n/config";
import { AddToCartForm } from "./AddToCartForm";

export const revalidate = 300;

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublished: true, deletedAt: null },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { where: { isActive: true }, orderBy: { sizeMl: "asc" } },
      productNotes: { include: { note: true }, orderBy: { position: "asc" } },
      collection: true,
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
      _count: { select: { reviews: { where: { status: "APPROVED" } } } },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, isPublished: true, deletedAt: null },
    include: { images: { take: 1, orderBy: { position: "asc" } } },
  });
  if (!product) return buildMetadata({ title: "Perfume no encontrado", noindex: true });
  const name = pickI18n(product.name, "es");
  const desc = pickI18n(product.shortDescription, "es");
  return buildMetadata({
    title: name,
    description: desc,
    path: `/perfumes/${slug}`,
    image: product.images[0]?.url ?? product.ogImage ?? undefined,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      isPublished: true,
      deletedAt: null,
      family: product.family,
      NOT: { id: product.id },
    },
    include: {
      images: { take: 1, orderBy: { position: "asc" } },
      variants: { where: { isActive: true }, orderBy: { priceCents: "asc" } },
    },
    take: 4,
  });

  const name = pickI18n(product.name, locale);
  const desc = pickI18n(product.shortDescription, locale);
  const cheapest = product.variants[0];
  const ratingAvg =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  const notesByType = {
    SALIDA: product.productNotes.filter((n) => n.type === "SALIDA"),
    CORAZON: product.productNotes.filter((n) => n.type === "CORAZON"),
    FONDO: product.productNotes.filter((n) => n.type === "FONDO"),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: desc,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: "Sol Perfumes Árabes" },
    sku: product.variants[0]?.sku,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: ((cheapest?.priceCents ?? 0) / 100).toFixed(2),
      highPrice: (((product.variants.at(-1)?.priceCents ?? 0)) / 100).toFixed(2),
      offerCount: product.variants.length,
      availability: cheapest && cheapest.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${env.NEXT_PUBLIC_APP_URL}/perfumes/${slug}`,
    },
    ...(product._count.reviews > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: ratingAvg.toFixed(1),
        reviewCount: product._count.reviews,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[var(--color-ink-subtle)]">
          <ol className="flex items-center gap-2">
            <li><Link href="/">Inicio</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/perfumes">Perfumes</Link></li>
            <li aria-hidden>/</li>
            <li className="text-[var(--color-ink-muted)]">{name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16">
          {/* Galería */}
          <Gallery
            name={name}
            images={product.images.map((img) => ({
              id: img.id,
              url: img.url,
              alt: pickI18n(img.alt, locale) || name,
              blurDataUrl: img.blurDataUrl,
            }))}
          />

          {/* Info */}
          <div className="space-y-7">
            {product.collection && (
              <p className="accent text-[0.7rem] text-[var(--color-gold)]">
                {pickI18n(product.collection.name, locale)}
              </p>
            )}

            <h1 className="display text-4xl md:text-6xl text-[var(--color-ink)]">{name}</h1>

            {desc && <p className="text-lg text-[var(--color-ink-muted)]">{desc}</p>}

            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {product.perfumer && (
                <>
                  <dt className="accent text-[0.65rem] text-[var(--color-gold)]">Perfumista</dt>
                  <dd className="text-[var(--color-ink)]">{product.perfumer}</dd>
                </>
              )}
              {product.origin && (
                <>
                  <dt className="accent text-[0.65rem] text-[var(--color-gold)]">Origen</dt>
                  <dd className="text-[var(--color-ink)]">{product.origin}</dd>
                </>
              )}
              {product.releaseYear && (
                <>
                  <dt className="accent text-[0.65rem] text-[var(--color-gold)]">Año</dt>
                  <dd className="text-[var(--color-ink)]">{product.releaseYear}</dd>
                </>
              )}
              <dt className="accent text-[0.65rem] text-[var(--color-gold)]">Familia</dt>
              <dd className="text-[var(--color-ink)] capitalize">{product.family.replace(/_/g, " · ")}</dd>
            </dl>

            {product._count.reviews > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex gap-0.5" aria-label={`Valoración ${ratingAvg.toFixed(1)} sobre 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${n <= Math.round(ratingAvg) ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-[var(--color-ink-subtle)]"}`}
                      aria-hidden
                    />
                  ))}
                </div>
                <span className="text-[var(--color-ink-muted)]">
                  {ratingAvg.toFixed(1)} · {product._count.reviews} reseñas
                </span>
              </div>
            )}

            <hr />

            {/* Selector de variante + cantidad + addToCart */}
            <AddToCartForm
              productId={product.id}
              variants={product.variants.map((v) => ({
                id: v.id,
                sizeMl: v.sizeMl,
                priceCents: v.priceCents,
                stock: v.stock,
              }))}
            />

            <div className="flex items-center gap-3 text-sm text-[var(--color-ink-muted)]">
              <button type="button" className="inline-flex items-center gap-2 hover:text-[var(--color-gold)]">
                <Heart className="h-4 w-4" /> Añadir a favoritos
              </button>
              <span aria-hidden>·</span>
              <button type="button" className="inline-flex items-center gap-2 hover:text-[var(--color-gold)]">
                <Share2 className="h-4 w-4" /> Compartir
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="card-velvet p-4 text-sm flex items-center gap-3">
                <Truck className="h-5 w-5 text-[var(--color-gold)]" aria-hidden />
                <span>Envío gratis +80 €</span>
              </div>
              <div className="card-velvet p-4 text-sm flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-[var(--color-gold)]" aria-hidden />
                <span>14 días devolución</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pirámide olfativa */}
        <section className="mt-24">
          <h2 className="display text-3xl md:text-4xl text-center mb-12">Pirámide olfativa</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(["SALIDA", "CORAZON", "FONDO"] as const).map((type) => (
              <div key={type} className="card-velvet p-6 space-y-4">
                <h3 className="accent text-[0.7rem] text-[var(--color-gold)]">
                  {type === "SALIDA" ? "Notas de salida" : type === "CORAZON" ? "Notas de corazón" : "Notas de fondo"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {notesByType[type].map((pn) => (
                    <span key={pn.noteId} className="note-chip">
                      {pickI18n(pn.note.name, locale)}
                    </span>
                  ))}
                  {notesByType[type].length === 0 && (
                    <span className="text-xs text-[var(--color-ink-subtle)]">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="display text-3xl md:text-4xl mb-10">Te puede gustar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          </section>
        )}

        {/* Reseñas */}
        {product.reviews.length > 0 && (
          <section className="mt-24">
            <h2 className="display text-3xl md:text-4xl mb-10">Reseñas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {product.reviews.map((r) => (
                <article key={r.id} className="card-velvet p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5" aria-label={`${r.rating} sobre 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-4 w-4 ${n <= r.rating ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-[var(--color-ink-subtle)]"}`}
                          aria-hidden
                        />
                      ))}
                    </div>
                    {r.verified && <span className="badge badge-outline">Compra verificada</span>}
                  </div>
                  {r.title && <h3 className="display text-lg">{r.title}</h3>}
                  <p className="text-sm text-[var(--color-ink-muted)]">{r.body}</p>
                  <p className="text-xs text-[var(--color-ink-subtle)]">— {r.user.name ?? "Anónimo"}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

