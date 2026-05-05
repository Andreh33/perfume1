import { describe, expect, it } from "vitest";
import { fairStatusFromDates, formatPriceCents, pickI18n, slugify } from "@/lib/utils";

describe("formatPriceCents", () => {
  it("formatea EUR en español", () => {
    const result = formatPriceCents(18900);
    expect(result).toMatch(/189,00/);
    expect(result).toMatch(/€/);
  });
});

describe("slugify", () => {
  it("genera slugs URL-safe", () => {
    expect(slugify("Sultán al-Layl")).toBe("sultan-al-layl");
    expect(slugify("  Rose d'Arabie  ")).toBe("rose-d-arabie");
  });
});

describe("pickI18n", () => {
  it("devuelve la clave del locale solicitado", () => {
    expect(pickI18n({ es: "Hola", en: "Hello", ar: "مرحبا" }, "en")).toBe("Hello");
  });
  it("cae al fallback si falta la clave", () => {
    expect(pickI18n({ es: "Hola" }, "en")).toBe("Hola");
  });
  it("devuelve string si recibe string", () => {
    expect(pickI18n("Hola", "en")).toBe("Hola");
  });
});

describe("fairStatusFromDates", () => {
  it("ONGOING si hoy está dentro del rango", () => {
    const start = new Date(Date.now() - 1000 * 60 * 60);
    const end = new Date(Date.now() + 1000 * 60 * 60);
    expect(fairStatusFromDates(start, end)).toBe("ONGOING");
  });
  it("UPCOMING en el futuro", () => {
    const start = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const end = new Date(Date.now() + 1000 * 60 * 60 * 48);
    expect(fairStatusFromDates(start, end)).toBe("UPCOMING");
  });
  it("PAST en el pasado", () => {
    const start = new Date(Date.now() - 1000 * 60 * 60 * 48);
    const end = new Date(Date.now() - 1000 * 60 * 60 * 24);
    expect(fairStatusFromDates(start, end)).toBe("PAST");
  });
});
