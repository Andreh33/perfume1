"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSettingAction } from "../actions";

type Zone = { name: string; countries: string[]; ratesCents: number; etaDays: string };

export function ShippingForm({
  initial,
}: {
  initial: { standardCents: number; freeThresholdCents: number; zones: Zone[] };
}) {
  const [pending, start] = useTransition();
  const [standard, setStandard] = useState(initial.standardCents);
  const [threshold, setThreshold] = useState(initial.freeThresholdCents);
  const [zones, setZones] = useState<Zone[]>(initial.zones);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const updates = await Promise.all([
        updateSettingAction({ key: "shipping.standardCents", value: Number(standard) }),
        updateSettingAction({ key: "shipping.freeThresholdCents", value: Number(threshold) }),
        updateSettingAction({ key: "shipping.zones", value: zones }),
      ]);
      if (updates.every((r) => r.ok)) toast.success("Ajustes de envío guardados");
      else toast.error("Algunos cambios no se guardaron");
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="card-velvet p-6 space-y-4">
        <h2 className="display text-xl">Tarifas globales</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Envío estándar (céntimos)">
            <Input type="number" value={standard} onChange={(e) => setStandard(+e.target.value)} />
          </Field>
          <Field label="Envío gratis a partir de (céntimos)">
            <Input type="number" value={threshold} onChange={(e) => setThreshold(+e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="card-velvet p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="display text-xl">Zonas</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setZones((z) => [...z, { name: "Zona", countries: [], ratesCents: 990, etaDays: "" }])}
          >
            <Plus className="h-4 w-4" /> Añadir
          </Button>
        </div>

        <ul className="space-y-3">
          {zones.map((z, i) => (
            <li key={`${z.name}-${i}`} className="grid md:grid-cols-[1.5fr_2fr_1fr_1fr_auto] gap-3 items-end">
              <Field label="Nombre">
                <Input value={z.name} onChange={(e) => updateZone(i, "name", e.target.value)} />
              </Field>
              <Field label="Países (ISO 2, separados por coma)">
                <Input
                  value={z.countries.join(", ")}
                  onChange={(e) =>
                    updateZone(
                      i,
                      "countries",
                      e.target.value
                        .split(",")
                        .map((c) => c.trim().toUpperCase())
                        .filter(Boolean),
                    )
                  }
                />
              </Field>
              <Field label="Tarifa (cents)">
                <Input type="number" value={z.ratesCents} onChange={(e) => updateZone(i, "ratesCents", +e.target.value)} />
              </Field>
              <Field label="ETA">
                <Input value={z.etaDays} onChange={(e) => updateZone(i, "etaDays", e.target.value)} />
              </Field>
              <button
                type="button"
                onClick={() => setZones((all) => all.filter((_, j) => j !== i))}
                aria-label="Eliminar zona"
                className="text-[var(--color-danger)] mb-3"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar
      </Button>
    </form>
  );

  function updateZone<K extends keyof Zone>(i: number, key: K, value: Zone[K]) {
    setZones((all) => all.map((z, j) => (j === i ? { ...z, [key]: value } : z)));
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="accent text-[0.65rem] text-[var(--color-gold)]">{label}</span>
      {children}
    </label>
  );
}
