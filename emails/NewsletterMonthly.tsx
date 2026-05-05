import { Button, Hr, Section, Text } from "@react-email/components";
import { EmailShell, emailColors, emailStyles } from "./_shell";

type Block = { kicker: string; title: string; text: string; url: string; cta: string };

export default function NewsletterMonthlyEmail({
  month = "Mayo",
  blocks = [],
  appUrl = "https://solperfumesarabes.com",
}: {
  month?: string;
  blocks?: Block[];
  appUrl?: string;
}) {
  return (
    <EmailShell preview={`Carta perfumada · ${month}`} appUrl={appUrl}>
      <Text style={emailStyles.kicker}>Carta perfumada · {month}</Text>
      <Text style={emailStyles.h1}>Lo que perfuma este mes.</Text>

      {blocks.map((b, i) => (
        <Section key={`${b.kicker}-${i}`} style={{ margin: "32px 0" }}>
          <Text style={{ ...emailStyles.kicker, color: emailColors.gold }}>{b.kicker}</Text>
          <Text style={emailStyles.h2}>{b.title}</Text>
          <Text style={emailStyles.body}>{b.text}</Text>
          <Button href={b.url} style={{ ...emailStyles.button, padding: "10px 20px", fontSize: 11 }}>
            {b.cta}
          </Button>
          {i < blocks.length - 1 && (
            <Hr style={{ borderColor: emailColors.goldDeep, opacity: 0.3, margin: "32px 0 0" }} />
          )}
        </Section>
      ))}
    </EmailShell>
  );
}
