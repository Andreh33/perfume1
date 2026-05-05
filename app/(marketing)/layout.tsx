import { getLocale } from "next-intl/server";
import { Topbar } from "@/components/shared/Topbar";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import type { Locale } from "@/lib/i18n/config";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const locale = (await getLocale()) as Locale;

  return (
    <>
      <Topbar />
      <Header locale={locale} cartCount={0} />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
