"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSettingAction } from "../actions";

export function AppearanceForm({
  initial,
}: {
  initial: { videoUrl: string; imageUrl: string; ctaLabel: string; ctaUrl: string; copy: string };
}) {
  const [pending, start] = useTransition();
  const [videoUrl, setVideoUrl] = useState(initial.videoUrl);
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [ctaLabel, setCtaLabel] = useState(initial.ctaLabel);
  const [ctaUrl, setCtaUrl] = useState(initial.ctaUrl);
  const [copy, setCopy] = useState(initial.copy);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const updates = await Promise.all([
        updateSettingAction({ key: "hero.video", value: videoUrl }),
        updateSettingAction({ key: "hero.image", value: imageUrl }),
        updateSettingAction({ key: "hero.cta", value: { label: ctaLabel, url: ctaUrl } }),
        updateSettingAction({ key: "hero.copy", value: copy }),
      ]);
      if (updates.every((r) => r.ok)) toast.success("Apariencia guardada");
      else toast.error("Algunos cambios no se guardaron");
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="card-velvet p-6 space-y-5">
        <h2 className="display text-xl">Hero de la home</h2>
        <p className="text-sm text-[var(--color-ink-muted)]">
          El vídeo tiene prioridad sobre la imagen. Deja vacío para usar el hero por defecto.
        </p>
        <Field label="URL del vídeo (mp4 / webm)">
          <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…/hero.mp4" />
        </Field>
        <Field label="URL de imagen de respaldo">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…/hero.jpg" />
        </Field>

        <Field label="Copy adicional (overlay)">
          <textarea rows={3} value={copy} onChange={(e) => setCopy(e.target.value)} className="field" />
        </Field>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="CTA — texto">
            <Input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Descubrir perfumes" />
          </Field>
          <Field label="CTA — URL">
            <Input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="/perfumes" />
          </Field>
        </div>
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
