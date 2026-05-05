"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setOrderStatusAction, setTrackingAction } from "../actions";

const STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;
type Status = (typeof STATUSES)[number];

export function OrderActions({
  id,
  status: initialStatus,
  carrier: initialCarrier,
  trackingNumber: initialTrackingNumber,
  trackingUrl: initialTrackingUrl,
}: {
  id: string;
  status: Status;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
}) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [carrier, setCarrier] = useState(initialCarrier);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [trackingUrl, setTrackingUrl] = useState(initialTrackingUrl);

  const onChangeStatus = (next: Status) =>
    start(async () => {
      const r = await setOrderStatusAction({ id, status: next });
      if (r.ok) {
        setStatus(next);
        toast.success(`Estado: ${next}`);
      } else {
        toast.error(r.error ?? "Error");
      }
    });

  const onShip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrier || !trackingNumber) return;
    start(async () => {
      const r = await setTrackingAction({ id, carrier, trackingNumber, trackingUrl: trackingUrl || undefined });
      if (r.ok) {
        setStatus("SHIPPED");
        toast.success("Tracking guardado y email enviado");
      } else {
        toast.error(r.error ?? "Error");
      }
    });
  };

  return (
    <section className="card-velvet p-6 grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="display text-xl mb-4">Estado</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChangeStatus(s)}
              disabled={pending || status === s}
              className={`accent text-[0.65rem] px-3 py-2 rounded-full border ${
                status === s
                  ? "border-[var(--color-gold)] text-[var(--color-gold)] bg-[oklch(0.78_0.13_82_/_0.1)]"
                  : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)] hover:border-[var(--color-gold-deep)]"
              } disabled:opacity-50`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onShip} className="space-y-3">
        <h2 className="display text-xl">Marcar como enviado</h2>
        <div className="grid grid-cols-2 gap-2">
          <Input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="Carrier (Correos…)" />
          <Input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Nº seguimiento" />
        </div>
        <Input value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} placeholder="URL de seguimiento (opcional)" />
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
          Guardar y notificar
        </Button>
      </form>
    </section>
  );
}
