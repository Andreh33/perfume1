import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature error", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (!orderId) break;
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
            paymentMethod: session.payment_method_types?.[0] ?? "card",
          },
        });

        // Decrementar stock
        const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
        if (order) {
          await Promise.all(
            order.items
              .filter((i) => i.variantId)
              .map((i) =>
                prisma.productVariant.update({
                  where: { id: i.variantId! },
                  data: { stock: { decrement: i.quantity } },
                }),
              ),
          );
        }
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (!orderId) break;
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntentId: typeof charge.payment_intent === "string" ? charge.payment_intent : "__none__" },
        });
        if (order) {
          await prisma.order.update({ where: { id: order.id }, data: { status: "REFUNDED" } });
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
