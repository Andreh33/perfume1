"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Heart, Search, ShoppingBag, User, Menu, X, Globe } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { localeMeta, locales, type Locale } from "@/lib/i18n/config";

type NavLink = { href: string; key: string };

const links: NavLink[] = [
  { href: "/perfumes", key: "perfumes" },
  { href: "/colecciones", key: "collections" },
  { href: "/notas-olfativas", key: "notes" },
  { href: "/ferias", key: "fairs" },
  { href: "/historia", key: "story" },
  { href: "/blog", key: "blog" },
];

export function Header({ cartCount = 0, locale }: { cartCount?: number; locale: Locale }) {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLocale, setShowLocale] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-500",
        scrolled
          ? "border-b border-[oklch(0.55_0.10_70_/_0.25)] bg-[oklch(0.14_0.015_60_/_0.85)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 md:px-8">
        <button
          type="button"
          className="md:hidden p-2 -ml-2 text-[var(--color-ink)]"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t("close") : t("menu")}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Logo />

        <nav className="hidden md:flex items-center gap-9" aria-label="Principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="accent text-[0.7rem] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-gold)]"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            type="button"
            className="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors"
            aria-label={t("search")}
          >
            <Search className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              type="button"
              className="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors inline-flex items-center gap-1"
              onClick={() => setShowLocale((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={showLocale}
              aria-label="Idioma"
            >
              <Globe className="h-5 w-5" />
              <span className="hidden md:inline accent text-[0.65rem]">{locale.toUpperCase()}</span>
            </button>
            {showLocale && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 min-w-[180px] rounded-md border border-[var(--color-gold-deep)] bg-[var(--color-bg-velvet)] shadow-2xl"
                onMouseLeave={() => setShowLocale(false)}
              >
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={`/?locale=${l}`}
                    role="menuitem"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm hover:bg-[oklch(0.78_0.13_82_/_0.08)]",
                      l === locale ? "text-[var(--color-gold)]" : "text-[var(--color-ink-muted)]",
                    )}
                  >
                    <span aria-hidden>{localeMeta[l].flag}</span>
                    <span>{localeMeta[l].native}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/cuenta/favoritos"
            className="hidden md:inline-flex p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors"
            aria-label={t("wishlist")}
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            href="/cuenta"
            className="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors"
            aria-label={t("account")}
          >
            <User className="h-5 w-5" />
          </Link>

          <Link
            href="/carrito"
            className="relative p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors"
            aria-label={`${t("cart")} (${cartCount})`}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span
                aria-hidden
                className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-gold)] px-1 text-[0.65rem] font-semibold text-[var(--color-bg-deep)] animate-pulse-gold"
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <nav
          className="md:hidden border-t border-[oklch(0.55_0.10_70_/_0.2)] bg-[oklch(0.14_0.015_60_/_0.95)] backdrop-blur-xl px-6 py-6 space-y-2"
          aria-label="Móvil"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block accent text-sm py-2 text-[var(--color-ink)] hover:text-[var(--color-gold)]"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
