import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

export function Topbar() {
  const t = useTranslations("topbar");

  return (
    <div
      role="region"
      aria-label="Anuncios"
      className="relative z-30 hidden md:block border-b border-[oklch(0.55_0.10_70_/_0.2)] bg-[oklch(0.18_0.020_55)]"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-6 px-6 py-2 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold)]" aria-hidden />
          {t("shipping")}
        </span>
        <span className="h-3 w-px bg-[var(--color-gold-deep)] opacity-50" aria-hidden />
        <span>{t("sample")}</span>
      </div>
    </div>
  );
}
