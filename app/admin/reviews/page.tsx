import Link from "next/link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { pickI18n } from "@/lib/utils";
import { ModerateButtons } from "./ModerateButtons";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const reviews = await prisma.review.findMany({
    where: { ...(status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : { status: "PENDING" }) },
    include: { product: { select: { slug: true, name: true } }, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="display text-3xl">Reseñas</h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1">{reviews.length} reseñas</p>
        </div>
      </header>

      <nav className="flex gap-2">
        {[
          { key: "PENDING", label: "Pendientes" },
          { key: "APPROVED", label: "Aprobadas" },
          { key: "REJECTED", label: "Rechazadas" },
        ].map((t) => (
          <Link
            key={t.key}
            href={`/admin/reviews?status=${t.key}`}
            className={`accent text-[0.7rem] px-4 py-2 rounded-full border ${
              (status ?? "PENDING") === t.key
                ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {reviews.length === 0 ? (
        <p className="card-velvet p-12 text-center text-[var(--color-ink-muted)]">No hay reseñas con ese estado.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="card-velvet p-6 grid md:grid-cols-[1fr_auto] gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-[var(--color-ink-subtle)]"}`} />
                    ))}
                  </div>
                  <span className="text-[var(--color-ink-subtle)]">
                    sobre <Link href={`/perfumes/${r.product.slug}`} className="text-[var(--color-gold)]">{pickI18n(r.product.name, "es")}</Link>
                    {" "}· por {r.user.name ?? r.user.email}
                  </span>
                </div>
                {r.title && <p className="display text-lg">{r.title}</p>}
                <p className="text-sm text-[var(--color-ink-muted)]">{r.body}</p>
              </div>
              <ModerateButtons id={r.id} status={r.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
