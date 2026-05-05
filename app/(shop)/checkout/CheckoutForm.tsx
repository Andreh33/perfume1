"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/actions/checkout";

const schema = z.object({
  email: z.string().email("Email no válido"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(6).optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  postalCode: z.string().min(3),
  region: z.string().optional(),
  country: z.string().length(2).default("ES"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CheckoutForm({ totalCents, cartId }: { totalCents: number; cartId: string }) {
  void totalCents;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: "ES" },
  });

  const onSubmit = (data: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutSession({ cartId, address: data });
      if (result.ok && result.url) {
        window.location.assign(result.url);
      } else {
        setError(result.error ?? "No se pudo iniciar el pago.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="card-velvet p-7 space-y-4">
        <h2 className="display text-2xl">1. Contacto</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" {...register("email")} autoComplete="email" />
          </Field>
          <Field label="Teléfono" error={errors.phone?.message}>
            <Input type="tel" {...register("phone")} autoComplete="tel" />
          </Field>
        </div>
      </section>

      <section className="card-velvet p-7 space-y-4">
        <h2 className="display text-2xl">2. Envío</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nombre" error={errors.firstName?.message}>
            <Input {...register("firstName")} autoComplete="given-name" />
          </Field>
          <Field label="Apellidos" error={errors.lastName?.message}>
            <Input {...register("lastName")} autoComplete="family-name" />
          </Field>
        </div>
        <Field label="Dirección" error={errors.line1?.message}>
          <Input {...register("line1")} autoComplete="address-line1" />
        </Field>
        <Field label="Apartamento, escalera, etc. (opcional)">
          <Input {...register("line2")} autoComplete="address-line2" />
        </Field>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Código postal" error={errors.postalCode?.message}>
            <Input {...register("postalCode")} autoComplete="postal-code" />
          </Field>
          <Field label="Ciudad" error={errors.city?.message}>
            <Input {...register("city")} autoComplete="address-level2" />
          </Field>
          <Field label="País" error={errors.country?.message}>
            <select {...register("country")} className="field" defaultValue="ES">
              <option value="ES">España</option>
              <option value="FR">Francia</option>
              <option value="IT">Italia</option>
              <option value="PT">Portugal</option>
              <option value="DE">Alemania</option>
              <option value="GB">Reino Unido</option>
              <option value="AE">Emiratos</option>
            </select>
          </Field>
        </div>
        <Field label="Notas para el pedido (opcional)">
          <textarea rows={3} className="field" {...register("notes")} />
        </Field>
      </section>

      <section className="card-velvet p-7 space-y-3">
        <h2 className="display text-2xl">3. Pago</h2>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Al pulsar &laquo;Continuar al pago&raquo; te llevaremos a la pasarela segura de Stripe (tarjeta,
          Apple&nbsp;Pay y Google&nbsp;Pay).
        </p>
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Continuar al pago
        </Button>
      </section>
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
