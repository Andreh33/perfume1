import { describe, expect, it } from "vitest";
import { calculateTotals } from "@/lib/cart";

describe("calculateTotals", () => {
  it("calcula subtotal y total con IVA y envío", () => {
    const result = calculateTotals({
      items: [
        { unitPriceCents: 18900, quantity: 2 },
        { unitPriceCents: 4900, quantity: 1 },
      ],
      shippingCents: 590,
      taxRate: 0.21,
    });
    expect(result.subtotalCents).toBe(42700);
    expect(result.discountCents).toBe(0);
    expect(result.shippingCents).toBe(590);
    expect(result.taxCents).toBe(Math.round(42700 * 0.21));
    expect(result.totalCents).toBe(42700 + 590 + Math.round(42700 * 0.21));
  });

  it("aplica cupón de porcentaje (basis points)", () => {
    const result = calculateTotals({
      items: [{ unitPriceCents: 10000, quantity: 1 }],
      coupon: { type: "PERCENT", value: 1000, minSubtotalCents: 0 }, // 10 %
      shippingCents: 0,
      taxRate: 0,
    });
    expect(result.discountCents).toBe(1000);
    expect(result.totalCents).toBe(9000);
  });

  it("aplica cupón fijo y nunca lo sobrepasa", () => {
    const result = calculateTotals({
      items: [{ unitPriceCents: 5000, quantity: 1 }],
      coupon: { type: "FIXED", value: 8000, minSubtotalCents: 0 },
      shippingCents: 0,
      taxRate: 0,
    });
    expect(result.discountCents).toBe(5000);
    expect(result.totalCents).toBe(0);
  });

  it("respeta el subtotal mínimo del cupón", () => {
    const result = calculateTotals({
      items: [{ unitPriceCents: 1000, quantity: 1 }],
      coupon: { type: "PERCENT", value: 5000, minSubtotalCents: 5000 },
      taxRate: 0,
    });
    expect(result.discountCents).toBe(0);
    expect(result.totalCents).toBe(1000);
  });

  it("FREE_SHIPPING pone envío a 0", () => {
    const result = calculateTotals({
      items: [{ unitPriceCents: 10000, quantity: 1 }],
      coupon: { type: "FREE_SHIPPING", value: 0, minSubtotalCents: 0 },
      shippingCents: 590,
      taxRate: 0,
    });
    expect(result.shippingCents).toBe(0);
    expect(result.totalCents).toBe(10000);
  });
});
