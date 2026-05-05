"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { saveProductAction } from "./actions";
import { slugify } from "@/lib/utils";

type I18n = { es: string; en: string; ar: string };
type Variant = {
  id?: string;
  sizeMl: number;
  sku: string;
  priceCents: number;
  compareAtCents?: number | null;
  weightGrams: number;
  stock: number;
  isDefault: boolean;
  isActive: boolean;
};
type Img = { id?: string; url: string; alt: I18n; position: number; isCover: boolean };
type Note = { noteId: string; type: "SALIDA" | "CORAZON" | "FONDO"; position: number };

type Defaults = {
  id?: string;
  slug?: string;
  name?: I18n;
  shortDescription?: I18n;
  description?: object | null;
  story?: object | null;
  howToUse?: object | null;
  gender?: "MASCULINO" | "FEMENINO" | "UNISEX";
  family?: string;
  perfumer?: string | null;
  origin?: string | null;
  releaseYear?: number | null;
  isFeatured?: boolean;
  isNew?: boolean;
  isLimited?: boolean;
  isPublished?: boolean;
  metaTitle?: I18n;
  metaDescription?: I18n;
  ogImage?: string | null;
  collectionId?: string | null;
  variants?: Variant[];
  images?: Img[];
  notes?: Note[];
};

