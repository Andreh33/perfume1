import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Sol Perfumes Árabes — Inicio"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <svg
        viewBox="0 0 48 48"
        width="40"
        height="40"
        className="shrink-0 transition-transform duration-500 group-hover:rotate-[20deg]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sol-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.86 0.15 88)" />
            <stop offset="60%" stopColor="oklch(0.78 0.13 82)" />
            <stop offset="100%" stopColor="oklch(0.55 0.10 70)" />
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="9" fill="url(#sol-grad)" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          const x1 = 24 + Math.cos(angle) * 12;
          const y1 = 24 + Math.sin(angle) * 12;
          const x2 = 24 + Math.cos(angle) * (i % 2 === 0 ? 21 : 17);
          const y2 = 24 + Math.sin(angle) * (i % 2 === 0 ? 21 : 17);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="oklch(0.78 0.13 82)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="display text-xl text-[var(--color-ink)]">Sol</span>
          <span className="accent text-[0.6rem] text-[var(--color-gold)]">Perfumes Árabes</span>
        </span>
      )}
    </Link>
  );
}
