import { Button, Section, Text } from "@react-email/components";
import { EmailShell, emailStyles } from "./_shell";

export default function EmailVerificationEmail({
  verifyUrl = "https://solperfumesarabes.com/cuenta/verificar?token=xxx",
  appUrl = "https://solperfumesarabes.com",
}: {
  verifyUrl?: string;
  appUrl?: string;
}) {
  return (
    <EmailShell preview="Confirma tu email" appUrl={appUrl}>
      <Text style={emailStyles.kicker}>Confirmación</Text>
      <Text style={emailStyles.h1}>Confirma tu email</Text>
      <Text style={emailStyles.body}>
        Solo un paso más. Pulsa el botón para confirmar que esta dirección es tuya y completar tu
        cuenta en Sol Perfumes Árabes.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={verifyUrl} style={emailStyles.button}>
          Confirmar email
        </Button>
      </Section>
    </EmailShell>
  );
}