export function ProductForm({
  defaults = {},
  collections,
  notes,
}: {
  defaults?: Defaults;
  collections: Array<{ id: string; slug: string; name: string }>;
  notes: Array<{ id: string; slug: string; name: string }>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [activeLocale, setActiveLocale] = useState<keyof I18n>("es");

  const [slug, setSlug] = useState(defaults.slug ?? "");
  const [name, setName] = useState<I18n>(defaults.name ?? { es: "", en: "", ar: "" });
  const [shortDescription, setShortDescription] = useState<I18n>(
    defaults.shortDescription ?? { es: "", en: "", ar: "" },
  );
  const [description, setDescription] = useState<object>((defaults.description as object) ?? {});
  const [story, setStory] = useState<object>((defaults.story as object) ?? {});
  const [howToUse, setHowToUse] = useState<object>((defaults.howToUse as object) ?? {});
  const [gender, setGender] = useState(defaults.gender ?? "UNISEX");
  const [family, setFamily] = useState(defaults.family ?? "");
  const [perfumer, setPerfumer] = useState(defaults.perfumer ?? "");
  const [origin, setOrigin] = useState(defaults.origin ?? "");
  const [releaseYear, setReleaseYear] = useState<number | "">(defaults.releaseYear ?? "");
  const [isFeatured, setIsFeatured] = useState(defaults.isFeatured ?? false);
  const [isNew, setIsNew] = useState(defaults.isNew ?? false);
  const [isLimited, setIsLimited] = useState(defaults.isLimited ?? false);
  const [isPublished, setIsPublished] = useState(defaults.isPublished ?? false);
  const [collectionId, setCollectionId] = useState(defaults.collectionId ?? "");
  const [metaTitle, setMetaTitle] = useState<I18n>(defaults.metaTitle ?? { es: "", en: "", ar: "" });
  const [metaDescription, setMetaDescription] = useState<I18n>(
    defaults.metaDescription ?? { es: "", en: "", ar: "" },
  );
  const [ogImage, setOgImage] = useState(defaults.ogImage ?? "");

  const [variants, setVariants] = useState<Variant[]>(
    defaults.variants?.length
      ? defaults.variants
      : [{ sizeMl: 50, sku: "", priceCents: 0, weightGrams: 150, stock: 0, isDefault: true, isActive: true }],
  );
  const [images, setImages] = useState<Img[]>(defaults.images ?? []);
  const [productNotes, setProductNotes] = useState<Note[]>(defaults.notes ?? []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const result = await saveProductAction({
        id: defaults.id,
        data: {
          slug,
          name,
          shortDescription,
          description,
          story,
          howToUse,
          gender,
          family,
          perfumer: perfumer || null,
          origin: origin || null,
          releaseYear: releaseYear === "" ? null : Number(releaseYear),
          isFeatured,
          isNew,
          isLimited,
          isPublished,
          metaTitle,
          metaDescription,
          ogImage: ogImage || null,
          collectionId: collectionId || null,
          variants: variants.map((v) => ({
            ...v,
            priceCents: Number(v.priceCents),
            stock: Number(v.stock),
            sizeMl: Number(v.sizeMl),
            weightGrams: Number(v.weightGrams),
          })),
          images,
          notes: productNotes,
        },
      });
      if (result.ok) {
        toast.success("Producto guardado");
        router.push("/admin/productos");
        router.refresh();
      } else {
        toast.error(result.error ?? "Error");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Tabs.Root defaultValue="general">
        <Tabs.List className="flex gap-1 border-b border-[oklch(0.55_0.10_70_/_0.2)] mb-6">
          {[
            ["general", "General"],
            ["variants", "Variantes"],
            ["images", "Imágenes"],
            ["notes", "Notas"],
            ["seo", "SEO"],
          ].map(([k, label]) => (
            <Tabs.Trigger
              key={k}
              value={k}
              className="accent text-[0.65rem] px-4 py-2.5 -mb-px border-b-2 border-transparent data-[state=active]:border-[var(--color-gold)] data-[state=active]:text-[var(--color-gold)] text-[var(--color-ink-muted)]"
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Tab General */}
        <Tabs.Content value="general" className="space-y-6">
          <section className="card-velvet p-6 space-y-5">
            <div role="tablist" className="flex gap-1 border-b border-[oklch(0.55_0.10_70_/_0.2)] -mt-1">
              {(["es", "en", "ar"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setActiveLocale(l)}
                  aria-selected={activeLocale === l}
                  className={`accent text-[0.6rem] px-4 py-2 -mb-px border-b-2 ${
                    activeLocale === l ? "border-[var(--color-gold)] text-[var(--color-gold)]" : "border-transparent text-[var(--color-ink-muted)]"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <Field label={`Nombre (${activeLocale.toUpperCase()})`}>
              <Input
                value={name[activeLocale]}
                onChange={(e) => {
                  const v = e.target.value;
                  setName((n) => ({ ...n, [activeLocale]: v }));
                  if (activeLocale === "es" && !defaults.id) setSlug(slugify(v));
                }}
                dir={activeLocale === "ar" ? "rtl" : "ltr"}
              />
            </Field>

            <Field label={`Descripción corta (${activeLocale.toUpperCase()})`}>
              <textarea
                rows={3}
                value={shortDescription[activeLocale]}
                onChange={(e) => setShortDescription((d) => ({ ...d, [activeLocale]: e.target.value }))}
                className="field"
                dir={activeLocale === "ar" ? "rtl" : "ltr"}
              />
            </Field>

            <Field label={`Historia (${activeLocale.toUpperCase()})`}>
              <RichTextEditor
                value={story as Record<string, unknown>}
                onChange={setStory}
                placeholder="Cuenta el origen, la inspiración…"
                dir={activeLocale === "ar" ? "rtl" : "ltr"}
              />
            </Field>

            <Field label={`Cómo usarlo (${activeLocale.toUpperCase()})`}>
              <RichTextEditor
                value={howToUse as Record<string, unknown>}
                onChange={setHowToUse}
                placeholder="Tres gotas, los puntos de pulso…"
                dir={activeLocale === "ar" ? "rtl" : "ltr"}
              />
            </Field>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Slug (URL)">
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
              </Field>
              <Field label="Familia olfativa">
                <Input value={family} onChange={(e) => setFamily(e.target.value)} placeholder="oriental_oud" />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Género">
                <select value={gender} onChange={(e) => setGender(e.target.value as typeof gender)} className="field">
                  <option value="UNISEX">Unisex</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="MASCULINO">Masculino</option>
                </select>
              </Field>
              <Field label="Perfumista">
                <Input value={perfumer ?? ""} onChange={(e) => setPerfumer(e.target.value)} />
              </Field>
              <Field label="Año">
                <Input
                  type="number"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Origen">
                <Input value={origin ?? ""} onChange={(e) => setOrigin(e.target.value)} />
              </Field>
              <Field label="Colección">
                <select value={collectionId ?? ""} onChange={(e) => setCollectionId(e.target.value)} className="field">
                  <option value="">— Sin colección —</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <fieldset className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-[oklch(0.55_0.10_70_/_0.2)] pt-5">
              <legend className="sr-only">Flags</legend>
              <Toggle label="Destacado" checked={isFeatured} onChange={setIsFeatured} />
              <Toggle label="Novedad" checked={isNew} onChange={setIsNew} />
              <Toggle label="Edición limitada" checked={isLimited} onChange={setIsLimited} />
              <Toggle label="Publicado" checked={isPublished} onChange={setIsPublished} />
            </fieldset>
          </section>
        </Tabs.Content>

        {/* Tab Variantes */}
        <Tabs.Content value="variants" className="space-y-4">
          <section className="card-velvet p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr className="text-[var(--color-ink-subtle)]">
                    <th className="p-2">ml</th>
                    <th className="p-2">SKU</th>
                    <th className="p-2">Precio (cents)</th>
                    <th className="p-2">Compare-at</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2">Peso (g)</th>
                    <th className="p-2">Activa</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={v.id ?? `new-${i}`} className="border-t border-[oklch(0.55_0.10_70_/_0.15)]">
                      <td className="p-1.5">
                        <Input type="number" value={v.sizeMl} onChange={(e) => updateVariant(i, "sizeMl", +e.target.value)} className="!py-1.5 w-20" />
                      </td>
                      <td className="p-1.5">
                        <Input value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} className="!py-1.5" />
                      </td>
                      <td className="p-1.5">
                        <Input type="number" value={v.priceCents} onChange={(e) => updateVariant(i, "priceCents", +e.target.value)} className="!py-1.5 w-28" />
                      </td>
                      <td className="p-1.5">
                        <Input
                          type="number"
                          value={v.compareAtCents ?? ""}
                          onChange={(e) => updateVariant(i, "compareAtCents", e.target.value === "" ? null : +e.target.value)}
                          className="!py-1.5 w-28"
                        />
                      </td>
                      <td className="p-1.5">
                        <Input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", +e.target.value)} className="!py-1.5 w-20" />
                      </td>
                      <td className="p-1.5">
                        <Input type="number" value={v.weightGrams} onChange={(e) => updateVariant(i, "weightGrams", +e.target.value)} className="!py-1.5 w-20" />
                      </td>
                      <td className="p-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={v.isActive}
                          onChange={(e) => updateVariant(i, "isActive", e.target.checked)}
                          className="accent-[var(--color-gold)] h-4 w-4"
                        />
                      </td>
                      <td className="p-1.5">
                        <button
                          type="button"
                          onClick={() => setVariants((all) => all.filter((_, j) => j !== i))}
                          aria-label="Eliminar variante"
                          className="text-[var(--color-danger)]"
                          disabled={variants.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setVariants((v) => [
                  ...v,
                  { sizeMl: 50, sku: "", priceCents: 0, weightGrams: 150, stock: 0, isDefault: false, isActive: true },
                ])
              }
            >
              <Plus className="h-4 w-4" /> Añadir variante
            </Button>
          </section>
        </Tabs.Content>

        {/* Tab Imágenes */}
        <Tabs.Content value="images" className="space-y-4">
          <section className="card-velvet p-6 space-y-4">
            <p className="text-sm text-[var(--color-ink-muted)]">
              Pega URLs de imágenes (UploadThing o R2). La primera es la portada.
            </p>
            <ul className="space-y-2">
              {images.map((img, i) => (
                <li key={img.id ?? `img-${i}`} className="flex gap-3 items-start">
                  <span className="accent text-[0.65rem] text-[var(--color-gold)] pt-3">{i + 1}</span>
                  <div className="flex-1 grid md:grid-cols-2 gap-2">
                    <Input
                      value={img.url}
                      onChange={(e) => setImages((all) => all.map((it, j) => (j === i ? { ...it, url: e.target.value } : it)))}
                      placeholder="https://…"
                    />
                    <Input
                      value={img.alt.es ?? ""}
                      onChange={(e) =>
                        setImages((all) =>
                          all.map((it, j) =>
                            j === i ? { ...it, alt: { ...it.alt, es: e.target.value } } : it,
                          ),
                        )
                      }
                      placeholder="Alt en español"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setImages((all) => all.filter((_, j) => j !== i))}
                    aria-label="Eliminar imagen"
                    className="pt-2 text-[var(--color-danger)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setImages((all) => [
                  ...all,
                  { url: "", alt: { es: "", en: "", ar: "" }, position: all.length, isCover: all.length === 0 },
                ])
              }
            >
              <Plus className="h-4 w-4" /> Añadir imagen
            </Button>
          </section>
        </Tabs.Content>

        {/* Tab Notas */}
        <Tabs.Content value="notes" className="space-y-4">
          <section className="card-velvet p-6 grid md:grid-cols-3 gap-4">
            {(["SALIDA", "CORAZON", "FONDO"] as const).map((type) => (
              <div key={type}>
                <p className="accent text-[0.65rem] text-[var(--color-gold)] mb-3">
                  {type === "SALIDA" ? "Salida" : type === "CORAZON" ? "Corazón" : "Fondo"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {notes.map((n) => {
                    const checked = productNotes.some((pn) => pn.noteId === n.id && pn.type === type);
                    return (
                      <button
                        key={`${type}-${n.id}`}
                        type="button"
                        onClick={() =>
                          setProductNotes((arr) =>
                            checked
                              ? arr.filter((pn) => !(pn.noteId === n.id && pn.type === type))
                              : [...arr, { noteId: n.id, type, position: 0 }],
                          )
                        }
                        className={`note-chip ${checked ? "border-[var(--color-gold)] bg-[oklch(0.78_0.13_82_/_0.12)]" : ""}`}
                      >
                        {n.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        </Tabs.Content>

        {/* Tab SEO */}
        <Tabs.Content value="seo" className="space-y-4">
          <section className="card-velvet p-6 space-y-5">
            <Field label={`Meta título (${activeLocale.toUpperCase()})`}>
              <Input
                value={metaTitle[activeLocale]}
                onChange={(e) => setMetaTitle((m) => ({ ...m, [activeLocale]: e.target.value }))}
                maxLength={70}
              />
            </Field>
            <Field label={`Meta descripción (${activeLocale.toUpperCase()})`}>
              <textarea
                rows={3}
                value={metaDescription[activeLocale]}
                onChange={(e) => setMetaDescription((m) => ({ ...m, [activeLocale]: e.target.value }))}
                className="field"
                maxLength={180}
              />
            </Field>
            <Field label="OG image (URL)">
              <Input value={ogImage ?? ""} onChange={(e) => setOgImage(e.target.value)} />
            </Field>
          </section>
        </Tabs.Content>
      </Tabs.Root>

      <div className="sticky bottom-4 flex justify-end gap-3 z-20">
        <div className="card-velvet p-3 flex gap-2">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar
          </Button>
        </div>
      </div>
    </form>
  );

  function updateVariant<K extends keyof Variant>(i: number, key: K, value: Variant[K]) {
    setVariants((all) => all.map((v, j) => (j === i ? { ...v, [key]: value } : v)));
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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-[var(--color-gold)] h-4 w-4" />
      {label}
    </label>
  );
}
