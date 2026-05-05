import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden">
      {/* Halo radial dorado */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[800px] w-[1200px] max-w-[100vw] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.78 0.13 82 / 0.18), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12 pt-16 pb-32 md:pt-24 md:pb-40">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
          <p className="accent text-[0.7rem] text-[var(--color-gold)]">{t("kicker")}</p>

          <h1 className="display text-[clamp(3rem,7vw,7.5rem)] leading-[1.02] text-[var(--color-ink)]">
            {t("title")}
            <br />
            <span className="display-italic gold-text">{t("titleAccent")}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--color-ink-muted)]">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/perfumes" className="btn-primary">
              {t("ctaPrimary")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/colecciones" className="btn-ghost">
              {t("ctaSecondary")}
            </Link>
          </div>

          <div className="ornament-divider pt-12">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              <path
                d="M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
