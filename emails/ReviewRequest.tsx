import { Button, Section, Text } from "@react-email/components";
import { EmailShell, emailStyles } from "./_shell";

export default function ReviewRequestEmail({
  customerName = "amiga",
  productName = "tu perfume",
  reviewUrl = "https://solperfumesarabes.com/cuenta/pedidos",
  appUrl = "https://solperfumesarabes.com",
}: {
  customerName?: string;
  productName?: string;
  reviewUrl?: string;
  appUrl?: string;
}) {
  return (
    <EmailShell preview="¿Cómo te ha llegado tu perfume?" appUrl={appUrl}>
      <Text style={emailStyles.kicker}>Tu opinión</Text>
      <Text style={emailStyles.h1}>{customerName}, ¿cómo te ha llegado {productName}?</Text>
      <Text style={emailStyles.body}>
        Han pasado unos días desde que recibiste tu pedido. Tu opinión nos ayuda a seguir cuidando los
        detalles, y a otras personas a elegir mejor.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={reviewUrl} style={emailStyles.button}>
          Dejar mi reseña
        </Button>
      </Section>
      <Text style={{ ...emailStyles.body, fontSize: 13 }}>Te llevará menos de un minuto.</Text>
    </EmailShell>
  );
}
