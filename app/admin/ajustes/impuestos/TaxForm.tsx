"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSettingAction } from "../actions";

type Rate = { country: string; label: string; rate: number };

export function TaxForm({ initialRates }: { initialRates: Rate[] }) {
  const [pending, start] = useTransition();
  const [rates, setRates] = useState<Rate[]>(initialRates);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await updateSettingAction({ key: "tax.rates", value: rates });
      if (r.ok) toast.success("Tipos guardados");
      else toast.error(r.error ?? "Error");
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="card-velvet p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="display text-xl">IVA por país</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setRates((r) => [...r, { country: "", label: "", rate: 0.21 }])}
          >
            <Plus className="h-4 w-4" /> Añadir
          </Button>
        </div>

        <ul className="space-y-3">
          {rates.map((r, i) => (
            <li key={`${r.country}-${i}`} className="grid md:grid-cols-[100px_1fr_140px_auto] gap-3 items-end">
              <Field label="País">
                <Input
                  value={r.country}
                  onChange={(e) => update(i, "country", e.target.value.toUpperCase())}
                  maxLength={2}
                  className="uppercase"
                />
              </Field>
              <Field label="Etiqueta">
                <Input value={r.label} onChange={(e) => update(i, "label", e.target.value)} />
              </Field>
              <Field label="Tipo (decimal: 0.21 = 21 %)">
                <Input
                  type="number"
                  step="0.01"
                  value={r.rate}
                  onChange={(e) => update(i, "rate", +e.target.value)}
                />
              </Field>
              <button
                type="button"
                onClick={() => setRates((all) => all.filter((_, j) => j !== i))}
                aria-label="Eliminar"
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

  function update<K extends keyof Rate>(i: number, key: K, value: Rate[K]) {
    setRates((all) => all.map((r, j) => (j === i ? { ...r, [key]: value } : r)));
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
