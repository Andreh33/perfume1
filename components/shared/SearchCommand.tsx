"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Package, Calendar, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Result = {
  products: Array<{ slug: string; name: string; image: string | null }>;
  fairs: Array<{ slug: string; title: string; city: string }>;
  posts: Array<{ slug: string; title: string }>;
};

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result>({ products: [], fairs: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("sol:open-search", () => setOpen(true));
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults({ products: [], fairs: [], posts: [] });
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ products: [], fairs: [], posts: [] });
      return;
    }
    const ctrl = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ctrl;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: ctrl.signal });
        if (res.ok) setResults(await res.json());
      } catch {
        // aborted or network — ignore
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Búsqueda"
      className="fixed inset-0 z-[60] grid place-items-start justify-center pt-[10vh] px-4 bg-[oklch(0.10_0.01_60_/_0.85)] backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <Command
        className="w-full max-w-2xl rounded-xl border border-[var(--color-gold-deep)] bg-[var(--color-bg-velvet)] shadow-[0_30px_80px_oklch(0_0_0_/_0.6)] overflow-hidden"
        loop
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[oklch(0.55_0.10_70_/_0.2)]">
          <Search className="h-4 w-4 text-[var(--color-gold)]" aria-hidden />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Busca un perfume, una nota, una feria…"
            className="flex-1 bg-transparent border-0 outline-none text-[var(--color-ink)] placeholder-[var(--color-ink-subtle)] text-base"
            autoFocus
          />
          <kbd className="hidden md:inline accent text-[0.65rem] text-[var(--color-ink-subtle)] px-2 py-1 rounded border border-[oklch(0.55_0.10_70_/_0.3)]">
            ESC
          </kbd>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="md:hidden text-[var(--color-ink-muted)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          {loading && <Command.Loading className="px-4 py-3 text-sm text-[var(--color-ink-muted)]">Buscando…</Command.Loading>}

          {!loading && query.length < 2 && (
            <Quick
              items={[
                { label: "Bestsellers", path: "/perfumes?sort=newest", icon: Package },
                { label: "Próximas ferias", path: "/ferias?status=UPCOMING", icon: Calendar },
                { label: "Diccionario olfativo", path: "/notas-olfativas", icon: FileText },
              ]}
              onPick={go}
            />
          )}

          {!loading && query.length >= 2 && results.products.length === 0 && results.fairs.length === 0 && results.posts.length === 0 && (
            <Command.Empty className="px-4 py-8 text-center text-sm text-[var(--color-ink-muted)]">
              Sin resultados para «{query}».
            </Command.Empty>
          )}

          {results.products.length > 0 && (
            <Command.Group heading="Perfumes" className={groupCls}>
              {results.products.map((p) => (
                <Command.Item
                  key={p.slug}
                  value={`product-${p.slug}`}
                  onSelect={() => go(`/perfumes/${p.slug}`)}
                  className={itemCls}
                >
                  <Package className="h-4 w-4 text-[var(--color-gold)]" />
                  <span className="display">{p.name}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {results.fairs.length > 0 && (
            <Command.Group heading="Ferias" className={groupCls}>
              {results.fairs.map((f) => (
                <Command.Item
                  key={f.slug}
                  value={`fair-${f.slug}`}
                  onSelect={() => go(`/ferias/${f.slug}`)}
                  className={itemCls}
                >
                  <Calendar className="h-4 w-4 text-[var(--color-gold)]" />
                  <span>
                    <span className="display">{f.title}</span>{" "}
                    <span className="text-xs text-[var(--color-ink-subtle)]">· {f.city}</span>
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {results.posts.length > 0 && (
            <Command.Group heading="Diario" className={groupCls}>
              {results.posts.map((p) => (
                <Command.Item
                  key={p.slug}
                  value={`post-${p.slug}`}
                  onSelect={() => go(`/blog/${p.slug}`)}
                  className={itemCls}
                >
                  <FileText className="h-4 w-4 text-[var(--color-gold)]" />
                  <span>{p.title}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>

        <footer className="flex items-center gap-4 px-5 py-2.5 border-t border-[oklch(0.55_0.10_70_/_0.2)] text-[0.7rem] text-[var(--color-ink-subtle)]">
          <span>↑↓ navegar</span>
          <span>↵ abrir</span>
          <span className="hidden md:inline">⌘K alternar</span>
        </footer>
      </Command>
    </div>
  );
}

const groupCls = "[&_[cmdk-group-heading]]:accent [&_[cmdk-group-heading]]:text-[0.6rem] [&_[cmdk-group-heading]]:text-[var(--color-gold)] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-2";
const itemCls = cn(
  "flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-sm",
  "data-[selected=true]:bg-[oklch(0.78_0.13_82_/_0.1)] data-[selected=true]:text-[var(--color-gold)]",
);

function Quick({
  items,
  onPick,
}: {
  items: Array<{ label: string; path: string; icon: React.ElementType }>;
  onPick: (p: string) => void;
}) {
  return (
    <Command.Group heading="Ir a" className={groupCls}>
      {items.map((i) => (
        <Command.Item key={i.path} value={`quick-${i.path}`} onSelect={() => onPick(i.path)} className={itemCls}>
          <i.icon className="h-4 w-4 text-[var(--color-gold)]" />
          {i.label}
        </Command.Item>
      ))}
    </Command.Group>
  );
}
