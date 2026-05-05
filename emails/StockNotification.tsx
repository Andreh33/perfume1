import { Button, Section, Text } from "@react-email/components";
import { EmailShell, emailColors, emailStyles } from "./_shell";

export default function StockNotificationEmail({
  productName = "tu perfume",
  productUrl = "#",
  appUrl = "https://solperfumesarabes.com",
}: {
  productName?: string;
  productUrl?: string;
  appUrl?: string;
}) {
  return (
    <EmailShell preview={`${productName} ha vuelto`} appUrl={appUrl}>
      <Text style={emailStyles.kicker}>Vuelve a estar disponible</Text>
      <Text style={emailStyles.h1}>
        <span style={{ color: emailColors.gold }}>{productName}</span> ha vuelto.
      </Text>
      <Text style={emailStyles.body}>
        Lo pediste cuando estaba agotado. Ya puedes hacerte con tu unidad antes de que se vuelva a agotar.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={productUrl} style={emailStyles.button}>
          Comprar ahora
        </Button>
      </Section>
    </EmailShell>
  );
}
