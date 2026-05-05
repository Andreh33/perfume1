import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sol Perfumes Árabes",
    short_name: "Sol Perfumes",
    description: "Perfumería árabe de nicho. Attar, mukhallat, oud y bakhoor.",
    start_url: "/",
    display: "standalone",
    background_color: "#171411",
    theme_color: "#171411",
    orientation: "portrait",
    lang: "es-ES",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
