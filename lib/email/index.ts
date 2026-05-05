import "server-only";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { env } from "@/lib/env";
import WelcomeEmail from "@/emails/Welcome";
import OrderConfirmationEmail from "@/emails/OrderConfirmation";
import OrderShippedEmail from "@/emails/OrderShipped";
import PasswordResetEmail from "@/emails/PasswordReset";
import EmailVerificationEmail from "@/emails/EmailVerification";
import AbandonedCartEmail from "@/emails/AbandonedCart";
import ReviewRequestEmail from "@/emails/ReviewRequest";
import StockNotificationEmail from "@/emails/StockNotification";
import FairReminderEmail from "@/emails/FairReminder";
import NewsletterMonthlyEmail from "@/emails/NewsletterMonthly";

let _resend: Resend | null = null;

function client(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(env.RESEND_API_KEY);
  return _resend;
}

type Common = { to: string; replyTo?: string };

export const email = {
  async welcome(args: Common & { firstName?: string; couponCode?: string }) {
    return send(args, "Bienvenida a Sol Perfumes Árabes", WelcomeEmail({ firstName: args.firstName, couponCode: args.couponCode, appUrl: env.NEXT_PUBLIC_APP_URL }));
  },
  async orderConfirmation(args: Common & {
    orderNumber: string;
    customerName?: string;
    items: Array<{ name: string; sku: string; sizeMl: number; quantity: number; unitPriceCents: number; imageUrl?: string | null }>;
    subtotalCents: number;
    shippingCents: number;
    taxCents: number;
    totalCents: number;
    shippingAddress: { line1: string; line2?: string; city: string; postalCode: string; country: string };
  }) {
    return send(args, `Pedido ${args.orderNumber} confirmado`, OrderConfirmationEmail({ ...args, appUrl: env.NEXT_PUBLIC_APP_URL }));
  },
  async orderShipped(args: Common & { orderNumber: string; customerName?: string; carrier: string; trackingNumber: string; trackingUrl: string }) {
    return send(args, `Tu pedido ${args.orderNumber} está en camino`, OrderShippedEmail({ ...args, appUrl: env.NEXT_PUBLIC_APP_URL }));
  },
  async passwordReset(args: Common & { resetUrl: string }) {
    return send(args, "Recupera tu contraseña", PasswordResetEmail({ resetUrl: args.resetUrl, appUrl: env.NEXT_PUBLIC_APP_URL }));
  },
  async emailVerification(args: Common & { verifyUrl: string }) {
    return send(args, "Confirma tu email", EmailVerificationEmail({ verifyUrl: args.verifyUrl, appUrl: env.NEXT_PUBLIC_APP_URL }));
  },
  async abandonedCart(args: Common & { customerName?: string; itemImage?: string; itemName?: string; cartUrl: string }) {
    return send(args, "Tu perfume sigue esperándote", AbandonedCartEmail({ ...args, appUrl: env.NEXT_PUBLIC_APP_URL }));
  },
  async reviewRequest(args: Common & { customerName?: string; productName?: string; reviewUrl: string }) {
    return send(args, "¿Cómo te ha llegado tu perfume?", ReviewRequestEmail({ ...args, appUrl: env.NEXT_PUBLIC_APP_URL }));
  },
  async stockNotification(args: Common & { productName: string; productUrl: string }) {
    return send(args, `${args.productName} ha vuelto`, StockNotificationEmail({ ...args, appUrl: env.NEXT_PUBLIC_APP_URL }));
  },
  async fairReminder(args: Common & { fairTitle: string; city: string; country: string; startDate: string; fairUrl: string }) {
    return send(args, `Próxima feria: ${args.fairTitle}`, FairReminderEmail({ ...args, appUrl: env.NEXT_PUBLIC_APP_URL }));
  },
  async newsletter(args: Common & { month: string; blocks: Array<{ kicker: string; title: string; text: string; url: string; cta: string }> }) {
    return send(args, `Carta perfumada · ${args.month}`, NewsletterMonthlyEmail({ ...args, appUrl: env.NEXT_PUBLIC_APP_URL }));
  },
};

async function send(args: Common, subject: string, node: React.ReactElement) {
  const resend = client();
  const html = await render(node);
  const text = await render(node, { plainText: true });
  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email] (dev) ${subject} → ${args.to}`);
    }
    return { ok: false as const, reason: "RESEND_API_KEY missing" };
  }
  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: args.to,
    replyTo: args.replyTo,
    subject,
    html,
    text,
  });
  if (error) return { ok: false as const, reason: error.message };
  return { ok: true as const, id: data?.id };
}
