import { useTranslations } from "next-intl";

export function OlfactivePyramid() {
  const t = useTranslations("home.pyramid");

  const tiers = [
    { key: "top", label: t("top"), desc: t("topDesc"), width: "60%" },
    { key: "heart", label: t("heart"), desc: t("heartDesc"), width: "80%" },
    { key: "base", label: t("base"), desc: t("baseDesc"), width: "100%" },
  ];

  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <header className="mb-14 text-center max-w-2xl mx-auto">
        <p className="accent text-[0.7rem] text-[var(--color-gold)] mb-3">{t("kicker")}</p>
        <h2 className="display text-3xl md:text-5xl">{t("title")}</h2>
        <p className="mt-4 text-lg text-[var(--color-ink-muted)]">{t("subtitle")}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-3 flex flex-col items-center">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className="card-velvet relative px-8 py-6 text-center"
              style={{ width: tier.width }}
            >
              <p className="accent text-[0.7rem] text-[var(--color-gold)] mb-2">{tier.label}</p>
              <p className="text-sm text-[var(--color-ink-muted)]">{tier.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {tiers.map((tier, i) => (
            <div key={tier.key} className="border-l-2 border-[var(--color-gold-deep)] pl-6">
              <p className="accent text-[0.65rem] text-[var(--color-gold)]">
                {String(i + 1).padStart(2, "0")} · {tier.label}
              </p>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
