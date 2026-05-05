import Image from "next/image";
import Link from "next/link";
import { formatPriceCents, pickI18n } from "@/lib/utils";

type ProductCardData = {
  slug: string;
  name: unknown;
  shortDescription?: unknown;
  family: string;
  isNew: boolean;
  isLimited: boolean;
  images: { url: string; alt: unknown; blurDataUrl?: string | null }[];
  variants: { priceCents: number; sizeMl: number }[];
};

export function ProductCard({ product, locale = "es" }: { product: ProductCardData; locale?: string }) {
  const cover = product.images[0];
  const cheapest = [...product.variants].sort((a, b) => a.priceCents - b.priceCents)[0];
  const name = pickI18n(product.name, locale);
  const desc = pickI18n(product.shortDescription, locale);
  const alt = cover ? pickI18n(cover.alt, locale) || name : name;

  return (
    <Link
      href={`/perfumes/${product.slug}`}
      className="card-velvet group relative block overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-night)]">
        {cover ? (
          <Image
            src={cover.url}
            alt={alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            placeholder={cover.blurDataUrl ? "blur" : "empty"}
            blurDataURL={cover.blurDataUrl ?? undefined}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-[var(--color-ink-subtle)]">
            sin imagen
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[oklch(0.14_0.015_60_/_0.6)]" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <span className="badge badge-new">Nuevo</span>}
          {product.isLimited && <span className="badge badge-limited">Edición limitada</span>}
        </div>

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="badge badge-gold">Vista rápida</span>
        </div>
      </div>

      <div className="p-5 space-y-2">
        <p className="accent text-[0.6rem] text-[var(--color-gold)]">{product.family.replace(/_/g, " · ")}</p>
        <h3 className="display text-xl text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
          {name}
        </h3>
        {desc && <p className="text-sm line-clamp-2 text-[var(--color-ink-muted)]">{desc}</p>}
        {cheapest && (
          <p className="pt-2 text-sm">
            <span className="text-[var(--color-ink-subtle)]">desde</span>{" "}
            <span className="gold-text font-semibold">{formatPriceCents(cheapest.priceCents)}</span>
            <span className="text-[var(--color-ink-subtle)]"> · {cheapest.sizeMl} ml</span>
          </p>
        )}
      </div>
    </Link>
  );
}
