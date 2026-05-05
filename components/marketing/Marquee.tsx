import { useTranslations } from "next-intl";

export function Marquee() {
  const t = useTranslations("home.marquee");
  const items = (t.raw("items") as string[]) ?? [];
  const doubled = [...items, ...items, ...items];

  return (
    <section
      aria-hidden
      className="overflow-hidden border-y border-[oklch(0.55_0.10_70_/_0.2)] bg-[oklch(0.16_0.020_60)] py-5"
    >
      <div className="marquee-track flex w-max gap-12 will-change-transform">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="accent text-xs md:text-sm text-[var(--color-gold)] inline-flex items-center gap-12"
          >
            {item}
            <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden>
              <circle cx="3" cy="3" r="3" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  );
}
