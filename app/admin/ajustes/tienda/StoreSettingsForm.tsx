"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSettingAction } from "../actions";

type I18n = { es: string; en: string; ar: string };

type Initial = {
  "store.name"?: string;
  "store.tagline"?: I18n;
  "store.currency"?: string;
  "store.country"?: string;
  "topbar.enabled"?: boolean;
  "topbar.message"?: I18n;
};

export function StoreSettingsForm({ initial }: { initial: Initial }) {
  const [pending, start] = useTransition();
  const [name, setName] = useState(initial["store.name"] ?? "Sol Perfumes Árabes");
  const [tagline, setTagline] = useState<I18n>(
    initial["store.tagline"] ?? { es: "Perfumería árabe de nicho", en: "Arabian niche perfumery", ar: "عطور عربية نيشية" },
  );
  const [currency, setCurrency] = useState(initial["store.currency"] ?? "EUR");
  const [country, setCountry] = useState(initial["store.country"] ?? "ES");
  const [topbarEnabled, setTopbarEnabled] = useState(initial["topbar.enabled"] ?? true);
  const [topbarMessage, setTopbarMessage] = useState<I18n>(
    initial["topbar.message"] ?? { es: "", en: "", ar: "" },
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const updates = [
        ["store.name", name],
        ["store.tagline", tagline],
        ["store.currency", currency],
        ["store.country", country],
        ["topbar.enabled", topbarEnabled],
        ["topbar.message", topbarMessage],
      ] as const;
      const results = await Promise.all(
        updates.map(([key, value]) => updateSettingAction({ key, value })),
      );
      const failed = results.filter((r) => !r.ok);
      if (failed.length === 0) toast.success("Ajustes guardados");
      else toast.error("Algunos ajustes no se guardaron");
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="card-velvet p-6 space-y-5">
        <h2 className="display text-xl">Identidad</h2>
        <Field label="Nombre de la tienda">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <I18nField label="Tagline" value={tagline} onChange={setTagline} />
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Moneda">
            <Input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={3} />
          </Field>
          <Field label="País por defecto (ISO 2)">
            <Input value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} maxLength={2} />
          </Field>
        </div>
      </section>

      <section className="card-velvet p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="display text-xl">Banner promocional</h2>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={topbarEnabled}
              onChange={(e) => setTopbarEnabled(e.target.checked)}
              className="accent-[var(--color-gold)] h-4 w-4"
            />
            Mostrar
          </label>
        </div>
        <I18nField label="Mensaje" value={topbarMessage} onChange={setTopbarMessage} disabled={!topbarEnabled} />
      </section>

      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar
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

function I18nField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: I18n;
  onChange: (v: I18n) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="accent text-[0.65rem] text-[var(--color-gold)]">{label}</p>
      <div className="grid md:grid-cols-3 gap-3">
        {(["es", "en", "ar"] as const).map((l) => (
          <label key={l} className="block space-y-1">
            <span className="text-[0.6rem] uppercase tracking-widest text-[var(--color-ink-subtle)]">{l}</span>
            <Input
              dir={l === "ar" ? "rtl" : "ltr"}
              value={value[l] ?? ""}
              onChange={(e) => onChange({ ...value, [l]: e.target.value })}
              disabled={disabled}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
