import { getLocale } from "next-intl/server";
import { Topbar } from "@/components/shared/Topbar";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { SearchCommand } from "@/components/shared/SearchCommand";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { prisma } from "@/lib/prisma";
import { pickI18n } from "@/lib/utils";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n/config";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const locale = (await getLocale()) as Locale;

  const [collections, notes] = await Promise.all([
    prisma.collection.findMany({
      where: { deletedAt: null, isFeatured: true },
      orderBy: { position: "asc" },
      take: 3,
      select: { slug: true, name: true, bannerImage: true },
    }),
    prisma.olfactiveNote.findMany({
      where: { deletedAt: null },
      take: 8,
      select: { slug: true, name: true },
    }),
  ]);

  return (
    <>
      <Topbar />
      <Header
        locale={locale}
        cartCount={0}
        mega={{
          collections: collections.map((c) => ({
            slug: c.slug,
            name: pickI18n(c.name, locale),
            bannerImage: c.bannerImage,
          })),
          notes: notes.map((n) => ({ slug: n.slug, name: pickI18n(n.name, locale) })),
        }}
      />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <Footer />
      <SearchCommand />
      <WhatsAppButton number={env.NEXT_PUBLIC_WHATSAPP_NUMBER} />
      <CookieBanner />
    </>
  );
}
