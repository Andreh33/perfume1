import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { fontVariables } from "@/app/fonts";
import { getDirection, type Locale } from "@/lib/i18n/config";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import "@/app/globals.css";

export const metadata: Metadata = buildMetadata({});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#171411" },
    { media: "(prefers-color-scheme: light)", color: "#171411" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const dir = getDirection(locale);

  return (
    <html lang={locale} dir={dir} className={fontVariables} suppressHydrationWarning>
      <body className="font-[var(--font-body-loaded)] antialiased">
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "var(--color-bg-velvet)",
                border: "1px solid var(--color-gold-deep)",
                color: "var(--color-ink)",
              },
            }}
          />
        </NextIntlClientProvider>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
