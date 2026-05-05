import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPriceCents(cents: number, locale = "es-ES", currency = "EUR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatDateRange(start: Date, end: Date, locale = "es-ES"): string {
  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
  if (start.toDateString() === end.toDateString()) return fmt.format(start);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const day = new Intl.DateTimeFormat(locale, { day: "numeric" });
    return `${day.format(start)}–${fmt.format(end)}`;
  }
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function pickI18n(value: unknown, locale: string, fallback = "es"): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    if (typeof v[locale] === "string") return v[locale] as string;
    if (typeof v[fallback] === "string") return v[fallback] as string;
  }
  return "";
}

export function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function readingTime(text: string): number {
  const wordsPerMinute = 220;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `SOL-${year}-${random}`;
}

export function fairStatusFromDates(start: Date, end: Date): "UPCOMING" | "ONGOING" | "PAST" {
  const now = Date.now();
  if (now < start.getTime()) return "UPCOMING";
  if (now > end.getTime()) return "PAST";
  return "ONGOING";
}
