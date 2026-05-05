"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { fairSchema, type FairInput } from "@/lib/validations/fair";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveFairAction } from "./actions";
import { slugify } from "@/lib/utils";

const blank: FairInput = {
  slug: "",
  title: { es: "", en: "", ar: "" },
  description: { es: "", en: "", ar: "" },
  startDate: new Date(),
  endDate: new Date(),
  timezone: "Europe/Madrid",
  allDay: false,
  city: "",
  country: "ES",
  venue: "",
  address: "",
  lat: undefined,
  lng: undefined,
  websiteUrl: undefined,
  ticketUrl: undefined,
  coverImage: undefined,
  gallery: [],
  status: "UPCOMING",
  statusManual: false,
  isFeatured: false,
  tags: [],
};

type Defaults = Partial<FairInput> & { id?: string };

export function FairForm({ defaultValues }: { defaultValues?: Defaults }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeLocale, setActiveLocale] = useState<"es" | "en" | "ar">("es");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FairInput>({
    resolver: zodResolver(fairSchema),
    defaultValues: { ...blank, ...defaultValues },
  });

  const titleValue = watch(`title.${activeLocale}`);

  const onSubmit = (data: FairInput) => {
    startTransition(async () => {
      const result = await saveFairAction({ id: defaultValues?.id, data });
      if (result.ok) {
        toast.success("Feria guardada");
        router.push("/admin/ferias");
        router.refresh();
      } else {
        toast.error(result.error ?? "Error al guardar");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="card-velvet p-6 space-y-5">
        <h2 className="display text-xl">General</h2>

        <div role="tablist" className="flex gap-2 border-b border-[oklch(0.55_0.10_70_/_0.2)]">
          {(["es", "en", "ar"] as const).map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={activeLocale === l}
              onClick={() => setActiveLocale(l)}
              className={`accent text-[0.65rem] px-4 py-2.5 -mb-px border-b-2 ${
                activeLocale === l
                  ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                  : "border-transparent text-[var(--color-ink-muted)]"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <Field label={`Título (${activeLocale.toUpperCase()})`} error={errors.title?.[activeLocale]?.message}>
          <Input
            value={titleValue ?? ""}
            onChange={(e) => {
              setValue(`title.${activeLocale}`, e.target.value);
              if (activeLocale === "es" && !defaultValues?.id) {
                setValue("slug", slugify(e.target.value));
              }
            }}
            dir={activeLocale === "ar" ? "rtl" : "ltr"}
          />
        </Field>

        <Field label={`Descripción (${activeLocale.toUpperCase()})`}>
          <textarea
            {...register(`description.${activeLocale}`)}
            rows={4}
            className="field"
            dir={activeLocale === "ar" ? "rtl" : "ltr"}
          />
        </Field>

        <Field label="Slug (URL)" error={errors.slug?.message}>
          <Input {...register("slug")} placeholder="esxence-2026" />
        </Field>
      </section>

      <section className="card-velvet p-6 space-y-5">
        <h2 className="display text-xl">Fechas y ubicación</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Inicio" error={errors.startDate?.message}>
            <Input
              type="datetime-local"
              {...register("startDate", {
                setValueAs: (v) => (v ? new Date(v) : new Date()),
              })}
              defaultValue={
                defaultValues?.startDate
                  ? new Date(defaultValues.startDate).toISOString().slice(0, 16)
                  : undefined
              }
            />
          </Field>
          <Field label="Fin" error={errors.endDate?.message}>
            <Input
              type="datetime-local"
              {...register("endDate", { setValueAs: (v) => (v ? new Date(v) : new Date()) })}
              defaultValue={
                defaultValues?.endDate
                  ? new Date(defaultValues.endDate).toISOString().slice(0, 16)
                  : undefined
              }
            />
          </Field>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Ciudad" error={errors.city?.message}>
            <Input {...register("city")} />
          </Field>
          <Field label="País (ISO 2)" error={errors.country?.message}>
            <Input {...register("country")} maxLength={2} className="uppercase" />
          </Field>
          <Field label="Recinto">
            <Input {...register("venue")} />
          </Field>
        </div>
        <Field label="Dirección">
          <Input {...register("address")} />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Latitud">
            <Input
              type="number"
              step="0.000001"
              {...register("lat", { valueAsNumber: true, setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)) })}
            />
          </Field>
          <Field label="Longitud">
            <Input
              type="number"
              step="0.000001"
              {...register("lng", { valueAsNumber: true, setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)) })}
            />
          </Field>
        </div>
      </section>

      <section className="card-velvet p-6 space-y-5">
        <h2 className="display text-xl">Enlaces y media</h2>
        <Field label="Web oficial">
          <Input type="url" {...register("websiteUrl")} placeholder="https://…" />
        </Field>
        <Field label="URL de entradas">
          <Input type="url" {...register("ticketUrl")} />
        </Field>
        <Field label="Imagen de portada (URL)">
          <Input type="url" {...register("coverImage")} />
        </Field>
      </section>

      <section className="card-velvet p-6 space-y-4">
        <h2 className="display text-xl">Visibilidad</h2>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" {...register("isFeatured")} className="accent-[var(--color-gold)] h-4 w-4" />
          Destacada (aparece en home)
        </label>
        <Field label="Estado">
          <select {...register("status")} className="field max-w-xs">
            <option value="UPCOMING">Próxima</option>
            <option value="ONGOING">En curso</option>
            <option value="PAST">Pasada</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </Field>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar feria
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="accent text-[0.65rem] text-[var(--color-gold)]">{label}</span>
      {children}
      {error && <span className="block text-xs text-[var(--color-danger)]">{error}</span>}
    </label>
  );
}
