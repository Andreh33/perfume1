import { Button, Column, Hr, Row, Section, Text } from "@react-email/components";
import { EmailShell, emailColors, emailStyles } from "./_shell";

type Item = {
  name: string;
  sku: string;
  sizeMl: number;
  quantity: number;
  unitPriceCents: number;
  imageUrl?: string | null;
};

function fmt(cents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default function OrderConfirmationEmail({
  orderNumber = "SOL-2026-00001",
  customerName = "Cliente",
  items = [],
  subtotalCents = 0,
  shippingCents = 0,
  taxCents = 0,
  totalCents = 0,
  shippingAddress = { line1: "", city: "", postalCode: "", country: "ES" },
  appUrl = "https://solperfumesarabes.com",
}: {
  orderNumber?: string;
  customerName?: string;
  items?: Item[];
  subtotalCents?: number;
  shippingCents?: number;
  taxCents?: number;
  totalCents?: number;
  shippingAddress?: { line1: string; line2?: string; city: string; postalCode: string; country: string };
  appUrl?: string;
}) {
  return (
    <EmailShell preview={`Pedido ${orderNumber} confirmado · ${fmt(totalCents)}`} appUrl={appUrl}>
      <Text style={emailStyles.kicker}>Pedido confirmado</Text>
      <Text style={emailStyles.h1}>Gracias, {customerName}.</Text>
      <Text style={emailStyles.body}>
        Hemos recibido tu pedido <strong style={{ color: emailColors.gold }}>{orderNumber}</strong>.
        Lo prepararemos a mano en las próximas 24 horas y recibirás otro email cuando salga.
      </Text>

      <Hr style={{ borderColor: emailColors.goldDeep, opacity: 0.4, margin: "24px 0" }} />

      <Text style={emailStyles.h2}>Resumen</Text>

      {items.map((item) => (
        <Row key={item.sku} style={{ margin: "12px 0" }}>
          <Column style={{ width: "70%" }}>
            <Text style={{ color: emailColors.ink, fontSize: 15, margin: 0 }}>{item.name}</Text>
            <Text style={{ color: emailColors.muted, fontSize: 13, margin: "2px 0 0" }}>
              {item.sizeMl} ml · ×{item.quantity}
            </Text>
          </Column>
          <Column style={{ width: "30%", textAlign: "right" }}>
            <Text style={{ color: emailColors.ink, fontSize: 15, margin: 0 }}>
              {fmt(item.unitPriceCents * item.quantity)}
            </Text>
          </Column>
        </Row>
      ))}

      <Hr style={{ borderColor: emailColors.goldDeep, opacity: 0.4, margin: "16px 0" }} />

      <Row><Column><Text style={{ color: emailColors.muted, margin: "4px 0" }}>Subtotal</Text></Column>
        <Column style={{ textAlign: "right" }}><Text style={{ color: emailColors.ink, margin: "4px 0" }}>{fmt(subtotalCents)}</Text></Column>
      </Row>
      <Row><Column><Text style={{ color: emailColors.muted, margin: "4px 0" }}>Envío</Text></Column>
        <Column style={{ textAlign: "right" }}><Text style={{ color: emailColors.ink, margin: "4px 0" }}>{shippingCents === 0 ? "Gratis" : fmt(shippingCents)}</Text></Column>
      </Row>
      <Row><Column><Text style={{ color: emailColors.muted, margin: "4px 0" }}>IVA</Text></Column>
        <Column style={{ textAlign: "right" }}><Text style={{ color: emailColors.ink, margin: "4px 0" }}>{fmt(taxCents)}</Text></Column>
      </Row>

      <Hr style={{ borderColor: emailColors.goldDeep, margin: "16px 0" }} />

      <Row>
        <Column><Text style={{ ...emailStyles.h2, margin: 0 }}>Total</Text></Column>
        <Column style={{ textAlign: "right" }}>
          <Text style={{ color: emailColors.gold, fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 600, margin: 0 }}>
            {fmt(totalCents)}
          </Text>
        </Column>
      </Row>

      <Hr style={{ borderColor: emailColors.goldDeep, opacity: 0.4, margin: "24px 0" }} />

      <Text style={emailStyles.h2}>Dirección de envío</Text>
      <Text style={emailStyles.body}>
        {shippingAddress.line1}
        {shippingAddress.line2 ? <><br />{shippingAddress.line2}</> : null}
        <br />
        {shippingAddress.postalCode} {shippingAddress.city}
        <br />
        {shippingAddress.country}
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0 8px" }}>
        <Button href={`${appUrl}/cuenta/pedidos`} style={emailStyles.button}>
          Ver mi pedido
        </Button>
      </Section>
    </EmailShell>
  );
}
