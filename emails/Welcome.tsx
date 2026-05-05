import { Button, Section, Text } from "@react-email/components";
import { EmailShell, emailStyles } from "./_shell";

export default function WelcomeEmail({
  firstName = "amiga",
  appUrl = "https://solperfumesarabes.com",
  couponCode = "BIENVENIDA10",
}: {
  firstName?: string;
  appUrl?: string;
  couponCode?: string;
}) {
  return (
    <EmailShell preview="Bienvenida a Sol Perfumes Árabes — un regalo te espera" appUrl={appUrl}>
      <Text style={emailStyles.kicker}>Ahlan wa sahlan</Text>
      <Text style={emailStyles.h1}>Bienvenida, {firstName}.</Text>
      <Text style={emailStyles.body}>
        Acabas de unirte a una pequeña comunidad de personas que aman la perfumería árabe auténtica.
        Aquí no encontrarás imitaciones: cada attar y cada mukhallat se selecciona en visitas físicas
        a los talleres de Dubái, Damasco, Mascate y Marrakech.
      </Text>
      <Section style={{ backgroundColor: "#1a1612", padding: 24, borderRadius: 8, textAlign: "center", margin: "24px 0" }}>
        <Text style={{ ...emailStyles.kicker, margin: 0 }}>Tu regalo de bienvenida</Text>
        <Text style={{ ...emailStyles.h2, margin: "12px 0", fontSize: 32 }}>−10 % en tu primer pedido</Text>
        <Text
          style={{
            color: "#d4a04e",
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 18,
            letterSpacing: "0.3em",
            border: "1px dashed #8a6b30",
            padding: "10px 16px",
            display: "inline-block",
            margin: "8px 0 16px",
          }}
        >
          {couponCode}
        </Text>
      </Section>
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button href={`${appUrl}/perfumes`} style={emailStyles.button}>
          Descubrir perfumes
        </Button>
      </Section>
    </EmailShell>
  );
}
