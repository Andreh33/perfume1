import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { type Locale, defaultLocale, locales } from "./config";

function pickFromAccept(accept: string | null): Locale {
  if (!accept) return defaultLocale;
  const ranges = accept
    .split(",")
    .map((part) => {
      const [tag, q = "q=1"] = part.trim().split(";");
      return { tag: (tag ?? "").toLowerCase(), q: Number(q.split("=")[1] ?? 1) };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranges) {
    const base = tag.split("-")[0];
    if (base && (locales as readonly string[]).includes(base)) {
      return base as Locale;
    }
  }
  return defaultLocale;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale =
    (cookieLocale && (locales as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : pickFromAccept(headerStore.get("accept-language"))) ?? defaultLocale;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: "Europe/Madrid",
    now: new Date(),
    formats: {
      dateTime: {
        short: { day: "numeric", month: "short", year: "numeric" },
        long: { day: "numeric", month: "long", year: "numeric" },
        full: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
      },
      number: {
        currency: { style: "currency", currency: "EUR" },
        percent: { style: "percent", maximumFractionDigits: 0 },
      },
    },
  };
});
