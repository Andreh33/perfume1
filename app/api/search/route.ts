import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pickI18n } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const locale = url.searchParams.get("locale") ?? "es";

  if (q.length < 2) return NextResponse.json({ products: [], fairs: [], posts: [] });

  const [products, fairs, posts] = await Promise.all([
    prisma.product.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
        OR: [
          { slug: { contains: q, mode: "insensitive" } },
          { family: { contains: q, mode: "insensitive" } },
          { perfumer: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { images: { take: 1, orderBy: { position: "asc" } } },
      take: 6,
    }),
    prisma.perfumeFair.findMany({
      where: {
        deletedAt: null,
        OR: [
          { slug: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 4,
    }),
    prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        slug: { contains: q, mode: "insensitive" },
      },
      take: 4,
    }),
  ]);

  return NextResponse.json({
    products: products.map((p) => ({
      type: "product",
      slug: p.slug,
      name: pickI18n(p.name, locale),
      image: p.images[0]?.url ?? null,
    })),
    fairs: fairs.map((f) => ({
      type: "fair",
      slug: f.slug,
      title: pickI18n(f.title, locale),
      city: f.city,
    })),
    posts: posts.map((p) => ({
      type: "post",
      slug: p.slug,
      title: pickI18n(p.title, locale),
    })),
  });
}
