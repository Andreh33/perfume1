import type { Metadata } from "next";
import { env } from "@/lib/env";

const baseTitle = "Sol Perfumes Árabes";
const baseDescription =
  "Perfumería árabe de nicho. Attar, mukhallat, oud y bakhoor seleccionados a mano. Envíos a toda la UE.";

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noindex = false,
  locale = "es_ES",
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  locale?: string;
}): Metadata {
  const fullTitle = title ? `${title} · ${baseTitle}` : baseTitle;
  const desc = description ?? baseDescription;
  const url = `${env.NEXT_PUBLIC_APP_URL}${path}`;
  const ogImage = image ?? `${env.NEXT_PUBLIC_APP_URL}/og/default.png`;

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: fullTitle,
    description: desc,
    alternates: {
      canonical: url,
      languages: {
        es: `${env.NEXT_PUBLIC_APP_URL}${path}`,
        en: `${env.NEXT_PUBLIC_APP_URL}/en${path === "/" ? "" : path}`,
        ar: `${env.NEXT_PUBLIC_APP_URL}/ar${path === "/" ? "" : path}`,
      },
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: baseTitle,
      type: "website",
      locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: baseTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-icon.png",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: baseTitle,
    url: env.NEXT_PUBLIC_APP_URL,
    logo: `${env.NEXT_PUBLIC_APP_URL}/icon.svg`,
    sameAs: [
      "https://instagram.com/solperfumesarabes",
      "https://x.com/solperfumesarabes",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hola@solperfumesarabes.com",
      availableLanguage: ["es", "en", "ar"],
    },
  };
}
