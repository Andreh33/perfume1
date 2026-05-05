import { Button, Section, Text } from "@react-email/components";
import { EmailShell, emailColors, emailStyles } from "./_shell";

export default function FairReminderEmail({
  fairTitle = "Esxence Milán",
  city = "Milán",
  country = "Italia",
  startDate = "19 de marzo",
  fairUrl = "#",
  appUrl = "https://solperfumesarabes.com",
}: {
  fairTitle?: string;
  city?: string;
  country?: string;
  startDate?: string;
  fairUrl?: string;
  appUrl?: string;
}) {
  return (
    <EmailShell preview={`Próxima feria: ${fairTitle}`} appUrl={appUrl}>
      <Text style={emailStyles.kicker}>Donde estaremos</Text>
      <Text style={emailStyles.h1}>Te esperamos en <span style={{ color: emailColors.gold }}>{fairTitle}</span></Text>
      <Text style={emailStyles.body}>
        Recuerda: del <strong>{startDate}</strong> estaremos en <strong>{city}, {country}</strong>.
        Ven a oler las nuevas colecciones, atender talleres y conocer a los perfumistas en persona.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={fairUrl} style={emailStyles.button}>
          Ver detalles
        </Button>
      </Section>
    </EmailShell>
  );
}
