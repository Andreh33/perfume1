import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";

const colors = {
  bg: "#1a1612",
  card: "#221c17",
  ink: "#f0e9dd",
  muted: "#b8a988",
  gold: "#d4a04e",
  goldDeep: "#8a6b30",
};

export function EmailShell({
  preview,
  children,
  appUrl = "https://solperfumesarabes.com",
}: {
  preview: string;
  children: React.ReactNode;
  appUrl?: string;
}) {
  return (
    <Html lang="es">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.bg, margin: 0, padding: 0, fontFamily: "Georgia, 'Times New Roman', serif", color: colors.ink }}>
        <Container style={{ margin: "0 auto", padding: "32px 0", maxWidth: 600 }}>
          <Section style={{ textAlign: "center", padding: "16px 0" }}>
            <Link href={appUrl}>
              <Img src={`${appUrl}/icon.svg`} width="56" height="56" alt="Sol Perfumes Árabes" />
            </Link>
            <Text
              style={{
                color: colors.gold,
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: "12px 0 0",
              }}
            >
              Sol Perfumes Árabes
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 36,
              border: `1px solid ${colors.goldDeep}`,
            }}
          >
            {children}
          </Section>

          <Hr style={{ borderColor: colors.goldDeep, opacity: 0.4, margin: "32px 0" }} />

          <Section style={{ textAlign: "center", padding: "0 16px" }}>
            <Text style={{ color: colors.muted, fontSize: 12, margin: "0 0 8px" }}>
              <Link href={`${appUrl}/perfumes`} style={{ color: colors.gold, textDecoration: "none", marginRight: 12 }}>
                Tienda
              </Link>
              <Link href={`${appUrl}/ferias`} style={{ color: colors.gold, textDecoration: "none", marginRight: 12 }}>
                Ferias
              </Link>
              <Link href={`${appUrl}/blog`} style={{ color: colors.gold, textDecoration: "none" }}>
                Diario
              </Link>
            </Text>
            <Text style={{ color: "#7a6f5c", fontSize: 11, margin: 0 }}>
              © {new Date().getFullYear()} Sol Perfumes Árabes S.L. · Calle Serrano 12, 28001 Madrid
            </Text>
            <Text style={{ color: "#7a6f5c", fontSize: 11, margin: "8px 0 0" }}>
              <Link href={`${appUrl}/cuenta/preferencias/email`} style={{ color: "#7a6f5c", textDecoration: "underline" }}>
                Gestionar suscripción
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailColors = colors;

export const emailStyles = {
  h1: { color: colors.ink, fontSize: 32, fontWeight: 500 as const, lineHeight: 1.15, margin: "0 0 16px" },
  h2: { color: colors.ink, fontSize: 22, fontWeight: 500 as const, margin: "24px 0 12px" },
  body: { color: colors.muted, fontSize: 16, lineHeight: 1.6, margin: "0 0 16px" },
  button: {
    backgroundColor: colors.gold,
    color: colors.bg,
    padding: "14px 28px",
    borderRadius: 999,
    textDecoration: "none",
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 12,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    display: "inline-block",
  },
  kicker: {
    color: colors.gold,
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
    margin: "0 0 8px",
  },
};
