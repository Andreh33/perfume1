import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInvoicePdf } from "@/lib/pdf/invoice";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = order.userId === session.user.id;
  const isStaff = session.user.role === "ADMIN" || session.user.role === "STAFF";
  if (!isOwner && !isStaff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const pdf = await generateInvoicePdf({
    number: order.number,
    issueDate: order.createdAt,
    customerEmail: order.email,
    shippingAddress: order.shippingAddress as Parameters<typeof generateInvoicePdf>[0]["shippingAddress"],
    items: order.items.map((i) => ({
      productName: i.productName,
      variantSku: i.variantSku,
      variantSize: i.variantSize,
      quantity: i.quantity,
      unitPriceCents: i.unitPriceCents,
      totalCents: i.totalCents,
    })),
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    taxRate: 0.21,
    notes: order.notes ?? undefined,
  });

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="factura-${order.number}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
