import { Button, Section, Text } from "@react-email/components";
import { EmailShell, emailStyles } from "./_shell";

export default function PasswordResetEmail({
  resetUrl = "https://solperfumesarabes.com/cuenta/recuperar?token=xxx",
  appUrl = "https://solperfumesarabes.com",
}: {
  resetUrl?: string;
  appUrl?: string;
}) {
  return (
    <EmailShell preview="Recupera tu contraseña" appUrl={appUrl}>
      <Text style={emailStyles.kicker}>Seguridad</Text>
      <Text style={emailStyles.h1}>Recupera tu contraseña</Text>
      <Text style={emailStyles.body}>
        Recibimos una petición para cambiar tu contraseña. Si fuiste tú, pulsa el botón. El enlace
        caduca en una hora.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={resetUrl} style={emailStyles.button}>
          Cambiar contraseña
        </Button>
      </Section>
      <Text style={{ ...emailStyles.body, fontSize: 13 }}>
        Si no fuiste tú, ignora este mensaje. Tu contraseña no cambiará y nadie podrá acceder a tu cuenta.
      </Text>
    </EmailShell>
  );
}
