import Link from "next/link";

const tabs = [
  { href: "/admin/ajustes/tienda", label: "Tienda" },
  { href: "/admin/ajustes/envios", label: "Envíos" },
  { href: "/admin/ajustes/impuestos", label: "Impuestos" },
  { href: "/admin/ajustes/apariencia", label: "Apariencia" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="display text-3xl">Ajustes</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
          Estos cambios se reflejan en la tienda en menos de un minuto.
        </p>
      </header>

      <nav aria-label="Pestañas de ajustes" className="flex gap-1 border-b border-[oklch(0.55_0.10_70_/_0.2)]">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="accent text-[0.65rem] px-4 py-2.5 -mb-px border-b-2 border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
