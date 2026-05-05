import { CouponForm } from "../CouponForm";

export default function NewCouponPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="display text-3xl">Nuevo cupón</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">El código se aplica en el carrito.</p>
      </header>
      <CouponForm />
    </div>
  );
}
