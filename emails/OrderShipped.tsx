import { Button, Section, Text } from "@react-email/components";
import { EmailShell, emailColors, emailStyles } from "./_shell";

export default function OrderShippedEmail({
  orderNumber = "SOL-2026-00001",
  customerName = "Cliente",
  carrier = "Correos Express",
  trackingNumber = "ABC123456789",
  trackingUrl = "#",
  appUrl = "https://solperfumesarabes.com",
}: {
  orderNumber?: string;
  customerName?: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  appUrl?: string;
}) {
  return (
    <EmailShell preview={`Tu pedido ${orderNumber} está en camino`} appUrl={appUrl}>
      <Text style={emailStyles.kicker}>En camino</Text>
      <Text style={emailStyles.h1}>{customerName}, tu paquete viaja hacia ti.</Text>
      <Text style={emailStyles.body}>
        Hemos preparado tu pedido <strong style={{ color: emailColors.gold }}>{orderNumber}</strong> con
        cuidado. Lo encontrarás envuelto a mano con lazo dorado.
      </Text>

      <Section
        style={{
          backgroundColor: "#1a1612",
          padding: 24,
          borderRadius: 8,
          margin: "24px 0",
          textAlign: "center",
        }}
      >
        <Text style={emailStyles.kicker}>Seguimiento</Text>
        <Text style={{ color: emailColors.ink, fontSize: 14, margin: "8px 0 4px" }}>{carrier}</Text>
        <Text
          style={{
            color: emailColors.gold,
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: "0.1em",
            margin: "8px 0 16px",
          }}
        >
          {trackingNumber}
        </Text>
        <Button href={trackingUrl} style={emailStyles.button}>
          Seguir mi pedido
        </Button>
      </Section>

      <Text style={emailStyles.body}>
        Recuerda: si tu paquete llega dañado, escríbenos a{" "}
        <a href="mailto:hola@solperfumesarabes.com" style={{ color: emailColors.gold }}>
          hola@solperfumesarabes.com
        </a>{" "}
        en menos de 48 h con fotos y te enviaremos un reemplazo de inmediato.
      </Text>
    </EmailShell>
  );
}
