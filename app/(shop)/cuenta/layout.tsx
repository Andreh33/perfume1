import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const tabs = [
  { href: "/cuenta", label: "Resumen" },
  { href: "/cuenta/pedidos", label: "Pedidos" },
  { href: "/cuenta/direcciones", label: "Direcciones" },
  { href: "/cuenta/favoritos", label: "Favoritos" },
  { href: "/cuenta/seguridad", label: "Seguridad" },
  { href: "/cuenta/ajustes", label: "Ajustes" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/cuenta/iniciar-sesion");

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-12">
      <header className="mb-10">
        <p className="accent text-[0.7rem] text-[var(--color-gold)]">Mi cuenta</p>
        <h1 className="display text-3xl md:text-4xl">Hola, {session.user.name ?? session.user.email}</h1>
      </header>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        <nav aria-label="Cuenta" className="lg:sticky lg:top-28 lg:self-start space-y-1">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="block accent text-xs px-4 py-2.5 rounded-md text-[var(--color-ink-muted)] hover:bg-[oklch(0.78_0.13_82_/_0.08)] hover:text-[var(--color-gold)]"
            >
              {t.label}
            </Link>
          ))}
          <form action="/api/auth/signout" method="post" className="pt-4">
            <button type="submit" className="accent text-xs text-[var(--color-danger)] hover:underline">
              Cerrar sesión
            </button>
          </form>
        </nav>

        <section>{children}</section>
      </div>
    </div>
  );
}
