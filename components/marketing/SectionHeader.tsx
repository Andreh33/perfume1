export function SectionHeader({
  kicker,
  title,
  subtitle,
  align = "center",
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={`mb-12 ${align === "center" ? "text-center max-w-2xl mx-auto" : ""}`}>
      {kicker && <p className="accent text-[0.7rem] text-[var(--color-gold)] mb-3">{kicker}</p>}
      <h2 className="display text-3xl md:text-5xl text-[var(--color-ink)]">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg text-[var(--color-ink-muted)]">{subtitle}</p>
      )}
    </header>
  );
}
