import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPriceCents, pickI18n } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const items = await prisma.wishlistItem.findMany({
    where: { wishlist: { userId: session.user.id } },
    include: {
      product: {
        include: {
          images: { take: 1, orderBy: { position: "asc" } },
          variants: { where: { isActive: true }, orderBy: { priceCents: "asc" }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (items.length === 0) {
    return (
      <div className="card-velvet p-12 text-center space-y-4">
        <Heart className="mx-auto h-10 w-10 text-[var(--color-gold)]" />
        <p className="display text-2xl">Aún no tienes favoritos</p>
        <p className="text-[var(--color-ink-muted)]">Explora nuestros perfumes y añade los que más te enamoren.</p>
        <Link href="/perfumes" className="btn-primary">Descubrir perfumes</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
      {items.map((it) => {
        const cover = it.product.images[0];
        const price = it.product.variants[0];
        return (
          <Link key={it.id} href={`/perfumes/${it.product.slug}`} className="card-velvet group block overflow-hidden">
            <div className="relative aspect-[4/5] bg-[var(--color-bg-night)]">
              {cover && (
                <Image src={cover.url} alt={pickI18n(it.product.name, "es")} fill sizes="33vw" className="object-cover" />
              )}
            </div>
            <div className="p-4">
              <p className="display group-hover:text-[var(--color-gold)] transition-colors">{pickI18n(it.product.name, "es")}</p>
              {price && <p className="gold-text text-sm mt-1">desde {formatPriceCents(price.priceCents)}</p>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
