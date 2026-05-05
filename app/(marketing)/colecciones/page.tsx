import Link from "next/link";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { pickI18n } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 600;
export const metadata = buildMetadata({
  title: "Colecciones",
  description: "Selecciones cuidadas: oud, rosa, ámbar, mukhallat y más.",
  path: "/colecciones",
});

export default async function CollectionsPage() {
  const locale = (await getLocale()) as Locale;
  const collections = await prisma.collection.findMany({
    where: { deletedAt: null },
    orderBy: { position: "asc" },
  });

  return (
    <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-16">
      <SectionHeader kicker="Selecciones" title="Nuestras colecciones" />

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/colecciones/${c.slug}`}
            className="card-velvet group relative block overflow-hidden aspect-[4/5] md:aspect-[3/2]"
          >
            {c.bannerImage ? (
              <Image src={c.bannerImage} alt={pickI18n(c.name, locale)} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.30 0.05 50), oklch(0.18 0.04 60))" }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.015_60)] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="display text-3xl group-hover:text-[var(--color-gold)] transition-colors">
                {pickI18n(c.name, locale)}
              </h2>
              {c.description && (
                <p className="text-sm text-[var(--color-ink-muted)] line-clamp-2 mt-2">
                  {pickI18n(c.description, locale)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
