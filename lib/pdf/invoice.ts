import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Address = {
  firstName?: string;
  lastName?: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
};

type InvoiceItem = {
  productName: string;
  variantSku: string;
  variantSize: number;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
};

export type InvoiceData = {
  number: string;
  issueDate: Date;
  customerEmail: string;
  shippingAddress: Address;
  items: InvoiceItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  taxRate?: number;
  vatId?: string;
  notes?: string;
};

const GOLD = rgb(0.83, 0.62, 0.30);
const INK = rgb(0.95, 0.91, 0.85);
const MUTED = rgb(0.7, 0.62, 0.5);
const BG = rgb(0.10, 0.085, 0.07);

function fmt(cents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Factura ${data.number}`);
  pdf.setAuthor("Sol Perfumes Árabes S.L.");
  pdf.setSubject("Factura");
  pdf.setCreator("Sol Perfumes Árabes");

  const page = pdf.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);

  // Fondo dorado de cabecera
  page.drawRectangle({ x: 0, y: height - 110, width, height: 110, color: BG });
  page.drawRectangle({ x: 0, y: height - 112, width, height: 2, color: GOLD });

  page.drawText("SOL PERFUMES ÁRABES", {
    x: 50,
    y: height - 50,
    size: 16,
    font: serifBold,
    color: GOLD,
  });
  page.drawText("S.L. · CIF B12345678 · Calle Serrano 12, 28001 Madrid", {
    x: 50,
    y: height - 70,
    size: 9,
    font: serif,
    color: MUTED,
  });
  page.drawText("hola@solperfumesarabes.com · solperfumesarabes.com", {
    x: 50,
    y: height - 84,
    size: 9,
    font: serif,
    color: MUTED,
  });

  page.drawText("FACTURA", { x: width - 130, y: height - 50, size: 18, font: serifBold, color: INK });
  page.drawText(data.number, { x: width - 130, y: height - 72, size: 12, font: serifItalic, color: GOLD });
  page.drawText(
    new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(data.issueDate),
    { x: width - 130, y: height - 88, size: 9, font: serif, color: MUTED },
  );

  // Cliente
  let y = height - 160;
  page.drawText("FACTURAR A", { x: 50, y, size: 8, font: serifBold, color: GOLD });
  y -= 14;
  const fullName = `${data.shippingAddress.firstName ?? ""} ${data.shippingAddress.lastName ?? ""}`.trim();
  if (fullName) {
    page.drawText(fullName, { x: 50, y, size: 11, font: serif, color: INK });
    y -= 14;
  }
  page.drawText(data.customerEmail, { x: 50, y, size: 10, font: serif, color: MUTED });
  y -= 14;
  page.drawText(data.shippingAddress.line1, { x: 50, y, size: 10, font: serif, color: MUTED });
  if (data.shippingAddress.line2) {
    y -= 12;
    page.drawText(data.shippingAddress.line2, { x: 50, y, size: 10, font: serif, color: MUTED });
  }
  y -= 12;
  page.drawText(
    `${data.shippingAddress.postalCode} ${data.shippingAddress.city}, ${data.shippingAddress.country}`,
    { x: 50, y, size: 10, font: serif, color: MUTED },
  );

  // Tabla
  y -= 50;
  page.drawLine({ start: { x: 50, y: y + 18 }, end: { x: width - 50, y: y + 18 }, thickness: 0.5, color: GOLD });
  page.drawText("CONCEPTO", { x: 50, y, size: 8, font: serifBold, color: GOLD });
  page.drawText("CANT", { x: 360, y, size: 8, font: serifBold, color: GOLD });
  page.drawText("UNIT.", { x: 410, y, size: 8, font: serifBold, color: GOLD });
  page.drawText("TOTAL", { x: 480, y, size: 8, font: serifBold, color: GOLD });
  page.drawLine({ start: { x: 50, y: y - 6 }, end: { x: width - 50, y: y - 6 }, thickness: 0.5, color: GOLD });
  y -= 22;

  for (const item of data.items) {
    if (y < 140) {
      // nueva página simple
      const np = pdf.addPage([595.28, 841.89]);
      y = np.getHeight() - 60;
    }
    page.drawText(item.productName, { x: 50, y, size: 11, font: serif, color: INK, maxWidth: 290 });
    page.drawText(`${item.variantSize} ml · ${item.variantSku}`, {
      x: 50,
      y: y - 12,
      size: 8,
      font: serifItalic,
      color: MUTED,
    });
    page.drawText(`${item.quantity}`, { x: 365, y, size: 11, font: serif, color: INK });
    page.drawText(fmt(item.unitPriceCents), { x: 410, y, size: 11, font: serif, color: INK });
    page.drawText(fmt(item.totalCents), { x: 480, y, size: 11, font: serifBold, color: INK });
    y -= 28;
  }

  // Totales
  y -= 8;
  page.drawLine({ start: { x: 320, y: y + 6 }, end: { x: width - 50, y: y + 6 }, thickness: 0.4, color: GOLD });
  y -= 8;
  drawRow(page, "Subtotal", fmt(data.subtotalCents), y, serif, INK);
  y -= 16;
  drawRow(page, "Envío", data.shippingCents === 0 ? "Gratis" : fmt(data.shippingCents), y, serif, INK);
  y -= 16;
  drawRow(page, `IVA${data.taxRate ? ` (${Math.round(data.taxRate * 100)} %)` : ""}`, fmt(data.taxCents), y, serif, INK);
  y -= 22;
  page.drawLine({ start: { x: 320, y: y + 8 }, end: { x: width - 50, y: y + 8 }, thickness: 1, color: GOLD });
  drawRow(page, "TOTAL", fmt(data.totalCents), y, serifBold, GOLD, 14);

  // Pie
  page.drawText("Gracias por confiar en Sol Perfumes Árabes.", {
    x: 50,
    y: 90,
    size: 11,
    font: serifItalic,
    color: GOLD,
  });
  page.drawText(
    "Esta factura simplificada cumple con los requisitos del Real Decreto 1619/2012.",
    { x: 50, y: 70, size: 8, font: serif, color: MUTED },
  );

  return pdf.save();
}

function drawRow(
  page: ReturnType<PDFDocument["addPage"]>,
  label: string,
  value: string,
  y: number,
  font: import("pdf-lib").PDFFont,
  color: ReturnType<typeof rgb>,
  size = 10,
) {
  page.drawText(label, { x: 360, y, size, font, color });
  page.drawText(value, { x: 480, y, size, font, color });
}
