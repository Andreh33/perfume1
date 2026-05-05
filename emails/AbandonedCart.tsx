import { Button, Img, Section, Text } from "@react-email/components";
import { EmailShell, emailColors, emailStyles } from "./_shell";

export default function AbandonedCartEmail({
  customerName = "amiga",
  itemImage = "",
  itemName = "Sultán al-Layl",
  cartUrl = "https://solperfumesarabes.com/carrito",
  appUrl = "https://solperfumesarabes.com",
}: {
  customerName?: string;
  itemImage?: string;
  itemName?: string;
  cartUrl?: string;
  appUrl?: string;
}) {
  return (
    <EmailShell preview="Tu perfume sigue esperándote" appUrl={appUrl}>
      <Text style={emailStyles.kicker}>Tu carrito</Text>
      <Text style={emailStyles.h1}>{customerName}, tu perfume aún te espera.</Text>
      <Text style={emailStyles.body}>
        Has dejado <strong style={{ color: emailColors.gold }}>{itemName}</strong> en tu carrito.
        Hemos guardado tu selección durante 7 días para que no pierdas el momento.
      </Text>

      {itemImage && (
        <Section style={{ textAlign: "center", margin: "20px 0" }}>
          <Img
            src={itemImage}
            width="240"
            height="300"
            alt={itemName}
            style={{ borderRadius: 8, border: `1px solid ${emailColors.goldDeep}` }}
          />
        </Section>
      )}

      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button href={cartUrl} style={emailStyles.button}>
          Continuar mi pedido
        </Button>
      </Section>
    </EmailShell>
  );
}
