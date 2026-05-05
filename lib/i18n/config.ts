export const locales = ["es", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const localePrefix = "as-needed" as const;

export const localeMeta: Record<Locale, { label: string; native: string; flag: string; dir: "ltr" | "rtl" }> = {
  es: { label: "Español", native: "Español", flag: "🇪🇸", dir: "ltr" },
  en: { label: "English", native: "English", flag: "🇬🇧", dir: "ltr" },
  ar: { label: "Arabic", native: "العربية", flag: "🇸🇦", dir: "rtl" },
};

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}
