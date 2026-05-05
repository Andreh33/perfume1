import Link from "next/link";
import { getLocale } from "next-intl/server";
import { Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { pickI18n } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 600;
export const metadata = buildMetadata({
  title: "Diario",
  description: "Historias, guías y reflexiones sobre perfumería árabe.",
  path: "/blog",
});

export default async function BlogPage() {
  const locale = (await getLocale()) as Locale;
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { publishedAt: "desc" },
    take: 24,
  });

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16">
      <SectionHeader kicker="Diario" title="Historias, guías y reflexiones" />

      <div className="grid md:grid-cols-2 gap-8">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="card-velvet group block p-8 space-y-3">
            <p className="accent text-[0.65rem] text-[var(--color-gold)]">
              {(p.tags ?? []).slice(0, 2).join(" · ")}
            </p>
            <h2 className="display text-2xl group-hover:text-[var(--color-gold)] transition-colors">
              {pickI18n(p.title, locale)}
            </h2>
            <p className="text-[var(--color-ink-muted)] line-clamp-3">{pickI18n(p.excerpt, locale)}</p>
            <p className="text-xs text-[var(--color-ink-subtle)] inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> {p.readingMinutes} min de lectura
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
