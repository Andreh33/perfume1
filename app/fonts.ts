import { Cormorant_Garamond, Manrope, Cinzel, Amiri } from "next/font/google";

export const fontDisplay = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display-loaded",
});

export const fontBody = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body-loaded",
});

export const fontAccent = Cinzel({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-accent-loaded",
});

export const fontArabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-arabic-loaded",
});

export const fontVariables = `${fontDisplay.variable} ${fontBody.variable} ${fontAccent.variable} ${fontArabic.variable}`;
