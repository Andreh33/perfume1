"use client";

import { useTransition } from "react";
import { Check, Loader2, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { setReviewStatusAction } from "./actions";

export function ModerateButtons({ id, status }: { id: string; status: "PENDING" | "APPROVED" | "REJECTED" }) {
  const [pending, start] = useTransition();

  const set = (s: "PENDING" | "APPROVED" | "REJECTED") =>
    start(async () => {
      const r = await setReviewStatusAction(id, s);
      if (r.ok) toast.success(`Reseña ${s.toLowerCase()}`);
      else toast.error(r.error ?? "Error");
    });

  return (
    <div className="flex md:flex-col gap-2 self-start">
      <button
        type="button"
        onClick={() => set("APPROVED")}
        disabled={pending || status === "APPROVED"}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[oklch(0.20_0.04_145_/_0.4)] text-[var(--color-success)] text-xs hover:bg-[oklch(0.20_0.04_145_/_0.6)] disabled:opacity-40"
      >
        {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
        Aprobar
      </button>
      <button
        type="button"
        onClick={() => set("REJECTED")}
        disabled={pending || status === "REJECTED"}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[oklch(0.20_0.04_25_/_0.4)] text-[var(--color-danger)] text-xs hover:bg-[oklch(0.20_0.04_25_/_0.6)] disabled:opacity-40"
      >
        <X className="h-3 w-3" />
        Rechazar
      </button>
      <button
        type="button"
        onClick={() => set("PENDING")}
        disabled={pending || status === "PENDING"}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)] text-xs disabled:opacity-40"
      >
        <Clock className="h-3 w-3" />
        Pendiente
      </button>
    </div>
  );
}
