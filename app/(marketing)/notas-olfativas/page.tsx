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
  title: "Notas olfativas",
  description: "Enciclopedia visual de las notas que dan vida a nuestros perfumes.",
  path: "/notas-olfativas",
});

export default async function NotesPage() {
  const locale = (await getLocale()) as Locale;
  const notes = await prisma.olfactiveNote.findMany({
    where: { deletedAt: null },
    orderBy: { slug: "asc" },
  });

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16">
      <SectionHeader
        kicker="Diccionario olfativo"
        title="La paleta de un perfumista"
        subtitle="Cada nota es una historia. Toca cualquiera para ver los perfumes que la contienen."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {notes.map((n) => (
          <Link
            key={n.id}
            href={`/perfumes?note=${n.slug}`}
            className="card-velvet group relative aspect-square flex flex-col items-center justify-center gap-3 p-5 text-center"
            style={n.color ? { borderColor: `${n.color.replace(")", " / 0.4)")}` } : undefined}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${n.color ?? "oklch(0.78 0.13 82 / 0.2)"} 0%, transparent 70%)`,
                opacity: 0.15,
              }}
            />
            {n.icon ? (
              <Image src={n.icon} alt="" width={40} height={40} className="opacity-80 group-hover:opacity-100" />
            ) : (
              <div className="h-10 w-10 rounded-full" style={{ background: n.color ?? "var(--color-gold)" }} />
            )}
            <p className="display text-base text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
              {pickI18n(n.name, locale)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
