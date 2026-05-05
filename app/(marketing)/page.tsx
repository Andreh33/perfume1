import Link from "next/link";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/marketing/Hero";
import { Marquee } from "@/components/marketing/Marquee";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { OlfactivePyramid } from "@/components/marketing/OlfactivePyramid";
import { ProductCard } from "@/components/shop/ProductCard";
import { FairCard } from "@/components/ferias/FairCard";
import { pickI18n } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 300;

async function getHomeData() {
  const [collections, bestsellers, upcomingFairs] = await Promise.all([
    prisma.collection.findMany({
      where: { isFeatured: true, deletedAt: null },
      orderBy: { position: "asc" },
      take: 3,
    }),
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true, deletedAt: null },
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        variants: { where: { isActive: true }, orderBy: { priceCents: "asc" } },
      },
      take: 8,
    }),
    prisma.perfumeFair.findMany({
      where: { status: "UPCOMING", deletedAt: null },
      orderBy: { startDate: "asc" },
      take: 3,
    }),
  ]);

  return { collections, bestsellers, upcomingFairs };
}

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home");
  const { collections, bestsellers, upcomingFairs } = await getHomeData();

  return (
    <>
      <Hero />
      <Marquee />

      {/* Colecciones destacadas */}
      <section className="mx-auto max-w-[1440px] px-6 md:px-12 py-24">
        <SectionHeader
          kicker={t("collections.kicker")}
          title={t("collections.title")}
          subtitle={t("collections.subtitle")}
        />
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {collections.map((c, i) => (
            <Link
              key={c.id}
              href={`/colecciones/${c.slug}`}
              className={`card-velvet group relative block overflow-hidden ${i === 1 ? "md:row-span-2" : ""}`}
            >
              <div className={`relative ${i === 1 ? "aspect-[3/4] md:aspect-[3/5]" : "aspect-[4/3]"} overflow-hidden`}>
                {c.bannerImage ? (
                  <Image
                    src={c.bannerImage}
                    alt={pickI18n(c.name, locale)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.30 0.05 ${50 + i * 30}), oklch(0.18 0.04 60))`,
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.015_60)] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="accent text-[0.65rem] text-[var(--color-gold)] mb-2">Colección</p>
                  <h3 className="display text-2xl md:text-3xl text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
                    {pickI18n(c.name, locale)}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-2 accent text-[0.7rem] text-[var(--color-ink-muted)] group-hover:text-[var(--color-gold)] transition-colors">
                    Explorar <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-[1440px] px-6 md:px-12 py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="accent text-[0.7rem] text-[var(--color-gold)] mb-3">{t("bestsellers.kicker")}</p>
            <h2 className="display text-3xl md:text-5xl">{t("bestsellers.title")}</h2>
          </div>
          <Link
            href="/perfumes"
            className="hidden md:inline-flex accent text-[0.75rem] text-[var(--color-gold)] hover:text-[var(--color-gold-bright)]"
          >
            {t("bestsellers.viewAll")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>

      <OlfactivePyramid />

      {/* Próximas ferias */}
      {upcomingFairs.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 bg-[oklch(0.16_0.020_60)]">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="accent text-[0.7rem] text-[var(--color-gold)] mb-3">{t("fairs.kicker")}</p>
              <h2 className="display text-3xl md:text-5xl">{t("fairs.title")}</h2>
            </div>
            <Link
              href="/ferias"
              className="hidden md:inline-flex accent text-[0.75rem] text-[var(--color-gold)] hover:text-[var(--color-gold-bright)]"
            >
              {t("fairs.viewAll")} →
            </Link>
          </div>
          <div className="grid gap-6">
            {upcomingFairs.map((fair) => (
              <FairCard key={fair.id} fair={fair} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="mx-auto max-w-[1440px] px-6 md:px-12 py-24">
        <div className="card-velvet relative overflow-hidden p-10 md:p-16 text-center">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 70% at 50% 0%, oklch(0.78 0.13 82 / 0.18), transparent 70%)",
            }}
          />
          <div className="relative max-w-2xl mx-auto space-y-6">
            <p className="accent text-[0.7rem] text-[var(--color-gold)]">{t("newsletter.kicker")}</p>
            <h2 className="display text-3xl md:text-5xl">{t("newsletter.title")}</h2>
            <p className="text-lg text-[var(--color-ink-muted)]">{t("newsletter.subtitle")}</p>
            <form className="mx-auto flex flex-col sm:flex-row gap-3 max-w-md" action="/api/newsletter" method="post">
              <input
                type="email"
                name="email"
                required
                placeholder={t("newsletter.placeholder")}
                aria-label={t("newsletter.placeholder")}
                className="field flex-1"
              />
              <button type="submit" className="btn-primary">
                {t("newsletter.cta")}
              </button>
            </form>
            <p className="text-xs text-[var(--color-ink-subtle)]">{t("newsletter.consent")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
