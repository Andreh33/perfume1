import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Folder,
  Sparkles,
  ShoppingCart,
  Users,
  Calendar,
  FileText,
  Tag,
  MessageSquare,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { auth } from "@/lib/auth";

const sections = [
  {
    title: "Tienda",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/productos", label: "Productos", icon: Package },
      { href: "/admin/colecciones", label: "Colecciones", icon: Folder },
      { href: "/admin/notas-olfativas", label: "Notas olfativas", icon: Sparkles },
      { href: "/admin/inventario", label: "Inventario", icon: Package },
    ],
  },
  {
    title: "Ventas",
    items: [
      { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
      { href: "/admin/clientes", label: "Clientes", icon: Users },
      { href: "/admin/cupones", label: "Cupones", icon: Tag },
      { href: "/admin/reviews", label: "Reseñas", icon: MessageSquare },
    ],
  },
  {
    title: "Contenido",
    items: [
      { href: "/admin/ferias", label: "Ferias", icon: Calendar },
      { href: "/admin/blog", label: "Blog", icon: FileText },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
      { href: "/admin/ajustes/tienda", label: "Ajustes", icon: Settings },
    ],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    redirect("/cuenta/iniciar-sesion?callbackUrl=/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-[oklch(0.10_0.01_60)]">
      <aside className="hidden md:flex flex-col w-64 border-r border-[oklch(0.55_0.10_70_/_0.2)] bg-[oklch(0.14_0.015_60)]">
        <div className="px-6 py-5 border-b border-[oklch(0.55_0.10_70_/_0.2)]">
          <Logo />
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6" aria-label="Navegación admin">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="accent text-[0.6rem] text-[var(--color-ink-subtle)] mb-2 px-3">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--color-ink-muted)] hover:bg-[oklch(0.78_0.13_82_/_0.08)] hover:text-[var(--color-gold)] transition-colors"
                    >
                      <item.icon className="h-4 w-4 group-hover:text-[var(--color-gold)]" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[oklch(0.55_0.10_70_/_0.2)]">
          <p className="text-xs text-[var(--color-ink-muted)] mb-2 truncate">{session.user.email}</p>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-xs text-[var(--color-danger)] hover:underline"
            >
              <LogOut className="h-3.5 w-3.5" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-20 bg-[oklch(0.14_0.015_60_/_0.9)] backdrop-blur-md border-b border-[oklch(0.55_0.10_70_/_0.2)]">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="hidden md:block accent text-[0.65rem] text-[var(--color-ink-muted)]">Panel admin</div>
            <input
              type="search"
              placeholder="Buscar (Cmd+K)"
              className="field max-w-md flex-1 !py-1.5"
              aria-label="Buscar"
            />
            <Link href="/" className="accent text-[0.65rem] text-[var(--color-gold)]">
              Ver tienda →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
