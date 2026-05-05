"use client";

import { useState, useTransition } from "react";
import { ShoppingBag, Minus, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addToCartAction } from "@/app/actions/cart";
import { formatPriceCents } from "@/lib/utils";

type Variant = { id: string; sizeMl: number; priceCents: number; stock: number };

export function AddToCartForm({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  if (!variant) return null;

  const handleAdd = () => {
    startTransition(async () => {
      const result = await addToCartAction({ productId, variantId: variant.id, quantity });
      if (result.ok) {
        toast.success("Añadido al carrito");
      } else {
        toast.error(result.error ?? "Error al añadir");
      }
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="accent text-[0.65rem] text-[var(--color-gold)] mb-3">Tamaño</p>
        <div role="radiogroup" aria-label="Tamaño" className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={variantId === v.id}
              onClick={() => setVariantId(v.id)}
              disabled={v.stock === 0}
              className={`px-5 py-3 rounded-md border text-sm transition-all min-w-20 ${
                variantId === v.id
                  ? "border-[var(--color-gold)] bg-[oklch(0.78_0.13_82_/_0.1)] text-[var(--color-gold)]"
                  : "border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)] hover:border-[var(--color-gold-deep)]"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span className="block accent text-[0.65rem]">{v.sizeMl} ml</span>
              <span className="block mt-0.5 text-sm font-medium">{formatPriceCents(v.priceCents)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <p className="accent text-[0.65rem] text-[var(--color-gold)] mb-3">Cantidad</p>
          <div className="inline-flex items-center border border-[oklch(0.55_0.10_70_/_0.3)] rounded-full">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-3 text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]"
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 text-base tabular-nums" aria-live="polite">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(variant.stock, q + 1))}
              className="p-3 text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 pt-7">
          {variant.stock > 0 && variant.stock < 6 && (
            <p className="text-xs text-[var(--color-warning)]">Solo quedan {variant.stock} unidades.</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={pending || variant.stock === 0}
        className="btn-primary w-full"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingBag className="h-4 w-4" />
        )}
        {variant.stock === 0 ? "Agotado" : "Añadir al carrito"}
        <span className="ml-2 opacity-80">{formatPriceCents(variant.priceCents * quantity)}</span>
      </button>
    </div>
  );
}
