"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveCouponAction } from "./actions";

function randomCode() {
  return Array.from({ length: 8 })
    .map(() => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)])
    .join("");
}

export function CouponForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [code, setCode] = useState(randomCode());
  const [type, setType] = useState<"PERCENT" | "FIXED" | "FREE_SHIPPING">("PERCENT");
  const [value, setValue] = useState(1000); // 10 % en basis points
  const [minSubtotalCents, setMinSubtotalCents] = useState(0);
  const [maxRedemptions, setMaxRedemptions] = useState<number | "">("");
  const [firstOrderOnly, setFirstOrderOnly] = useState(false);
  const [startsAt, setStartsAt] = useState<string>("");
  const [endsAt, setEndsAt] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await saveCouponAction({
        data: {
          code,
          type,
          value: Number(value),
          minSubtotalCents: Number(minSubtotalCents),
          maxRedemptions: maxRedemptions === "" ? null : Number(maxRedemptions),
          firstOrderOnly,
          startsAt: startsAt ? new Date(startsAt) : null,
          endsAt: endsAt ? new Date(endsAt) : null,
          isActive,
          description: description || undefined,
        },
      });
      if (r.ok) {
        toast.success("Cupón guardado");
        router.push("/admin/cupones");
        router.refresh();
      } else toast.error(r.error ?? "Error");
    });
  };

  return (
    <form onSubmit={onSubmit} className="card-velvet p-6 space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Código">
          <div className="flex gap-2">
            <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="font-mono tracking-widest" />
            <Button type="button" variant="ghost" size="sm" onClick={() => setCode(randomCode())}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </Field>
        <Field label="Tipo">
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="field">
            <option value="PERCENT">Porcentaje</option>
            <option value="FIXED">Importe fijo</option>
            <option value="FREE_SHIPPING">Envío gratis</option>
          </select>
        </Field>
      </div>

      {type === "PERCENT" && (
        <Field label="Porcentaje (en basis points: 1000 = 10 %)">
          <Input type="number" value={value} onChange={(e) => setValue(+e.target.value)} />
        </Field>
      )}
      {type === "FIXED" && (
        <Field label="Descuento (céntimos)">
          <Input type="number" value={value} onChange={(e) => setValue(+e.target.value)} />
        </Field>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Mínimo de carrito (céntimos)">
          <Input type="number" value={minSubtotalCents} onChange={(e) => setMinSubtotalCents(+e.target.value)} />
        </Field>
        <Field label="Usos máximos (opcional)">
          <Input
            type="number"
            value={maxRedemptions}
            onChange={(e) => setMaxRedemptions(e.target.value === "" ? "" : +e.target.value)}
          />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Vigente desde">
          <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        </Field>
        <Field label="Vigente hasta">
          <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </Field>
      </div>

      <Field label="Descripción interna">
        <textarea rows={2} className="field" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>

      <div className="flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={firstOrderOnly}
            onChange={(e) => setFirstOrderOnly(e.target.checked)}
            className="accent-[var(--color-gold)] h-4 w-4"
          />
          Solo primer pedido
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="accent-[var(--color-gold)] h-4 w-4"
          />
          Activo
        </label>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar cupón
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="accent text-[0.65rem] text-[var(--color-gold)]">{label}</span>
      {children}
    </label>
  );
}
