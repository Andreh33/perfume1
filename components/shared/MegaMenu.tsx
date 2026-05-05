"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type MegaCollection = {
  slug: string;
  name: string;
  bannerImage?: string | null;
};

type MegaNote = {
  slug: string;
  name: string;
};

export function MegaMenu({
  collections,
  notes,
}: {
  collections: MegaCollection[];
  notes: MegaNote[];
}) {
  const [open, setOpen] = useState<null | "perfumes" | "ferias">(null);

  return (
    <div className="hidden md:flex items-center gap-9 relative" onMouseLeave={() => setOpen(null)}>
      <button
        type="button"
        onClick={() => setOpen(open === "perfumes" ? null : "perfumes")}
        onMouseEnter={() => setOpen("perfumes")}
        aria-expanded={open === "perfumes"}
        className={cn(
          "accent text-[0.7rem] inline-flex items-center gap-1 transition-colors",
          open === "perfumes" ? "text-[var(--color-gold)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]",
        )}
      >
        Perfumes <ChevronDown className={cn("h-3 w-3 transition-transform", open === "perfumes" && "rotate-180")} />
      </button>

      <Link
        href="/colecciones"
        className="accent text-[0.7rem] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-gold)]"
      >
        Colecciones
      </Link>

      <Link
        href="/notas-olfativas"
        className="accent text-[0.7rem] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-gold)]"
      >
        Notas
      </Link>

      <Link
        href="/ferias"
        className="accent text-[0.7rem] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-gold)]"
      >
        Ferias
      </Link>

      <Link
        href="/historia"
        className="accent text-[0.7rem] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-gold)]"
      >
        Historia
      </Link>

      <Link
        href="/blog"
        className="accent text-[0.7rem] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-gold)]"
      >
        Diario
      </Link>

      {/* Panel mega-menú */}
      {open === "perfumes" && (
        <div
          role="menu"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[min(960px,90vw)] grid grid-cols-12 gap-6 p-8 rounded-xl border border-[var(--color-gold-deep)] bg-[oklch(0.18_0.020_55)] shadow-[0_30px_80px_oklch(0_0_0_/_0.6)] animate-fade-in"
        >
          <div className="col-span-4 space-y-3">
            <p className="accent text-[0.6rem] text-[var(--color-gold)]">Por género</p>
            <ul className="space-y-1.5">
              {[
                { label: "Para él", path: "/perfumes?gender=MASCULINO" },
                { label: "Para ella", path: "/perfumes?gender=FEMENINO" },
                { label: "Unisex", path: "/perfumes?gender=UNISEX" },
              ].map((g) => (
                <li key={g.path}>
                  <Link
                    href={g.path}
                    className="block text-sm py-1 text-[var(--color-ink)] hover:text-[var(--color-gold)]"
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="accent text-[0.6rem] text-[var(--color-gold)] pt-4">Notas favoritas</p>
            <div className="flex flex-wrap gap-1.5">
              {notes.slice(0, 8).map((n) => (
                <Link key={n.slug} href={`/perfumes?note=${n.slug}`} className="note-chip">
                  {n.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-8">
            <p className="accent text-[0.6rem] text-[var(--color-gold)] mb-3">Colecciones</p>
            <div className="grid grid-cols-3 gap-3">
              {collections.slice(0, 3).map((c) => (
                <Link
                  key={c.slug}
                  href={`/colecciones/${c.slug}`}
                  className="card-velvet group block aspect-[4/5] overflow-hidden relative"
                >
                  {c.bannerImage ? (
                    <Image
                      src={c.bannerImage}
                      alt={c.name}
                      fill
                      sizes="240px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.30 0.05 50), oklch(0.18 0.04 60))",
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.015_60)] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="display text-base text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
                      {c.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/perfumes"
              className="mt-4 inline-flex accent text-[0.7rem] text-[var(--color-gold)] hover:text-[var(--color-gold-bright)]"
            >
              Ver catálogo completo →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
