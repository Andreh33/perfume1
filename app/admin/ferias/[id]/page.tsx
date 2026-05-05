import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FairForm } from "../FairForm";

export default async function EditFairPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fair = await prisma.perfumeFair.findUnique({ where: { id } });
  if (!fair) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="display text-3xl">Editar feria</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">{fair.slug}</p>
      </header>

      <FairForm
        defaultValues={{
          id: fair.id,
          slug: fair.slug,
          title: fair.title as { es: string; en: string; ar: string },
          description: (fair.description as { es: string; en: string; ar: string }) ?? { es: "", en: "", ar: "" },
          startDate: fair.startDate,
          endDate: fair.endDate,
          city: fair.city,
          country: fair.country,
          venue: fair.venue ?? "",
          address: fair.address ?? "",
          lat: fair.lat ?? undefined,
          lng: fair.lng ?? undefined,
          websiteUrl: fair.websiteUrl ?? "",
          ticketUrl: fair.ticketUrl ?? "",
          coverImage: fair.coverImage ?? "",
          isFeatured: fair.isFeatured,
          tags: fair.tags ?? [],
          status: fair.status,
        }}
      />
    </div>
  );
}
